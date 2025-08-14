/**
 * Vehicle Data Service
 * Handles vehicle data operations with support for multiple data sources
 */

import VEHICLE_CONFIG from '../config/vehicle-config.js';
import { VehicleDataValidator } from '../utils/vehicle-validator.js';
import { Logger } from '../utils/logger.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for relative path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class VehicleDataService {
  constructor() {
    this.logger = new Logger(VEHICLE_CONFIG.logging);
    this.validator = new VehicleDataValidator(VEHICLE_CONFIG.validation);
    this.cache = new Map();
    this.cacheTimestamps = new Map();
  }

  /**
   * Get all vehicle models
   * @param {boolean} forceRefresh - Force refresh cache
   * @returns {Promise<Array>} Array of vehicle models
   */
  async getAllVehicles(forceRefresh = false) {
    try {
      // Check cache first
      if (!forceRefresh && this.isCacheValid('all_vehicles')) {
        this.logger.info('Returning cached vehicle data');
        return this.cache.get('all_vehicles');
      }

      // Load data from source
      const vehicles = await this.loadFromDataSource();
      
      // Validate data
      const validatedVehicles = vehicles.filter(vehicle => 
        this.validator.validateVehicle(vehicle)
      );

      // Update cache
      this.updateCache('all_vehicles', validatedVehicles);
      
      this.logger.info(`Loaded ${validatedVehicles.length} vehicles from data source`);
      return validatedVehicles;
    } catch (error) {
      this.logger.error('Error loading vehicle data:', error);
      throw new Error('Failed to load vehicle data');
    }
  }

  /**
   * Get vehicles by size category
   * @param {string} size - Vehicle size category
   * @returns {Promise<Array>} Array of vehicles in the specified size
   */
  async getVehiclesBySize(size) {
    try {
      if (!this.validator.isValidSize(size)) {
        throw new Error(`Invalid size category: ${size}`);
      }

      const allVehicles = await this.getAllVehicles();
      return allVehicles.filter(vehicle => vehicle.size === size);
    } catch (error) {
      this.logger.error(`Error getting vehicles by size ${size}:`, error);
      throw error;
    }
  }

  /**
   * Get vehicles by make
   * @param {string} make - Vehicle make
   * @returns {Promise<Array>} Array of vehicles by the specified make
   */
  async getVehiclesByMake(make) {
    try {
      if (!make || make.trim().length === 0) {
        throw new Error('Make parameter is required');
      }

      const allVehicles = await this.getAllVehicles();
      return allVehicles.filter(vehicle => 
        vehicle.make.toLowerCase() === make.toLowerCase()
      );
    } catch (error) {
      this.logger.error(`Error getting vehicles by make ${make}:`, error);
      throw error;
    }
  }

  /**
   * Search vehicles by criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} Array of matching vehicles
   */
  async searchVehicles(criteria = {}) {
    try {
      const allVehicles = await this.getAllVehicles();
      
      return allVehicles.filter(vehicle => {
        return Object.entries(criteria).every(([key, value]) => {
          if (typeof value === 'string') {
            return vehicle[key]?.toLowerCase().includes(value.toLowerCase());
          }
          return vehicle[key] === value;
        });
      });
    } catch (error) {
      this.logger.error('Error searching vehicles:', error);
      throw error;
    }
  }

  /**
   * Load data from configured data source
   * @returns {Promise<Array>} Array of vehicle data
   */
  async loadFromDataSource() {
    const { type, path, apiUrl } = VEHICLE_CONFIG.dataSource;

    switch (type) {
      case 'json':
        return await this.loadFromJson(path);
      case 'api':
        return await this.loadFromApi(apiUrl);
      case 'database':
        return await this.loadFromDatabase();
      default:
        throw new Error(`Unsupported data source type: ${type}`);
    }
  }

  /**
   * Load data from JSON file
   * @param {string} path - Path to JSON file
   * @returns {Promise<Array>} Array of vehicle data
   */
  async loadFromJson(path) {
    try {
      // Resolve relative path from current directory
      const resolvedPath = path.startsWith('./') 
        ? join(__dirname, '..', '..', path.substring(2))
        : path;
      
      const data = await readFile(resolvedPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Error loading JSON from ${path}:`, error);
      throw error;
    }
  }

  /**
   * Load data from API
   * @param {string} apiUrl - API endpoint URL
   * @returns {Promise<Array>} Array of vehicle data
   */
  async loadFromApi(apiUrl) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      this.logger.error(`Error loading from API ${apiUrl}:`, error);
      throw error;
    }
  }

  /**
   * Load data from database (placeholder for future implementation)
   * @returns {Promise<Array>} Array of vehicle data
   */
  async loadFromDatabase() {
    // TODO: Implement database connection and query
    throw new Error('Database data source not yet implemented');
  }

  /**
   * Check if cache is valid
   * @param {string} key - Cache key
   * @returns {boolean} True if cache is valid
   */
  isCacheValid(key) {
    if (!VEHICLE_CONFIG.dataSource.cacheEnabled) {
      return false;
    }

    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) {
      return false;
    }

    const now = Date.now();
    const ttl = VEHICLE_CONFIG.dataSource.cacheTTL * 1000;
    return (now - timestamp) < ttl;
  }

  /**
   * Update cache with new data
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  updateCache(key, data) {
    if (VEHICLE_CONFIG.dataSource.cacheEnabled) {
      this.cache.set(key, data);
      this.cacheTimestamps.set(key, Date.now());
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.cacheTimestamps.clear();
    this.logger.info('Vehicle data cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timestamps: Object.fromEntries(this.cacheTimestamps)
    };
  }
}

export default VehicleDataService;