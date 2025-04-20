type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

type LogData = {
  message: string;
  level: LogLevel;
  timestamp: string;
  [key: string]: any; // Allow additional arbitrary data
};

function log(level: LogLevel, message: string, data: Record<string, any> = {}): void {
  const logEntry: LogData = {
    message,
    level,
    timestamp: new Date().toISOString(),
    ...data,
  };

  // Gebruik console[level] indien mogelijk voor betere integratie met logging platforms
  const levelLower = level.toLowerCase();
  if (levelLower === 'error') {
    console.error(JSON.stringify(logEntry));
  } else if (levelLower === 'warn') {
    console.warn(JSON.stringify(logEntry));
  } else if (levelLower === 'debug') {
    console.debug(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry)); // Default to console.log for INFO etc.
  }
}

export const logger = {
  info: (message: string, data?: Record<string, any>) => log('INFO', message, data),
  warn: (message: string, data?: Record<string, any>) => log('WARN', message, data),
  error: (message: string, error?: Error | unknown, data?: Record<string, any>) => {
    const errorData = { ...(data || {}) };
    if (error instanceof Error) {
      errorData.errorName = error.name;
      errorData.errorMessage = error.message;
      errorData.errorStack = error.stack;
    } else if (error) {
      errorData.errorDetails = error;
    }
    log('ERROR', message, errorData);
  },
  debug: (message: string, data?: Record<string, any>) => log('DEBUG', message, data),
}; 