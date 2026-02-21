export interface Farm {
  farm_id: number;
  uses_growmax: 0 | 1;
  yield_kg_per_hectare: number;
  crop_type: "wheat" | "rice" | "sorghum" | "maize" | "cotton";
  soil_type: "clay" | "loam" | "sandy";
  irrigation: "drip" | "flood" | "rainfed";
  rainfall_mm: number;
  altitude_m: number;
  farm_size_hectares: number;
  years_since_rotation: number;
  avg_march_temp_c: number;
}

export type FilterCondition = {
  field: keyof Farm;
  operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte";
  value: string | number;
};

export interface AnalysisRequest {
  test_type: "ttest" | "regression" | "anova" | "correlation";
  group_var: keyof Farm | null;
  outcome_var: keyof Farm;
  covariates: (keyof Farm)[];
  filters: FilterCondition[];
  description: string;
}

export interface StatResult {
  test_type: string;
  p_value: number;
  statistic: number;
  n: number;
  n_filtered: number;
  group_means?: Record<string, number>;
  coefficients?: Record<string, number>;
  r_squared?: number;
  description: string;
  significant: boolean;
}

export interface TrackerEntry {
  id: string;
  timestamp: number;
  request: AnalysisRequest;
  result: StatResult;
  summary: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  trackerEntry?: TrackerEntry;
}
