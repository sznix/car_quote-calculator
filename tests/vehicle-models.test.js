import test from 'node:test';
import assert from 'node:assert/strict';
import models from '../assets/js/data/vehicle-models.json' with { type: 'json' };

test('vehicle models data integrity', () => {
  assert(Array.isArray(models), 'models should be an array');
  assert(models.length >= 30, 'should include at least 30 models');

  const sizes = new Set(['sedan', 'sports', 'small_suv', 'large_suv', 'full_van', 'boat']);

  for (const entry of models) {
    assert(entry.make, 'missing make');
    assert(entry.model, 'missing model');
    assert(entry.size, 'missing size');
    assert(sizes.has(entry.size), `invalid size: ${entry.size}`);
  }
});
