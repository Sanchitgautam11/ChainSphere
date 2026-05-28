import numpy as np
from sklearn.metrics import root_mean_squared_error, mean_absolute_error

def evaluate_predictions(y_true, y_pred, df_metadata):
    """
    Evaluates predictions using standard ML metrics.
    """
    metrics = {
        'RMSE': root_mean_squared_error(y_true, y_pred),
        'MAE': mean_absolute_error(y_true, y_pred)
    }
    return metrics

def calculate_business_value(df_test, y_pred, y_baseline):
    """
    Translates forecasting accuracy into dollar amounts saved.
    
    Overstocking incurs a holding/spoilage cost. We'll set this at 20% of the base_price.
    Understocking incurs a lost opportunity cost (profit margin). We'll set profit margin at 40% of base_price.
    """
    df = df_test.copy()
    df['actual_demand'] = df['sales']
    df['pred_demand'] = np.maximum(0, np.round(y_pred))
    df['baseline_demand'] = np.maximum(0, np.round(y_baseline))
    
    # Cost Parameters
    # In a real scenario, unit cost and selling price are provided.
    df['unit_cost'] = df['base_price'] * 0.6  # Assume 40% margin
    df['holding_cost_rate'] = 0.20 # 20% of base price to hold/spoil
    df['lost_margin'] = df['base_price'] - df['unit_cost']
    
    def calc_costs(actual, predicted):
        # Overstock: predicted > actual
        overstock_qty = np.maximum(0, predicted - actual)
        overstock_cost = overstock_qty * (df['base_price'] * df['holding_cost_rate'])
        
        # Understock: actual > predicted
        understock_qty = np.maximum(0, actual - predicted)
        understock_cost = understock_qty * df['lost_margin']
        
        return overstock_cost, understock_cost

    # Model Costs
    model_over, model_under = calc_costs(df['actual_demand'], df['pred_demand'])
    df['model_total_cost'] = model_over + model_under
    
    # Baseline Costs
    base_over, base_under = calc_costs(df['actual_demand'], df['baseline_demand'])
    df['baseline_total_cost'] = base_over + base_under
    
    # Value Add
    df['dollars_saved'] = df['baseline_total_cost'] - df['model_total_cost']
    
    results = {
        'Total Model Cost': df['model_total_cost'].sum(),
        'Total Baseline Cost': df['baseline_total_cost'].sum(),
        'Net Dollars Saved': df['dollars_saved'].sum(),
        'Total Overstock Cost (Model)': model_over.sum(),
        'Total Understock Cost (Model)': model_under.sum()
    }
    
    return results, df
