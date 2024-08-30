// src/utils/logger.js

export function log(message, data = {}) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      message,
      ...data
    }));
  }
  
  export function error(message, error = null, data = {}) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      message,
      error: error ? error.toString() : null,
      ...data
    }));
  }