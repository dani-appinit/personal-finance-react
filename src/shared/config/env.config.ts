// Environment Configuration
// Access to Vite environment variables

interface EnvConfig {
  // Environment
  env: string;
  appName: string;
  
  // API
  apiUrl: string;
  apiTimeout: number;
  
  // Auth
  authTokenKey: string;
  authSessionTimeout: number;
  
  // Features
  enableDevtools: boolean;
  enableMockApi: boolean;
  enableDebugMode: boolean;
  
  // Analytics
  enableAnalytics: boolean;
  analyticsId: string;
  
  // Logging
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  
  // Sentry (optional)
  sentryDsn?: string;
  sentryEnvironment?: string;
  
  // Performance
  enableServiceWorker?: boolean;
}

const config: EnvConfig = {
  env: import.meta.env.VITE_APP_ENV || 'development',
  appName: import.meta.env.VITE_APP_NAME || 'Personal Finance Tracker',
  
  apiUrl: import.meta.env.API || 'https://financialproyect.free.beeceptor.com',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  authSessionTimeout: Number(import.meta.env.VITE_AUTH_SESSION_TIMEOUT) || 3600000,
  
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
  
  logLevel: (import.meta.env.VITE_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  sentryEnvironment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  
  enableServiceWorker: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
};



export default config;
