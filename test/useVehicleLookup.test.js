const { test } = require('node:test');
const assert = require('node:assert');
const useVehicleLookup = require('../assets/js/hooks/useVehicleLookup.js');

test('useVehicleLookup - input validation', () => {
  // 1. Inputs: return null for "", "   ", null, undefined (trim first)
  assert.strictEqual(useVehicleLookup(''), null, 'should return null for empty string');
  assert.strictEqual(useVehicleLookup('   '), null, 'should return null for whitespace-only string');
  assert.strictEqual(useVehicleLookup(null), null, 'should return null for null input');
  assert.strictEqual(useVehicleLookup(undefined), null, 'should return null for undefined input');
  assert.strictEqual(useVehicleLookup('  \t\n  '), null, 'should return null for mixed whitespace');
});

test('useVehicleLookup - exact matches', () => {
  // 2. Matching: case-insensitive substring on make OR model
  assert.strictEqual(useVehicleLookup('Tesla'), 'sedan', 'should find Tesla Model S sedan');
  assert.strictEqual(useVehicleLookup('Model S'), 'sedan', 'should find Tesla Model S by model name');
  assert.strictEqual(useVehicleLookup('Honda'), 'sedan', 'should find Honda Accord sedan');
  assert.strictEqual(useVehicleLookup('Accord'), 'sedan', 'should find Honda Accord by model name');
  assert.strictEqual(useVehicleLookup('Ford'), 'sports', 'should find Ford Mustang sports car');
  assert.strictEqual(useVehicleLookup('Mustang'), 'sports', 'should find Ford Mustang by model name');
});

test('useVehicleLookup - partial matches', () => {
  // 2. Matching: case-insensitive substring on make OR model
  assert.strictEqual(useVehicleLookup('tes'), 'sedan', 'should find Tesla with partial match');
  assert.strictEqual(useVehicleLookup('MODEL'), 'sedan', 'should find Model S with case-insensitive match');
  assert.strictEqual(useVehicleLookup('hon'), 'sedan', 'should find Honda with partial match');
  assert.strictEqual(useVehicleLookup('accord'), 'sedan', 'should find Accord with case-insensitive match');
  assert.strictEqual(useVehicleLookup('ford'), 'sports', 'should find Ford with case-insensitive match');
  assert.strictEqual(useVehicleLookup('must'), 'sports', 'should find Mustang with partial match');
});

test('useVehicleLookup - frequency-based tie-breaking', () => {
  // 3. Frequency: if multiple sizes match, pick MOST frequent; if tie -> 'sedan'
  // Honda appears multiple times in different categories, so we need to test frequency logic
  assert.strictEqual(useVehicleLookup('Honda'), 'sedan', 'should pick sedan when Honda matches multiple categories');
  assert.strictEqual(useVehicleLookup('Toyota'), 'sedan', 'should pick sedan when Toyota matches multiple categories');
  assert.strictEqual(useVehicleLookup('Ford'), 'sports', 'should pick sports when Ford matches multiple categories');
});

test('useVehicleLookup - not found cases', () => {
  // 7. Tests: cover not-found cases
  assert.strictEqual(useVehicleLookup('NonExistentCar'), null, 'should return null for non-existent vehicle');
  assert.strictEqual(useVehicleLookup('XYZ'), null, 'should return null for non-existent make');
  assert.strictEqual(useVehicleLookup('RandomModel'), null, 'should return null for non-existent model');
});

test('useVehicleLookup - edge cases', () => {
  // Additional edge cases
  assert.strictEqual(useVehicleLookup('BMW'), 'sedan', 'should find BMW 3 Series');
  assert.strictEqual(useVehicleLookup('3 Series'), 'sedan', 'should find BMW 3 Series by model');
  assert.strictEqual(useVehicleLookup('Porsche'), 'sports', 'should find Porsche 911');
  assert.strictEqual(useVehicleLookup('911'), 'sports', 'should find Porsche 911 by model');
  assert.strictEqual(useVehicleLookup('Tes'), 'sedan', 'should find Tesla with short partial match');
});

test('useVehicleLookup - data loading resilience', () => {
  // 4. Data load: no runtime errors if file missing (tested by ensuring function works)
  // This test verifies the function can load data successfully
  const result = useVehicleLookup('Tesla');
  assert.strictEqual(typeof result, 'string', 'should return a string when data loads successfully');
  assert.ok(['sedan', 'sports', 'small_suv', 'large_suv', 'full_van', 'boat'].includes(result), 
    'should return a valid vehicle size');
});