import pandas as pd
import numpy as np
from datetime import timedelta
import os

def generate_synthetic_data(
    num_stores=5,
    num_items=50,
    num_departments=5,
    start_date='2020-01-01',
    end_date='2023-12-31',
    output_path='data/retail_data.csv'
):
    """
    Generates synthetic retail dataset mirroring real-world patterns like 
    seasonality, promotions, and new product introductions (cold start).
    """
    print(f"Generating synthetic data from {start_date} to {end_date}...")
    np.random.seed(42)
    
    dates = pd.date_range(start=start_date, end=end_date)
    
    # Store metadata
    stores = pd.DataFrame({
        'store_id': range(1, num_stores + 1),
        'store_size': np.random.choice(['Small', 'Medium', 'Large'], num_stores),
        'store_type': np.random.choice(['Urban', 'Suburban', 'Rural'], num_stores)
    })
    
    # Item metadata
    items = pd.DataFrame({
        'item_id': range(1, num_items + 1),
        'dept_id': np.random.randint(1, num_departments + 1, num_items),
        'base_price': np.random.uniform(5.0, 100.0, num_items).round(2),
        'category': np.random.choice(['Electronics', 'Groceries', 'Clothing', 'Home', 'Toys'], num_items),
        'launch_date': [
            pd.to_datetime(start_date) if np.random.rand() < 0.8 
            else pd.to_datetime(start_date) + timedelta(days=np.random.randint(100, 1000))
            for _ in range(num_items)
        ]
    })
    
    # Create cartesian product of stores, items, and dates
    # To save memory and time for synthetic data, we will generate row by row iteratively or use merge
    # But since it's only 5*50*1461 = ~365,000 rows, a cross merge is fine.
    
    # For a cross join, we create a dummy key
    df_dates = pd.DataFrame({'date': dates, 'key': 1})
    df_stores = stores.assign(key=1)
    df_items = items.assign(key=1)
    
    df = df_dates.merge(df_stores, on='key').merge(df_items, on='key').drop('key', axis=1)
    
    # Filter out records before an item's launch date (simulating cold starts)
    df = df[df['date'] >= df['launch_date']].copy()
    
    # Generate Sales
    # 1. Base demand depends on store size and item price
    store_multiplier = df['store_size'].map({'Small': 0.5, 'Medium': 1.0, 'Large': 1.5})
    price_elasticity = 100 / df['base_price']
    base_demand = 10 * store_multiplier * price_elasticity
    
    # 2. Seasonality (weekly and yearly)
    day_of_week_effect = df['date'].dt.dayofweek.map({0: 1.0, 1: 0.9, 2: 0.9, 3: 1.0, 4: 1.2, 5: 1.5, 6: 1.3})
    month_of_year_effect = 1 + 0.3 * np.sin(2 * np.pi * df['date'].dt.month / 12)
    
    # 3. Promotions (random spikes)
    df['is_promo'] = np.random.choice([0, 1], size=len(df), p=[0.9, 0.1])
    promo_effect = np.where(df['is_promo'] == 1, np.random.uniform(1.5, 3.0, len(df)), 1.0)
    
    # 4. Holidays (e.g., December surge)
    holiday_effect = np.where(df['date'].dt.month == 12, 1.5, 1.0)
    
    # Combine effects
    mean_sales = base_demand * day_of_week_effect * month_of_year_effect * promo_effect * holiday_effect
    
    # Add noise (Poisson distribution makes sense for count data like sales)
    df['sales'] = np.random.poisson(mean_sales)
    
    # Introduce some out-of-stock events (sales = 0 despite demand)
    out_of_stock = np.random.rand(len(df)) < 0.05
    df.loc[out_of_stock, 'sales'] = 0
    
    # Final cleanup
    cols_to_keep = ['date', 'store_id', 'item_id', 'dept_id', 'category', 'base_price', 'is_promo', 'sales']
    df = df[cols_to_keep]
    
    # Sort
    df = df.sort_values(['store_id', 'item_id', 'date']).reset_index(drop=True)
    
    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Saved synthetic dataset with {len(df)} rows to {output_path}")
    
    return df

def load_data(path='data/retail_data.csv'):
    """Loads the dataset, generating it if it doesn't exist."""
    if not os.path.exists(path):
        generate_synthetic_data(output_path=path)
    
    df = pd.read_csv(path, parse_dates=['date'])
    return df

if __name__ == "__main__":
    generate_synthetic_data()
