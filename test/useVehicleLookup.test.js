const { test } = require('node:test');
const assert = require('node:assert');
const lookupVehicleSize = require('../assets/js/hooks/useVehicleLookup');

test('exact match', () => {
  assert.strictEqual(lookupVehicleSize('Honda Accord'), 'sedan');
});

test('case and extra spaces ignored', () => {
  assert.strictEqual(lookupVehicleSize('  hOnDa   aCcOrD  '), 'sedan');
});

test('punctuation ignored', () => {
  assert.strictEqual(lookupVehicleSize('Honda Accord!!!'), 'sedan');
});

test('alias lookup', () => {
  assert.strictEqual(lookupVehicleSize('c class'), 'sedan');
});

test('unknown returns null', () => {
  assert.strictEqual(lookupVehicleSize('Unknown Model'), null);
});
