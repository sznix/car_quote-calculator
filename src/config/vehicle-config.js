/**
 * Vehicle configuration settings
 * This file centralizes all vehicle-related configuration
 */

export const VEHICLE_CONFIG = {
  // Data source configuration
  dataSource: {
    type: process.env.VEHICLE_DATA_SOURCE || 'json', // 'json', 'api', 'database'
    path: process.env.VEHICLE_DATA_PATH || './assets/js/data/vehicle-models.json',
    apiUrl: process.env.VEHICLE_API_URL || null,
    cacheEnabled: process.env.VEHICLE_CACHE_ENABLED === 'true' || true,
    cacheTTL: parseInt(process.env.VEHICLE_CACHE_TTL) || 3600, // 1 hour
  },
  
  // Vehicle size categories
  sizeCategories: {
    sedan: { minLength: 4.5, maxLength: 5.0, minWidth: 1.7, maxWidth: 1.9 },
    sports: { minLength: 4.2, maxLength: 4.8, minWidth: 1.8, maxWidth: 2.0 },
    small_suv: { minLength: 4.4, maxLength: 4.7, minWidth: 1.8, maxWidth: 1.9 },
    large_suv: { minLength: 5.0, maxLength: 5.5, minWidth: 1.9, maxWidth: 2.1 },
    full_van: { minLength: 5.2, maxLength: 6.0, minWidth: 2.0, maxWidth: 2.2 },
    boat: { minLength: 5.0, maxLength: 8.0, minWidth: 2.0, maxWidth: 2.5 }
  },
  
  // Validation rules
  validation: {
    requiredFields: ['make', 'model', 'size'],
    makeMaxLength: 50,
    modelMaxLength: 50,
    allowedSizes: ['sedan', 'sports', 'small_suv', 'large_suv', 'full_van', 'boat']
  },
  
  // Logging configuration
  logging: {
    enabled: process.env.VEHICLE_LOGGING_ENABLED === 'true' || true,
    level: process.env.VEHICLE_LOG_LEVEL || 'info'
  }
};

export default VEHICLE_CONFIG;