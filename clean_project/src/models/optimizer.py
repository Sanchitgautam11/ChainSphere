import optuna
from sklearn.metrics import root_mean_squared_error
from src.models.forecaster import LGBMForecaster


def objective(trial, X_train, y_train, X_val, y_val):
    params = {
        'objective': 'regression',
        'metric': 'rmse',
        'boosting_type': 'gbdt',
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'num_leaves': trial.suggest_int('num_leaves', 20, 100),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'feature_fraction': trial.suggest_float('feature_fraction', 0.6, 1.0),
        'verbose': -1,
        'random_state': 42,
    }

    model = LGBMForecaster(params=params)
    model.fit(X_train, y_train, X_val, y_val)

    preds = model.predict(X_val)
    return root_mean_squared_error(y_val, preds)


def tune_hyperparameters(X_train, y_train, X_val, y_val, n_trials=20):
    print(f"Starting Optuna tuning for {n_trials} trials...")

    study = optuna.create_study(direction='minimize')
    study.optimize(
        lambda trial: objective(trial, X_train, y_train, X_val, y_val),
        n_trials=n_trials,
    )

    print("Best trial:")
    trial = study.best_trial
    print(f"  Value (RMSE): {trial.value}")
    print("  Params:")
    for key, value in trial.params.items():
        print(f"    {key}: {value}")

    return trial.params