import lightgbm as lgb
import xgboost as xgb
from prophet import Prophet
import pandas as pd
import numpy as np


class LGBMForecaster:
    def __init__(self, params=None):
        self.params = params or {
            'objective': 'regression',
            'metric': 'rmse',
            'boosting_type': 'gbdt',
            'learning_rate': 0.03,
            'num_leaves': 63,
            'min_child_samples': 20,
            'subsample': 0.8,
            'subsample_freq': 1,
            'colsample_bytree': 0.8,
            'reg_alpha': 0.1,
            'reg_lambda': 1.0,
            'min_split_gain': 0.01,
            'verbose': -1,
            'random_state': 42,
            'n_jobs': -1,
        }
        self.model = None

    def fit(self, X_train, y_train, X_val=None, y_val=None):
        train_data = lgb.Dataset(X_train, label=y_train)
        valid_sets = [train_data]
        valid_names = ['train']

        if X_val is not None and y_val is not None:
            val_data = lgb.Dataset(X_val, label=y_val, reference=train_data)
            valid_sets.append(val_data)
            valid_names.append('val')

        self.model = lgb.train(
            self.params,
            train_data,
            num_boost_round=2000,
            valid_sets=valid_sets,
            valid_names=valid_names,
            callbacks=[
                lgb.early_stopping(stopping_rounds=100, verbose=False),
                lgb.log_evaluation(period=-1),
            ],
        )

    def predict(self, X):
        preds = self.model.predict(X, num_iteration=self.model.best_iteration)
        return np.clip(preds, 0, None)

    def get_feature_importance(self, importance_type='gain'):
        if self.model is None:
            raise RuntimeError("Model not fitted yet.")
        imp = self.model.feature_importance(importance_type=importance_type)
        names = self.model.feature_name()
        return pd.Series(imp, index=names).sort_values(ascending=False)


class XGBForecaster:
    def __init__(self, params=None):
        self.params = params or {
            'objective': 'reg:squarederror',
            'eval_metric': 'rmse',
            'learning_rate': 0.03,
            'max_depth': 8,
            'min_child_weight': 5,
            'subsample': 0.8,
            'colsample_bytree': 0.8,
            'colsample_bylevel': 0.8,
            'gamma': 0.1,
            'reg_alpha': 0.1,
            'reg_lambda': 1.0,
            'random_state': 42,
            'tree_method': 'hist',
            'device': 'cpu',
            'n_jobs': -1,
        }
        self.model = None
        self.best_iteration = None

    def fit(self, X_train, y_train, X_val=None, y_val=None):
        dtrain = xgb.DMatrix(X_train, label=y_train, enable_categorical=True)
        evals = [(dtrain, 'train')]

        if X_val is not None and y_val is not None:
            dval = xgb.DMatrix(X_val, label=y_val, enable_categorical=True)
            evals.append((dval, 'val'))

        self.model = xgb.train(
            self.params,
            dtrain,
            num_boost_round=2000,
            evals=evals,
            early_stopping_rounds=100,
            verbose_eval=False,
        )
        self.best_iteration = self.model.best_iteration

    def predict(self, X):
        dtest = xgb.DMatrix(X, enable_categorical=True)
        preds = self.model.predict(dtest, iteration_range=(0, self.best_iteration + 1))
        return np.clip(preds, 0, None)

    def get_feature_importance(self, importance_type='gain'):
        if self.model is None:
            raise RuntimeError("Model not fitted yet.")
        scores = self.model.get_score(importance_type=importance_type)
        return pd.Series(scores).sort_values(ascending=False)


class ProphetForecaster:
    def __init__(
        self,
        country_holidays: str = None,
        extra_regressors: list = None,
        clip_negative: bool = True,
    ):
        self.country_holidays = country_holidays
        self.extra_regressors = extra_regressors or []
        self.clip_negative = clip_negative
        self.models = {}
        self._group_means = {}

    def _get_key(self, store_id, item_id):
        return f"{store_id}_{item_id}"

    def _build_model(self):
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            changepoint_prior_scale=0.1,
            seasonality_prior_scale=15.0,
            seasonality_mode='multiplicative',
            interval_width=0.80,
        )
        if self.country_holidays:
            model.add_country_holidays(country_name=self.country_holidays)
        for reg in self.extra_regressors:
            model.add_regressor(reg)
        return model

    def fit(self, df_train: pd.DataFrame):
        grouped = df_train.groupby(['store_id', 'item_id'])

        for (store_id, item_id), group in grouped:
            key = self._get_key(store_id, item_id)
            self._group_means[key] = group['sales'].mean()

            if len(group) < 10:
                continue

            cols = ['date', 'sales'] + self.extra_regressors
            df_prophet = group[cols].rename(columns={'date': 'ds', 'sales': 'y'}).copy()

            model = self._build_model()
            model.fit(df_prophet)
            self.models[key] = model

    def predict(self, df_test: pd.DataFrame) -> np.ndarray:
        df_out = df_test.copy()
        df_out['pred'] = np.nan

        for (store_id, item_id), group in df_out.groupby(['store_id', 'item_id']):
            key = self._get_key(store_id, item_id)

            if key in self.models:
                cols = ['date'] + self.extra_regressors
                df_prophet = group[cols].rename(columns={'date': 'ds'}).copy()
                forecast = self.models[key].predict(df_prophet)
                preds = forecast['yhat'].values
            else:
                preds = np.full(len(group), self._group_means.get(key, 0.0))

            if self.clip_negative:
                preds = np.clip(preds, 0, None)

            df_out.loc[group.index, 'pred'] = preds

        return df_out['pred'].values