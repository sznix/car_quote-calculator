/**
 * Example usage of the Vehicle Data Service
 * Demonstrates various features and capabilities
 */

import VehicleDataService from '../src/services/vehicle-data-service.js';
import { VehicleDataValidator } from '../src/utils/vehicle-validator.js';
import VEHICLE_CONFIG from '../src/config/vehicle-config.js';

async function demonstrateVehicleService() {
  console.log('🚗 Vehicle Model Mapping System Demo\n');

  // Initialize the service
  const service = new VehicleDataService();
  const validator = new VehicleDataValidator(VEHICLE_CONFIG.validation);

  try {
    // 1. Get all vehicles
    console.log('1. Getting all vehicles...');
    const allVehicles = await service.getAllVehicles();
    console.log(`   Found ${allVehicles.length} vehicles\n`);

    // 2. Get vehicles by size
    console.log('2. Getting vehicles by size...');
    const sedans = await service.getVehiclesBySize('sedan');
    const sports = await service.getVehiclesBySize('sports');
    const suvs = await service.getVehiclesBySize('small_suv');
    
    console.log(`   Sedans: ${sedans.length} vehicles`);
    console.log(`   Sports: ${sports.length} vehicles`);
    console.log(`   Small SUVs: ${suvs.length} vehicles\n`);

    // 3. Get vehicles by make
    console.log('3. Getting vehicles by make...');
    const teslas = await service.getVehiclesByMake('Tesla');
    const toyotas = await service.getVehiclesByMake('Toyota');
    
    console.log(`   Teslas: ${teslas.length} vehicles`);
    console.log(`   Toyotas: ${toyotas.length} vehicles\n`);

    // 4. Search vehicles
    console.log('4. Searching vehicles...');
    const searchResults = await service.searchVehicles({ 
      make: 'Toyota', 
      size: 'sedan' 
    });
    console.log(`   Toyota sedans: ${searchResults.length} vehicles`);
    searchResults.forEach(vehicle => {
      console.log(`     - ${vehicle.make} ${vehicle.model}`);
    });
    console.log();

    // 5. Demonstrate caching
    console.log('5. Demonstrating caching...');
    const startTime1 = Date.now();
    await service.getAllVehicles(); // First call - loads from source
    const time1 = Date.now() - startTime1;
    
    const startTime2 = Date.now();
    await service.getAllVehicles(); // Second call - uses cache
    const time2 = Date.now() - startTime2;
    
    console.log(`   First call (load from source): ${time1}ms`);
    console.log(`   Second call (use cache): ${time2}ms`);
    console.log(`   Cache improvement: ${((time1 - time2) / time1 * 100).toFixed(1)}%\n`);

    // 6. Get cache statistics
    console.log('6. Cache statistics...');
    const cacheStats = service.getCacheStats();
    console.log(`   Cache entries: ${cacheStats.size}`);
    console.log(`   Cached keys: ${cacheStats.keys.join(', ')}\n`);

    // 7. Demonstrate validation
    console.log('7. Data validation...');
    const validVehicle = { make: 'BMW', model: 'X5', size: 'large_suv' };
    const invalidVehicle = { make: 'BMW', model: 'X5' }; // Missing size
    
    console.log(`   Valid vehicle: ${validator.validateVehicle(validVehicle)}`);
    console.log(`   Invalid vehicle: ${validator.validateVehicle(invalidVehicle)}`);
    console.log(`   Valid size 'sedan': ${validator.isValidSize('sedan')}`);
    console.log(`   Invalid size 'invalid': ${validator.isValidSize('invalid')}\n`);

    // 8. Configuration overview
    console.log('8. Configuration overview...');
    console.log(`   Data source: ${VEHICLE_CONFIG.dataSource.type}`);
    console.log(`   Cache enabled: ${VEHICLE_CONFIG.dataSource.cacheEnabled}`);
    console.log(`   Cache TTL: ${VEHICLE_CONFIG.dataSource.cacheTTL}s`);
    console.log(`   Logging level: ${VEHICLE_CONFIG.logging.level}`);
    console.log(`   Allowed sizes: ${VEHICLE_CONFIG.validation.allowedSizes.join(', ')}\n`);

    // 9. Performance demonstration
    console.log('9. Performance demonstration...');
    const startTime = Date.now();
    
    await Promise.all([
      service.getVehiclesBySize('sedan'),
      service.getVehiclesBySize('sports'),
      service.getVehiclesBySize('small_suv'),
      service.getVehiclesByMake('Toyota'),
      service.getVehiclesByMake('Honda'),
      service.searchVehicles({ size: 'suv' })
    ]);
    
    const totalTime = Date.now() - startTime;
    console.log(`   Parallel operations completed in: ${totalTime}ms\n`);

    console.log('✅ Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error during demo:', error.message);
  }
}

// Run the demo
demonstrateVehicleService();