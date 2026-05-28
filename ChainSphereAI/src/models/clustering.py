import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


class ColdStartResolver:
    def __init__(self, n_clusters=5):
        self.n_clusters = n_clusters
        self.cluster_profiles = {}

        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), ['base_price']),
                ('cat', OneHotEncoder(handle_unknown='ignore'), ['category', 'dept_id']),
            ]
        )
        self.kmeans = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        self.pipeline = Pipeline(steps=[
            ('preprocessor', self.preprocessor),
            ('clusterer', self.kmeans),
        ])

    def fit(self, df_items, df_sales):
        features = df_items[['item_id', 'base_price', 'category', 'dept_id']].drop_duplicates()
        self.pipeline.fit(features)

        features['cluster'] = self.pipeline.predict(features)

        sales_with_clusters = df_sales.merge(features[['item_id', 'cluster']], on='item_id', how='left')
        sales_with_clusters['day_of_week'] = sales_with_clusters['date'].dt.dayofweek
        sales_with_clusters['month'] = sales_with_clusters['date'].dt.month

        profile = sales_with_clusters.groupby(['cluster', 'day_of_week', 'month'])['sales'].mean().reset_index()
        profile.rename(columns={'sales': 'proxy_sales'}, inplace=True)

        self.cluster_profiles = profile
        return self

    def impute_new_items(self, new_items_df, target_dates):
        if self.cluster_profiles.empty:
            raise ValueError("ColdStartResolver must be fitted first.")

        new_items_df = new_items_df.copy()
        new_items_df['cluster'] = self.pipeline.predict(new_items_df)

        dates_df = pd.DataFrame({'date': pd.to_datetime(target_dates)})
        dates_df['day_of_week'] = dates_df['date'].dt.dayofweek
        dates_df['month'] = dates_df['date'].dt.month

        new_items_df['key'] = 1
        dates_df['key'] = 1
        imputed = new_items_df.merge(dates_df, on='key').drop('key', axis=1)

        imputed = imputed.merge(self.cluster_profiles, on=['cluster', 'day_of_week', 'month'], how='left')

        overall_cluster_mean = self.cluster_profiles.groupby('cluster')['proxy_sales'].mean()
        imputed['proxy_sales'] = imputed['proxy_sales'].fillna(imputed['cluster'].map(overall_cluster_mean))

        return imputed