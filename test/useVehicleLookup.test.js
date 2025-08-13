const { test } = require('node:test');
const assert = require('node:assert');

const useVehicleLookup = require('../assets/js/hooks/useVehicleLookup');

test('exact make and model match returns sedan', () => {
  assert.equal(useVehicleLookup('Toyota Camry'), 'sedan');
});

test('partial match returns sedan', () => {
  assert.equal(useVehicleLookup('camr'), 'sedan');
});

test('tie breaker returns sedan', () => {
  assert.equal(useVehicleLookup('Ford'), 'sedan');
});

test('not found or empty input returns null', () => {
  assert.equal(useVehicleLookup('unknown'), null);
  assert.equal(useVehicleLookup(''), null);
  assert.equal(useVehicleLookup('   '), null);
  assert.equal(useVehicleLookup(null), null);
  assert.equal(useVehicleLookup(undefined), null);
});
