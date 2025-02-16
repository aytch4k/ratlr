/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENVIRONMENT: 'development' | 'staging' | 'production';
  
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  
  readonly VITE_CHAIN_ID: string;
  readonly VITE_RPC_URL: string;
  readonly VITE_BLOCK_EXPLORER_URL: string;
  
  readonly VITE_MQTT_URL: string;
  readonly VITE_MQTT_CLIENT_ID: string;
  readonly VITE_MQTT_USERNAME: string;
  readonly VITE_MQTT_PASSWORD: string;
  
  readonly VITE_IPFS_GATEWAY: string;
  readonly VITE_IPFS_API_URL: string;
  
  readonly VITE_ENABLE_TESTNET: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  
  readonly VITE_DISCORD_CLIENT_ID: string;
  readonly VITE_TELEGRAM_BOT_USERNAME: string;
  
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_GA_TRACKING_ID: string;
  
  readonly VITE_DEFAULT_THEME: 'light' | 'dark';
  readonly VITE_DEFAULT_LOCALE: string;
  
  readonly VITE_API_RATE_LIMIT: string;
  readonly VITE_API_RATE_LIMIT_PERIOD: string;
  
  readonly VITE_CACHE_TTL: string;
  readonly VITE_MAX_CACHE_SIZE: string;
  
  readonly VITE_CSP_ENABLED: string;
  readonly VITE_CORS_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Helper function to parse environment variables
export const getEnvVar = (key: keyof ImportMetaEnv): string => {
  const value = import.meta.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

// Helper function to parse boolean environment variables
export const getEnvBoolean = (key: keyof ImportMetaEnv): boolean => {
  const value = getEnvVar(key).toLowerCase();
  return value === 'true' || value === '1';
};

// Helper function to parse number environment variables
export const getEnvNumber = (key: keyof ImportMetaEnv): number => {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} is not a valid number`);
  }
  return parsed;
};

// Environment configuration object
export const env = {
  app: {
    name: getEnvVar('VITE_APP_NAME'),
    version: getEnvVar('VITE_APP_VERSION'),
    environment: getEnvVar('VITE_APP_ENVIRONMENT'),
  },
  api: {
    url: getEnvVar('VITE_API_URL'),
    timeout: getEnvNumber('VITE_API_TIMEOUT'),
  },
  blockchain: {
    chainId: getEnvNumber('VITE_CHAIN_ID'),
    rpcUrl: getEnvVar('VITE_RPC_URL'),
    explorerUrl: getEnvVar('VITE_BLOCK_EXPLORER_URL'),
  },
  mqtt: {
    url: getEnvVar('VITE_MQTT_URL'),
    clientId: getEnvVar('VITE_MQTT_CLIENT_ID'),
    username: getEnvVar('VITE_MQTT_USERNAME'),
    password: getEnvVar('VITE_MQTT_PASSWORD'),
  },
  ipfs: {
    gateway: getEnvVar('VITE_IPFS_GATEWAY'),
    apiUrl: getEnvVar('VITE_IPFS_API_URL'),
  },
  features: {
    testnet: getEnvBoolean('VITE_ENABLE_TESTNET'),
    analytics: getEnvBoolean('VITE_ENABLE_ANALYTICS'),
    notifications: getEnvBoolean('VITE_ENABLE_NOTIFICATIONS'),
  },
  services: {
    discordClientId: getEnvVar('VITE_DISCORD_CLIENT_ID'),
    telegramBotUsername: getEnvVar('VITE_TELEGRAM_BOT_USERNAME'),
  },
  monitoring: {
    sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
    gaTrackingId: getEnvVar('VITE_GA_TRACKING_ID'),
  },
  ui: {
    defaultTheme: getEnvVar('VITE_DEFAULT_THEME'),
    defaultLocale: getEnvVar('VITE_DEFAULT_LOCALE'),
  },
  rateLimit: {
    limit: getEnvNumber('VITE_API_RATE_LIMIT'),
    period: getEnvNumber('VITE_API_RATE_LIMIT_PERIOD'),
  },
  cache: {
    ttl: getEnvNumber('VITE_CACHE_TTL'),
    maxSize: getEnvNumber('VITE_MAX_CACHE_SIZE'),
  },
  security: {
    cspEnabled: getEnvBoolean('VITE_CSP_ENABLED'),
    corsEnabled: getEnvBoolean('VITE_CORS_ENABLED'),
  },
} as const;