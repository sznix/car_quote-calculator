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

test('all entries have required fields', () => {
  for (const entry of models) {
    assert.ok(entry.hasOwnProperty('make'), `entry missing 'make' field: ${JSON.stringify(entry)}`);
    assert.ok(entry.hasOwnProperty('model'), `entry missing 'model' field: ${JSON.stringify(entry)}`);
    assert.ok(entry.hasOwnProperty('size'), `entry missing 'size' field: ${JSON.stringify(entry)}`);
  }
});

test('make and model are non-empty strings', () => {
  for (const entry of models) {
    assert.strictEqual(typeof entry.make, 'string', `make should be a string for ${JSON.stringify(entry)}`);
    assert.strictEqual(typeof entry.model, 'string', `model should be a string for ${JSON.stringify(entry)}`);
    assert.ok(entry.make.length > 0, `make should not be empty for ${JSON.stringify(entry)}`);
    assert.ok(entry.model.length > 0, `model should not be empty for ${JSON.stringify(entry)}`);
  }
});

test('size is a non-empty string', () => {
  for (const entry of models) {
    assert.strictEqual(typeof entry.size, 'string', `size should be a string for ${entry.make} ${entry.model}`);
    assert.ok(entry.size.length > 0, `size should not be empty for ${entry.make} ${entry.model}`);
  }
});

test('no leading or trailing whitespace in fields', () => {
  for (const entry of models) {
    assert.strictEqual(entry.make, entry.make.trim(), `make has whitespace: "${entry.make}"`);
    assert.strictEqual(entry.model, entry.model.trim(), `model has whitespace: "${entry.model}"`);
    assert.strictEqual(entry.size, entry.size.trim(), `size has whitespace: "${entry.size}"`);
  }
});

test('make and model do not contain excessive spaces', () => {
  for (const entry of models) {
    assert.ok(!entry.make.includes('  '), `make contains multiple spaces: "${entry.make}"`);
    assert.ok(!entry.model.includes('  '), `model contains multiple spaces: "${entry.model}"`);
  }
});

test('size values are lowercase with underscores', () => {
  for (const entry of models) {
    assert.ok(entry.size === entry.size.toLowerCase(), `size should be lowercase: ${entry.size}`);
    assert.ok(!entry.size.includes(' '), `size should use underscores not spaces: ${entry.size}`);
  }
});
