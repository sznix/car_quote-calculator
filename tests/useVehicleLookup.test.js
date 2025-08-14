import test from 'node:test';
import assert from 'node:assert/strict';
import { lookupVehicleSize, normalizeModel, ALLOWED_SIZES } from '../assets/js/hooks/useVehicleLookup.js';

// Test normalization function
test('normalizeModel function', () => {
  // Basic normalization
  assert.equal(normalizeModel('Tesla Model S'), 'tesla model s');
  assert.equal(normalizeModel('BMW 3-Series'), 'bmw 3series');
  assert.equal(normalizeModel('  model-s  '), 'model s');
  
  // Punctuation and special characters
  assert.equal(normalizeModel('C-Class'), 'cclass');
  assert.equal(normalizeModel('GT-R'), 'gtr');
  assert.equal(normalizeModel('CR-V'), 'crv');
  assert.equal(normalizeModel('Pro Team 175'), 'pro team 175');
  
  // Whitespace handling
  assert.equal(normalizeModel('  Tesla   Model   S  '), 'tesla model s');
  assert.equal(normalizeModel('\tBMW\n3 Series\r'), 'bmw 3 series');
  
  // Edge cases
  assert.equal(normalizeModel(''), '');
  assert.equal(normalizeModel('   '), '');
  assert.equal(normalizeModel(null), '');
  assert.equal(normalizeModel(undefined), '');
  assert.equal(normalizeModel(123), '');
});

// Test exact matches
test('exact hit cases', () => {
  // Tesla models
  assert.equal(lookupVehicleSize('Tesla Model S'), 'sedan');
  assert.equal(lookupVehicleSize('tesla model s'), 'sedan');
  
  // Toyota models
  assert.equal(lookupVehicleSize('Toyota Camry'), 'sedan');
  assert.equal(lookupVehicleSize('toyota camry'), 'sedan');
  
  // Honda models
  assert.equal(lookupVehicleSize('Honda Accord'), 'sedan');
  assert.equal(lookupVehicleSize('honda accord'), 'sedan');
  
  // BMW models
  assert.equal(lookupVehicleSize('BMW 3 Series'), 'sedan');
  assert.equal(lookupVehicleSize('bmw 3 series'), 'sedan');
  
  // Mercedes models
  assert.equal(lookupVehicleSize('Mercedes-Benz C-Class'), 'sedan');
  assert.equal(lookupVehicleSize('mercedes cclass'), 'sedan');
  
  // Sports cars
  assert.equal(lookupVehicleSize('Chevrolet Corvette'), 'sports');
  assert.equal(lookupVehicleSize('Porsche 911'), 'sports');
  assert.equal(lookupVehicleSize('Ford Mustang'), 'sports');
  
  // SUVs
  assert.equal(lookupVehicleSize('Toyota RAV4'), 'small_suv');
  assert.equal(lookupVehicleSize('Chevrolet Tahoe'), 'large_suv');
  
  // Vans
  assert.equal(lookupVehicleSize('Ford Transit'), 'full_van');
  
  // Boats
  assert.equal(lookupVehicleSize('Sea Ray 190'), 'boat');
});

// Test case/whitespace/punctuation tolerance
test('case, whitespace, and punctuation tolerance', () => {
  // Tesla Model S variations
  assert.equal(lookupVehicleSize('  model-s  '), 'sedan');
  assert.equal(lookupVehicleSize('MODEL S'), 'sedan');
  assert.equal(lookupVehicleSize('Model-S'), 'sedan');
  assert.equal(lookupVehicleSize('  Tesla   Model   S  '), 'sedan');
  
  // BMW 3 Series variations
  assert.equal(lookupVehicleSize('BMW 3-Series'), 'sedan');
  assert.equal(lookupVehicleSize('bmw 3series'), 'sedan');
  assert.equal(lookupVehicleSize('  BMW   3   Series  '), 'sedan');
  
  // Mercedes C-Class variations
  assert.equal(lookupVehicleSize('C-Class'), 'sedan');
  assert.equal(lookupVehicleSize('c class'), 'sedan');
  assert.equal(lookupVehicleSize('C Class'), 'sedan');
  
  // Honda CR-V variations
  assert.equal(lookupVehicleSize('CR-V'), 'small_suv');
  assert.equal(lookupVehicleSize('crv'), 'small_suv');
  assert.equal(lookupVehicleSize('  CR   V  '), 'small_suv');
  
  // Nissan GT-R variations
  assert.equal(lookupVehicleSize('GT-R'), 'sports');
  assert.equal(lookupVehicleSize('gtr'), 'sports');
  assert.equal(lookupVehicleSize('  GT   R  '), 'sports');
});

// Test alias mapping
test('alias mapping functionality', () => {
  // Model-only aliases
  assert.equal(lookupVehicleSize('C Class'), 'sedan');
  assert.equal(lookupVehicleSize('3 Series'), 'sedan');
  assert.equal(lookupVehicleSize('Model S'), 'sedan');
  assert.equal(lookupVehicleSize('Corvette'), 'sports');
  assert.equal(lookupVehicleSize('Mustang'), 'sports');
  assert.equal(lookupVehicleSize('Camry'), 'sedan');
  assert.equal(lookupVehicleSize('Accord'), 'sedan');
  assert.equal(lookupVehicleSize('RAV4'), 'small_suv');
  assert.equal(lookupVehicleSize('CR-V'), 'small_suv');
  assert.equal(lookupVehicleSize('Tahoe'), 'large_suv');
  assert.equal(lookupVehicleSize('Transit'), 'full_van');
});

// Test unknown models return null
test('unknown models return null', () => {
  // Non-existent models
  assert.equal(lookupVehicleSize('Ferrari F40'), null);
  assert.equal(lookupVehicleSize('Lamborghini Countach'), null);
  assert.equal(lookupVehicleSize('Unknown Model'), null);
  assert.equal(lookupVehicleSize('Random Car'), null);
  
  // Partial matches that shouldn't work
  assert.equal(lookupVehicleSize('Model'), null);
  assert.equal(lookupVehicleSize('Series'), null);
  assert.equal(lookupVehicleSize('Class'), null);
  
  // Invalid inputs
  assert.equal(lookupVehicleSize(''), null);
  assert.equal(lookupVehicleSize('   '), null);
  assert.equal(lookupVehicleSize(null), null);
  assert.equal(lookupVehicleSize(undefined), null);
  assert.equal(lookupVehicleSize(123), null);
  assert.equal(lookupVehicleSize({}), null);
});

// Test all vehicle sizes are allowed
test('all vehicle sizes are in allowed set', () => {
  const testCases = [
    { model: 'Tesla Model S', expected: 'sedan' },
    { model: 'Chevrolet Corvette', expected: 'sports' },
    { model: 'Toyota RAV4', expected: 'small_suv' },
    { model: 'Chevrolet Tahoe', expected: 'large_suv' },
    { model: 'Ford Transit', expected: 'full_van' },
    { model: 'Sea Ray 190', expected: 'boat' }
  ];
  
  for (const testCase of testCases) {
    const result = lookupVehicleSize(testCase.model);
    assert.equal(result, testCase.expected);
    assert(ALLOWED_SIZES.has(result), `Size ${result} should be in allowed set`);
  }
});

// Test deterministic results
test('deterministic results for same input', () => {
  const testModels = [
    'Tesla Model S',
    'BMW 3 Series',
    'C Class',
    'Corvette',
    'RAV4',
    'Tahoe',
    'Transit',
    'Sea Ray 190'
  ];
  
  for (const model of testModels) {
    const result1 = lookupVehicleSize(model);
    const result2 = lookupVehicleSize(model);
    const result3 = lookupVehicleSize(model);
    
    assert.equal(result1, result2, `First and second calls should match for ${model}`);
    assert.equal(result2, result3, `Second and third calls should match for ${model}`);
    assert.equal(result1, result3, `First and third calls should match for ${model}`);
  }
});

// Test performance with multiple calls
test('performance with multiple lookups', () => {
  const models = [
    'Tesla Model S',
    'BMW 3 Series',
    'C Class',
    'Corvette',
    'RAV4',
    'Tahoe',
    'Transit',
    'Sea Ray 190',
    'Toyota Camry',
    'Honda Accord',
    'Ford Mustang',
    'Porsche 911'
  ];
  
  const startTime = Date.now();
  
  // Perform multiple lookups
  for (let i = 0; i < 100; i++) {
    for (const model of models) {
      lookupVehicleSize(model);
    }
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  // Should complete quickly (less than 100ms for 1200 lookups)
  assert(totalTime < 100, `Lookups took ${totalTime}ms, should be under 100ms`);
});

// Test edge cases and robustness
test('edge cases and robustness', () => {
  // Very long model names
  assert.equal(lookupVehicleSize('A'.repeat(1000)), null);
  
  // Special characters
  assert.equal(lookupVehicleSize('!@#$%^&*()'), null);
  assert.equal(lookupVehicleSize('Model-S'), 'sedan'); // Should normalize to 'model s'
  
  // Unicode characters
  assert.equal(lookupVehicleSize('Lamborghini Huracán'), 'sports');
  
  // Numbers only
  assert.equal(lookupVehicleSize('911'), 'sports');
  assert.equal(lookupVehicleSize('190'), 'boat');
  
  // Mixed case and spacing
  assert.equal(lookupVehicleSize('tEsLa MoDeL s'), 'sedan');
  assert.equal(lookupVehicleSize('  BMW   3   Series  '), 'sedan');
});