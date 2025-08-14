/**
 * Logger utility for vehicle data operations
 */

export class Logger {
  constructor(config) {
    this.enabled = config.enabled;
    this.level = config.level;
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {any} data - Additional data
   */
  error(message, data = null) {
    if (this.enabled && this.shouldLog('error')) {
      const logEntry = this.formatLogEntry('ERROR', message, data);
      console.error(logEntry);
    }
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {any} data - Additional data
   */
  warn(message, data = null) {
    if (this.enabled && this.shouldLog('warn')) {
      const logEntry = this.formatLogEntry('WARN', message, data);
      console.warn(logEntry);
    }
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {any} data - Additional data
   */
  info(message, data = null) {
    if (this.enabled && this.shouldLog('info')) {
      const logEntry = this.formatLogEntry('INFO', message, data);
      console.log(logEntry);
    }
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {any} data - Additional data
   */
  debug(message, data = null) {
    if (this.enabled && this.shouldLog('debug')) {
      const logEntry = this.formatLogEntry('DEBUG', message, data);
      console.log(logEntry);
    }
  }

  /**
   * Check if should log at given level
   * @param {string} level - Log level
   * @returns {boolean} True if should log
   */
  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  /**
   * Format log entry
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @returns {string} Formatted log entry
   */
  formatLogEntry(level, message, data) {
    const timestamp = new Date().toISOString();
    let logEntry = `[${timestamp}] [${level}] ${message}`;
    
    if (data !== null) {
      if (typeof data === 'object') {
        logEntry += ` ${JSON.stringify(data, null, 2)}`;
      } else {
        logEntry += ` ${data}`;
      }
    }
    
    return logEntry;
  }

  /**
   * Create performance log entry
   * @param {string} operation - Operation name
   * @param {number} startTime - Start time in milliseconds
   * @param {any} additionalData - Additional data to log
   */
  performance(operation, startTime, additionalData = null) {
    const duration = Date.now() - startTime;
    this.info(`Performance: ${operation} completed in ${duration}ms`, additionalData);
  }
}