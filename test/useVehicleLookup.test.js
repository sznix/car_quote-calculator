const { test, before } = require('node:test');
const assert = require('node:assert');

let useVehicleLookup;

before(() => {
  // Ensure module can be loaded even if data file is missing
  useVehicleLookup = require('../assets/js/hooks/useVehicleLookup.js');
});

test('returns null for empty, whitespace, null, undefined', () => {
  assert.equal(useVehicleLookup(''), null, 'empty string -> null');
  assert.equal(useVehicleLookup('   '), null, 'whitespace -> null');
  assert.equal(useVehicleLookup(null), null, 'null -> null');
  assert.equal(useVehicleLookup(undefined), null, 'undefined -> null');
});

test('exact matching by model returns correct size', () => {
  // From data: Ford Mustang -> sports
  assert.equal(useVehicleLookup('Mustang'), 'sports', 'Mustang -> sports');
});

test('partial, case-insensitive matching on make', () => {
  // "merC" should match Mercedes-Benz which exists as sedan and full_van; tie -> sedan
  assert.equal(useVehicleLookup('merC'), 'sedan', 'partial make match with tie -> sedan');
});

test('partial, case-insensitive matching on model', () => {
  // "rav" matches RAV4 -> small_suv
  assert.equal(useVehicleLookup('rav'), 'small_suv', 'rav -> small_suv');
});

test('tie across sizes falls back to sedan deterministically', () => {
  // Query "Ford" appears in small_suv (Escape), large_suv (Expedition), full_van (Transit), sedan? none; sports? Mustang.
  // Counts: small_suv=1, large_suv=1, full_van=1, sports=1 -> 4-way tie => sedan
  assert.equal(useVehicleLookup('Ford'), 'sedan', 'tie across sizes -> sedan');
});

test('returns null when no match found', () => {
  assert.equal(useVehicleLookup('nonexistent-brand-model'), null, 'no match -> null');
});