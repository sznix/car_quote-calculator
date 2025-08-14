/**
 * Vehicle API endpoints
 * Provides RESTful API for vehicle data operations
 */

import VehicleDataService from '../services/vehicle-data-service.js';
import { VehicleDataValidator } from '../utils/vehicle-validator.js';
import VEHICLE_CONFIG from '../config/vehicle-config.js';

class VehicleAPI {
  constructor() {
    this.service = new VehicleDataService();
    this.validator = new VehicleDataValidator(VEHICLE_CONFIG.validation);
  }

  /**
   * Get all vehicles
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllVehicles(req, res) {
    try {
      const startTime = Date.now();
      const forceRefresh = req.query.refresh === 'true';
      
      const vehicles = await this.service.getAllVehicles(forceRefresh);
      
      this.service.logger.performance('getAllVehicles', startTime, {
        count: vehicles.length,
        forceRefresh
      });

      res.json({
        success: true,
        data: vehicles,
        count: vehicles.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.service.logger.error('API Error: getAllVehicles', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve vehicles',
        message: error.message
      });
    }
  }

  /**
   * Get vehicles by size
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getVehiclesBySize(req, res) {
    try {
      const { size } = req.params;
      const startTime = Date.now();

      if (!this.validator.isValidSize(size)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid size category',
          allowedSizes: VEHICLE_CONFIG.validation.allowedSizes
        });
      }

      const vehicles = await this.service.getVehiclesBySize(size);
      
      this.service.logger.performance('getVehiclesBySize', startTime, {
        size,
        count: vehicles.length
      });

      res.json({
        success: true,
        data: vehicles,
        size,
        count: vehicles.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.service.logger.error('API Error: getVehiclesBySize', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve vehicles by size',
        message: error.message
      });
    }
  }

  /**
   * Get vehicles by make
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getVehiclesByMake(req, res) {
    try {
      const { make } = req.params;
      const startTime = Date.now();

      if (!make || make.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Make parameter is required'
        });
      }

      const vehicles = await this.service.getVehiclesByMake(make);
      
      this.service.logger.performance('getVehiclesByMake', startTime, {
        make,
        count: vehicles.length
      });

      res.json({
        success: true,
        data: vehicles,
        make,
        count: vehicles.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.service.logger.error('API Error: getVehiclesByMake', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve vehicles by make',
        message: error.message
      });
    }
  }

  /**
   * Search vehicles
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async searchVehicles(req, res) {
    try {
      const criteria = req.query;
      const startTime = Date.now();

      // Validate search criteria
      const validCriteria = {};
      for (const [key, value] of Object.entries(criteria)) {
        if (value && value.trim().length > 0) {
          validCriteria[key] = value.trim();
        }
      }

      if (Object.keys(validCriteria).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one search criteria is required'
        });
      }

      const vehicles = await this.service.searchVehicles(validCriteria);
      
      this.service.logger.performance('searchVehicles', startTime, {
        criteria: validCriteria,
        count: vehicles.length
      });

      res.json({
        success: true,
        data: vehicles,
        criteria: validCriteria,
        count: vehicles.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.service.logger.error('API Error: searchVehicles', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search vehicles',
        message: error.message
      });
    }
  }

  /**
   * Get vehicle statistics
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getVehicleStats(req, res) {
    try {
      const startTime = Date.now();
      const vehicles = await this.service.getAllVehicles();
      
      // Calculate statistics
      const stats = {
        total: vehicles.length,
        bySize: {},
        byMake: {},
        cacheStats: this.service.getCacheStats()
      };

      // Count by size
      for (const vehicle of vehicles) {
        stats.bySize[vehicle.size] = (stats.bySize[vehicle.size] || 0) + 1;
        stats.byMake[vehicle.make] = (stats.byMake[vehicle.make] || 0) + 1;
      }

      this.service.logger.performance('getVehicleStats', startTime, {
        total: stats.total
      });

      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.service.logger.error('API Error: getVehicleStats', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve vehicle statistics',
        message: error.message
      });
    }
  }

  /**
   * Clear cache
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async clearCache(req, res) {
    try {
      this.service.clearCache();
      
      res.json({
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.service.logger.error('API Error: clearCache', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cache',
        message: error.message
      });
    }
  }

  /**
   * Get API health status
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getHealth(req, res) {
    try {
      const startTime = Date.now();
      const vehicles = await this.service.getAllVehicles();
      
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        vehicleCount: vehicles.length,
        cacheStats: this.service.getCacheStats(),
        config: {
          dataSource: VEHICLE_CONFIG.dataSource.type,
          cacheEnabled: VEHICLE_CONFIG.dataSource.cacheEnabled,
          allowedSizes: VEHICLE_CONFIG.validation.allowedSizes
        }
      };

      this.service.logger.performance('getHealth', startTime);

      res.json(health);
    } catch (error) {
      this.service.logger.error('API Error: getHealth', error);
      res.status(503).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default VehicleAPI;