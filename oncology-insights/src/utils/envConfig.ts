/**
 * Environment configuration utility
 * Provides type-safe access to environment variables
 */

interface EnvConfig {
  apiUrl: string;
  environment: string;
  isProduction: boolean;
  isDevelopment: boolean;
  appTitle: string;
  dataSource: 'static' | 'api';
  version: string;
}

// Default values for local development if env vars are not set
const defaultConfig: EnvConfig = {
  apiUrl: 'http://localhost:3001',
  environment: 'development',
  isProduction: false,
  isDevelopment: true,
  appTitle: 'Oncology Insights',
  dataSource: 'static',
  version: '0.1.0',
};

// Parse environment variables with defaults
const config: EnvConfig = {
  apiUrl: process.env.REACT_APP_API_URL || defaultConfig.apiUrl,
  environment: process.env.REACT_APP_ENVIRONMENT || defaultConfig.environment,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  appTitle: process.env.REACT_APP_TITLE || defaultConfig.appTitle,
  dataSource: (process.env.REACT_APP_DATA_SOURCE as 'static' | 'api') || defaultConfig.dataSource,
  version: process.env.REACT_APP_VERSION || defaultConfig.version,
};

export default config; 