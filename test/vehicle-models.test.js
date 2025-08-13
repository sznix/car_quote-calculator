const { test } = require('node:test');
const assert = require('node:assert');

const vehicleModels = require('../assets/js/data/vehicle-models.json');
const allowedSizes = new Set(['sedan', 'sports', 'small_suv', 'large_suv', 'full_van', 'boat']);

test('vehicle model data integrity', () => {
  assert.ok(Array.isArray(vehicleModels), 'data should be an array');
  assert.ok(vehicleModels.length >= 30, 'should have at least 30 entries');
  for (const entry of vehicleModels) {
    assert.equal(typeof entry.make, 'string');
    assert.equal(typeof entry.model, 'string');
    assert.equal(typeof entry.size, 'string');
    assert.ok(allowedSizes.has(entry.size), `unexpected size: ${entry.size}`);
  }
});
