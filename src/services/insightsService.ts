/**
 * Insights Service
 * Responsible for loading insights data from either:
 * 1. Static JSON files in public/data/insights
 * 2. API endpoints when available
 */

import envConfig from '../utils/envConfig';

interface InsightSummary {
  id: string;
  display_name: string;
  cohort: string;
  insight_type: string;
  summary: string;
}

// Function to load insights from the API
const fetchInsightsFromApi = async (): Promise<InsightSummary[]> => {
  try {
    const response = await fetch('/api/insights');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching insights from API:', error);
    // Fall back to static data if API fails
    return fetchInsightsFromStatic();
  }
};

// Function to load a specific insight detail from the API
const fetchInsightDetailFromApi = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`/api/insights/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching insight ${id} from API:`, error);
    // Fall back to static data if API fails
    return fetchInsightDetailFromStatic(id);
  }
};

// Function to load insights from static JSON files
const fetchInsightsFromStatic = async (): Promise<InsightSummary[]> => {
  try {
    // These would typically be loaded from a summary JSON file
    // For now, we'll hard-code the main insight IDs
    const insightIds = [
      'breast-cancer-cdk46-main',
      'nsclc-pd1-main',
      'mcrc-egfr-main',
      'biomarker-compliance'
    ];
    
    const insights = await Promise.all(
      insightIds.map(async (id) => {
        const data = await fetchInsightDetailFromStatic(id);
        return {
          id: data.id,
          display_name: data.display_name,
          cohort: data.cohort,
          insight_type: data.insight_type,
          summary: data.summary
        };
      })
    );
    
    return insights;
  } catch (error) {
    console.error('Error fetching insights from static files:', error);
    return [];
  }
};

// Function to load a specific insight detail from static JSON
const fetchInsightDetailFromStatic = async (id: string): Promise<any> => {
  try {
    // Map the ID to a file path - in a real application, this might be more sophisticated
    const fileName = `${id}.json`;
    const response = await fetch(`/data/insights/${fileName}`);
    
    if (!response.ok) {
      throw new Error(`Could not load insight file: ${fileName}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching insight ${id} from static files:`, error);
    return null;
  }
};

// Main function to get insights based on environment configuration
export const getInsights = async (): Promise<InsightSummary[]> => {
  if (envConfig.dataSource === 'api') {
    return fetchInsightsFromApi();
  }
  return fetchInsightsFromStatic();
};

// Main function to get insight detail based on environment configuration
export const getInsightDetail = async (id: string): Promise<any> => {
  if (envConfig.dataSource === 'api') {
    return fetchInsightDetailFromApi(id);
  }
  return fetchInsightDetailFromStatic(id);
}; 