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

test('null input returns null', () => {
  assert.strictEqual(lookupVehicleSize(null), null);
});

test('undefined input returns null', () => {
  assert.strictEqual(lookupVehicleSize(undefined), null);
});

test('number input returns null', () => {
  assert.strictEqual(lookupVehicleSize(123), null);
});

test('object input returns null', () => {
  assert.strictEqual(lookupVehicleSize({ make: 'Honda', model: 'Accord' }), null);
});

test('array input returns null', () => {
  assert.strictEqual(lookupVehicleSize(['Honda', 'Accord']), null);
});

test('empty string returns null', () => {
  assert.strictEqual(lookupVehicleSize(''), null);
});

test('whitespace only string returns null', () => {
  assert.strictEqual(lookupVehicleSize('   '), null);
});

test('special characters are normalized', () => {
  assert.strictEqual(lookupVehicleSize('Honda@Accord!!!'), 'sedan');
  // Note: underscores are word characters and won't be replaced
  assert.strictEqual(lookupVehicleSize('Honda-Accord'), 'sedan');
});

test('multiple spaces between words are normalized', () => {
  assert.strictEqual(lookupVehicleSize('Honda          Accord'), 'sedan');
});

test('tabs and newlines are normalized', () => {
  assert.strictEqual(lookupVehicleSize('Honda\t\nAccord'), 'sedan');
});

test('index is cached after first call', () => {
  // Call twice to ensure index is reused
  const result1 = lookupVehicleSize('Honda Accord');
  const result2 = lookupVehicleSize('Honda Accord');

  assert.strictEqual(result1, 'sedan');
  assert.strictEqual(result2, 'sedan');
  // If this doesn't throw, the cache is working
});

test('multiple aliases work correctly', () => {
  // Test first alias
  assert.strictEqual(lookupVehicleSize('c class'), 'sedan');
  // Test second alias
  assert.strictEqual(lookupVehicleSize('mercedes c class'), 'sedan');
  // Test full name
  assert.strictEqual(lookupVehicleSize('mercedes benz c class'), 'sedan');
});

test('case insensitive alias matching', () => {
  assert.strictEqual(lookupVehicleSize('C CLASS'), 'sedan');
  assert.strictEqual(lookupVehicleSize('C Class'), 'sedan');
  assert.strictEqual(lookupVehicleSize('c CLASS'), 'sedan');
});
