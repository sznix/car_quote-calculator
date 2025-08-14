import test from 'node:test';
import assert from 'node:assert/strict';
import VehicleDataService from '../src/services/vehicle-data-service.js';
import { VehicleDataValidator } from '../src/utils/vehicle-validator.js';
import VEHICLE_CONFIG from '../src/config/vehicle-config.js';

// Test data integrity
test('vehicle models data integrity', async () => {
  const service = new VehicleDataService();
  const vehicles = await service.getAllVehicles();
  
  assert(Array.isArray(vehicles), 'models should be an array');
  assert(vehicles.length >= 30, 'should include at least 30 models');

  const sizes = new Set(VEHICLE_CONFIG.validation.allowedSizes);

  for (const entry of vehicles) {
    assert(entry.make, 'missing make');
    assert(entry.model, 'missing model');
    assert(entry.size, 'missing size');
    assert(sizes.has(entry.size), `invalid size: ${entry.size}`);
  }
});

// Test vehicle data service
test('vehicle data service functionality', async () => {
  const service = new VehicleDataService();
  
  // Test getAllVehicles
  const allVehicles = await service.getAllVehicles();
  assert(allVehicles.length > 0, 'should return vehicles');
  
  // Test getVehiclesBySize
  const sedans = await service.getVehiclesBySize('sedan');
  assert(sedans.length > 0, 'should return sedans');
  assert(sedans.every(v => v.size === 'sedan'), 'all returned vehicles should be sedans');
  
  // Test getVehiclesByMake
  const teslas = await service.getVehiclesByMake('Tesla');
  assert(teslas.length > 0, 'should return Teslas');
  assert(teslas.every(v => v.make.toLowerCase() === 'tesla'), 'all returned vehicles should be Teslas');
  
  // Test searchVehicles
  const searchResults = await service.searchVehicles({ size: 'sports', make: 'Porsche' });
  assert(searchResults.length > 0, 'should return search results');
  assert(searchResults.every(v => v.size === 'sports' && v.make === 'Porsche'), 'search results should match criteria');
});

// Test vehicle validator
test('vehicle data validator', () => {
  const validator = new VehicleDataValidator(VEHICLE_CONFIG.validation);
  
  // Test valid vehicle
  const validVehicle = { make: 'Toyota', model: 'Camry', size: 'sedan' };
  assert(validator.validateVehicle(validVehicle), 'should validate correct vehicle');
  
  // Test invalid vehicle - missing field
  const invalidVehicle1 = { make: 'Toyota', model: 'Camry' };
  assert(!validator.validateVehicle(invalidVehicle1), 'should reject vehicle missing size');
  
  // Test invalid vehicle - invalid size
  const invalidVehicle2 = { make: 'Toyota', model: 'Camry', size: 'invalid_size' };
  assert(!validator.validateVehicle(invalidVehicle2), 'should reject vehicle with invalid size');
  
  // Test invalid vehicle - empty make
  const invalidVehicle3 = { make: '', model: 'Camry', size: 'sedan' };
  assert(!validator.validateVehicle(invalidVehicle3), 'should reject vehicle with empty make');
  
  // Test size validation
  assert(validator.isValidSize('sedan'), 'should accept valid size');
  assert(!validator.isValidSize('invalid'), 'should reject invalid size');
});

// Test caching functionality
test('vehicle data service caching', async () => {
  const service = new VehicleDataService();
  
  // First call should load from source
  const startTime1 = Date.now();
  const vehicles1 = await service.getAllVehicles();
  const time1 = Date.now() - startTime1;
  
  // Second call should use cache
  const startTime2 = Date.now();
  const vehicles2 = await service.getAllVehicles();
  const time2 = Date.now() - startTime2;
  
  assert(vehicles1.length === vehicles2.length, 'cached and non-cached results should match');
  
  // Test cache stats
  const cacheStats = service.getCacheStats();
  assert(cacheStats.size > 0, 'should have cache entries');
  
  // Test force refresh
  const vehicles3 = await service.getAllVehicles(true);
  assert(vehicles3.length === vehicles1.length, 'force refresh should return same data');
});

// Test error handling
test('vehicle data service error handling', async () => {
  const service = new VehicleDataService();
  
  // Test invalid size
  try {
    await service.getVehiclesBySize('invalid_size');
    assert.fail('should throw error for invalid size');
  } catch (error) {
    assert(error.message.includes('Invalid size category'), 'should throw appropriate error');
  }
  
  // Test empty make
  try {
    await service.getVehiclesByMake('');
    assert.fail('should throw error for empty make');
  } catch (error) {
    assert(error.message.includes('Make parameter is required'), 'should throw appropriate error');
  }
});

// Test configuration
test('vehicle configuration', () => {
  assert(VEHICLE_CONFIG.dataSource, 'should have data source configuration');
  assert(VEHICLE_CONFIG.validation, 'should have validation configuration');
  assert(VEHICLE_CONFIG.sizeCategories, 'should have size categories');
  assert(Array.isArray(VEHICLE_CONFIG.validation.allowedSizes), 'allowed sizes should be an array');
  assert(VEHICLE_CONFIG.validation.allowedSizes.length > 0, 'should have allowed sizes');
});

// Test performance
test('vehicle data service performance', async () => {
  const service = new VehicleDataService();
  
  // Test multiple operations
  const startTime = Date.now();
  
  await Promise.all([
    service.getAllVehicles(),
    service.getVehiclesBySize('sedan'),
    service.getVehiclesBySize('sports'),
    service.getVehiclesByMake('Toyota'),
    service.searchVehicles({ size: 'suv' })
  ]);
  
  const totalTime = Date.now() - startTime;
  assert(totalTime < 5000, 'operations should complete within reasonable time');
});
