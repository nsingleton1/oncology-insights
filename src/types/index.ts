// Core insight data structure
export interface InsightData {
  id: string;
  display_name: string;
  cohort: string;
  insight_type: string;
  summary: string;
  chart: ChartData;
  financial_impact: FinancialImpact;
  clinical_impact: ClinicalImpact;
  weighted_score: number;
  action_steps: ActionStep[];
  drilldowns: Drilldown[];
  suggestions?: Suggestion[];
  peer_comparison?: PeerComparison;
}

// Chart data structure
export interface ChartData {
  type: string;
  unit: string;
  data: ChartDataPoint[];
  benchmark?: number;
  nccn_target?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  gap?: number;
  highlight?: boolean;
}

// Financial impact data
export interface FinancialImpact {
  annual_opportunity: string;
  math: string;
}

// Clinical impact data
export interface ClinicalImpact {
  description: string;
  metrics: ClinicalMetric[];
  quantitative: string;
}

export interface ClinicalMetric {
  type: string;
  value: string;
  description: string;
}

// Action steps
export interface ActionStep {
  text: string;
  icon: string;
}

// Drilldown options
export interface Drilldown {
  label: string;
  cohort: string;
  jsonFile: string;
  drilldownLevel: number;
}

// Suggestions for improvements
export interface Suggestion {
  text: string;
  impact: string;
}

// Peer comparison data
export interface PeerComparison {
  description: string;
  peer_benchmark: number;
  financial_impact: FinancialImpact;
  action_steps: ActionStep[];
}

// Tab management
export interface Tab {
  id: string;
  title: string;
  insight: InsightData;
  isPinned: boolean;
  isStarred: boolean;
}

// Cohort input
export interface CohortPrompt {
  id: string;
  text: string;
  jsonFile: string;
} 