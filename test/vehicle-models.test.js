const { test } = require('node:test');
const assert = require('node:assert');
const models = require('../assets/js/data/vehicle-models.json');

const allowedSizes = new Set(['sedan', 'sports', 'small_suv', 'large_suv', 'full_van', 'boat']);

function normalize(entry) {
  return (entry.make + entry.model)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

test('dataset has at least 30 entries', () => {
  assert.ok(Array.isArray(models), 'data should be an array');
  assert.ok(models.length >= 30, 'data should contain at least 30 entries');
});

test('only allowed sizes are used', () => {
  for (const entry of models) {
    assert.ok(allowedSizes.has(entry.size), `unexpected size "${entry.size}"`);
  }
});

test('no duplicate make/model pairs', () => {
  const seen = new Set();
  for (const entry of models) {
    const key = normalize(entry);
    assert.ok(!seen.has(key), `duplicate entry for ${entry.make} ${entry.model}`);
    seen.add(key);
  }
});
