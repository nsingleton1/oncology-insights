export interface InsightData {
  id?: string;
  display_name?: string;
  cohort: string;
  insight_type: string;
  summary: string;
  // Support both old and new format
  chart_data?: ChartDataPoint[];
  benchmark?: number;
  chart?: {
    type: string;
    unit: string;
    data: ChartDataPoint[];
    benchmark: number;
    nccn_target: number;
  };
  financial_impact?: {
    annual_opportunity: string;
    math: string;
  };
  clinical_impact?: {
    description: string;
    quantitative: string;
    metrics?: ClinicalMetric[];
  };
  peer_comparison?: {
    description: string;
    peer_benchmark: number;
    financial_impact?: {
      annual_opportunity: string;
      math: string;
    };
    action_steps?: (string | ActionStep)[];
  };
  weighted_score?: number;
  action_steps?: (string | ActionStep)[];
  suggestions: (string | ActionStep)[];
  drilldowns?: DrilldownOption[];
  
  // Legacy fields
  table?: TableRow[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  gap?: number;
  highlight?: boolean;
  fill?: string;
}

export interface DrilldownOption {
  label: string;
  cohort: string;
  jsonFile: string;
  drilldownLevel: number;
}

export interface TableRow {
  provider: string;
  utilization_rate: string;
  peer_avg: string;
  revenue_gap: string;
}

export interface Tab {
  id: string;
  title: string;
  insight: InsightData;
  isPinned: boolean;
  isStarred: boolean;
}

export interface CohortPrompt {
  id: string;
  text: string;
  jsonFile: string;
}

export interface ActionStep {
  text: string;
  icon?: string;
}

export interface ClinicalMetric {
  type: string;
  value: string;
  description: string;
} 