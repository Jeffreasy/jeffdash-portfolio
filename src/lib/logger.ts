type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

type LogData = {
  message: string;
  level: LogLevel;
  timestamp: string;
  [key: string]: any; // Allow additional arbitrary data
};

// Configuration for log rotation
const LOG_CONFIG = {
  maxLogSize: 5 * 1024 * 1024, // 5MB
  maxLogFiles: 5,
  logDirectory: process.env.LOG_DIRECTORY || './logs',
};

// In-memory log buffer for rotation
let logBuffer: LogData[] = [];

function rotateLogs(): void {
  try {
    // In a real implementation, this would write to files
    // For now, we'll just clear the buffer when it gets too large
    if (logBuffer.length > 1000) { // Arbitrary limit for demo
      logBuffer = logBuffer.slice(-500); // Keep last 500 entries
    }
  } catch (error) {
    console.error('Error rotating logs:', error);
  }
}

function formatLogEntry(entry: LogData): string {
  try {
    return JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString(),
    }, null, 2);
  } catch (error) {
    return JSON.stringify({
      message: 'Error formatting log entry',
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function log(level: LogLevel, message: string, data: Record<string, any> = {}): void {
  try {
    const logEntry: LogData = {
      message,
      level,
      timestamp: new Date().toISOString(),
      ...data,
    };

    // Add to buffer
    logBuffer.push(logEntry);

    // Check if we need to rotate logs
    rotateLogs();

    // Format the log entry
    const formattedLog = formatLogEntry(logEntry);

    // Use appropriate console method based on level
    const levelLower = level.toLowerCase();
    switch (levelLower) {
      case 'error':
        console.error(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'debug':
        console.debug(formattedLog);
        break;
      default:
        console.log(formattedLog);
    }
  } catch (error) {
    // Fallback logging if something goes wrong
    console.error('Logger error:', error);
    console.log(JSON.stringify({
      message: 'Logger error occurred',
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      originalMessage: message,
      error: error instanceof Error ? error.message : String(error),
    }));
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
  
  debug: (message: string, data?: Record<string, any>) => {
    // Only log debug messages in development
    if (process.env.NODE_ENV === 'development') {
      log('DEBUG', message, data);
    }
  },

  // Get recent logs (useful for debugging)
  getRecentLogs: (count: number = 100): LogData[] => {
    return logBuffer.slice(-count);
  },

  // Clear logs (useful for testing)
  clearLogs: (): void => {
    logBuffer = [];
  },
}; 