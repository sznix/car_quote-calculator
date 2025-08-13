/* useVehicleLookup: returns most frequent size among models whose make or model contains the query (case-insensitive). If tie, returns 'sedan'. Returns null for empty/blank/null/undefined inputs. */

let vehicleModels = [];
try {
  // Load local data; if not found, fall back to empty list to avoid runtime errors
  // Path is relative to this file location
  // eslint-disable-next-line global-require, import/no-dynamic-require
  vehicleModels = require('../data/vehicle-models.json');
} catch (_error) {
  vehicleModels = [];
}

function useVehicleLookup(query) {
  if (typeof query !== 'string') {
    return null;
  }
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const lowered = trimmed.toLowerCase();

  // Count frequency of sizes among matches
  const sizeToCount = new Map();
  for (const entry of vehicleModels) {
    const makeLower = String(entry.make || '').toLowerCase();
    const modelLower = String(entry.model || '').toLowerCase();

    if (makeLower.includes(lowered) || modelLower.includes(lowered)) {
      const size = String(entry.size || '');
      const current = sizeToCount.get(size) || 0;
      sizeToCount.set(size, current + 1);
    }
  }

  if (sizeToCount.size === 0) {
    return null;
  }

  let bestSize = null;
  let bestCount = -1;
  for (const [size, count] of sizeToCount.entries()) {
    if (count > bestCount) {
      bestCount = count;
      bestSize = size;
    } else if (count === bestCount) {
      // Tie remains unresolved here; final deterministic fallback below
      // Do nothing to keep first encountered; then apply sedan fallback if still a tie
    }
  }

  // If there is more than one size with the same max count, enforce deterministic fallback to 'sedan'
  const numAtBest = Array.from(sizeToCount.values()).filter((c) => c === bestCount).length;
  if (numAtBest > 1) {
    return 'sedan';
  }

  return bestSize;
}

module.exports = useVehicleLookup;