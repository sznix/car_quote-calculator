/**
 * Vehicle Data Validator
 * Validates vehicle data according to configured rules
 */

export class VehicleDataValidator {
  constructor(validationConfig) {
    this.config = validationConfig;
  }

  /**
   * Validate a single vehicle object
   * @param {Object} vehicle - Vehicle object to validate
   * @returns {boolean} True if vehicle is valid
   */
  validateVehicle(vehicle) {
    try {
      // Check required fields
      for (const field of this.config.requiredFields) {
        if (!vehicle[field]) {
          console.warn(`Missing required field: ${field}`, vehicle);
          return false;
        }
      }

      // Validate make
      if (!this.validateMake(vehicle.make)) {
        return false;
      }

      // Validate model
      if (!this.validateModel(vehicle.model)) {
        return false;
      }

      // Validate size
      if (!this.isValidSize(vehicle.size)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating vehicle:', error, vehicle);
      return false;
    }
  }

  /**
   * Validate vehicle make
   * @param {string} make - Vehicle make
   * @returns {boolean} True if make is valid
   */
  validateMake(make) {
    if (typeof make !== 'string') {
      console.warn('Make must be a string:', make);
      return false;
    }

    if (make.trim().length === 0) {
      console.warn('Make cannot be empty');
      return false;
    }

    if (make.length > this.config.makeMaxLength) {
      console.warn(`Make too long (max ${this.config.makeMaxLength}):`, make);
      return false;
    }

    // Check for common invalid characters
    const invalidChars = /[<>{}]/;
    if (invalidChars.test(make)) {
      console.warn('Make contains invalid characters:', make);
      return false;
    }

    return true;
  }

  /**
   * Validate vehicle model
   * @param {string} model - Vehicle model
   * @returns {boolean} True if model is valid
   */
  validateModel(model) {
    if (typeof model !== 'string') {
      console.warn('Model must be a string:', model);
      return false;
    }

    if (model.trim().length === 0) {
      console.warn('Model cannot be empty');
      return false;
    }

    if (model.length > this.config.modelMaxLength) {
      console.warn(`Model too long (max ${this.config.modelMaxLength}):`, model);
      return false;
    }

    // Check for common invalid characters
    const invalidChars = /[<>{}]/;
    if (invalidChars.test(model)) {
      console.warn('Model contains invalid characters:', model);
      return false;
    }

    return true;
  }

  /**
   * Check if size is valid
   * @param {string} size - Vehicle size
   * @returns {boolean} True if size is valid
   */
  isValidSize(size) {
    if (typeof size !== 'string') {
      console.warn('Size must be a string:', size);
      return false;
    }

    if (!this.config.allowedSizes.includes(size)) {
      console.warn(`Invalid size: ${size}. Allowed sizes:`, this.config.allowedSizes);
      return false;
    }

    return true;
  }

  /**
   * Validate an array of vehicles
   * @param {Array} vehicles - Array of vehicle objects
   * @returns {Object} Validation result with valid and invalid vehicles
   */
  validateVehicles(vehicles) {
    if (!Array.isArray(vehicles)) {
      throw new Error('Vehicles must be an array');
    }

    const result = {
      valid: [],
      invalid: [],
      total: vehicles.length,
      validCount: 0,
      invalidCount: 0
    };

    for (const vehicle of vehicles) {
      if (this.validateVehicle(vehicle)) {
        result.valid.push(vehicle);
        result.validCount++;
      } else {
        result.invalid.push(vehicle);
        result.invalidCount++;
      }
    }

    return result;
  }

  /**
   * Get validation statistics
   * @param {Array} vehicles - Array of vehicle objects
   * @returns {Object} Validation statistics
   */
  getValidationStats(vehicles) {
    const validation = this.validateVehicles(vehicles);
    
    return {
      total: validation.total,
      valid: validation.validCount,
      invalid: validation.invalidCount,
      validPercentage: ((validation.validCount / validation.total) * 100).toFixed(2),
      invalidPercentage: ((validation.invalidCount / validation.total) * 100).toFixed(2)
    };
  }

  /**
   * Sanitize vehicle data
   * @param {Object} vehicle - Vehicle object to sanitize
   * @returns {Object} Sanitized vehicle object
   */
  sanitizeVehicle(vehicle) {
    const sanitized = { ...vehicle };

    // Trim string fields
    if (sanitized.make) {
      sanitized.make = sanitized.make.trim();
    }
    if (sanitized.model) {
      sanitized.model = sanitized.model.trim();
    }
    if (sanitized.size) {
      sanitized.size = sanitized.size.trim();
    }

    // Normalize case for size
    if (sanitized.size) {
      sanitized.size = sanitized.size.toLowerCase();
    }

    return sanitized;
  }
}