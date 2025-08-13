const models = require('../data/vehicle-models.json');

// Build a simple index at module load
const INDEX = models.map((entry) => {
  const make = entry.make.toLowerCase();
  const model = entry.model.toLowerCase();
  return {
    make,
    model,
    combined: `${make} ${model}`,
    size: entry.size,
  };
});

const DEFAULT_SIZE = 'sedan';

module.exports = function useVehicleLookup(searchTerm) {
  if (typeof searchTerm !== 'string') return null;
  const term = searchTerm.trim().toLowerCase();
  if (!term) return null;

  const counts = {};
  for (const item of INDEX) {
    if (
      item.make.includes(term) ||
      item.model.includes(term) ||
      item.combined.includes(term)
    ) {
      counts[item.size] = (counts[item.size] || 0) + 1;
    }
  }

  const entries = Object.entries(counts);
  if (entries.length === 0) return null;

  let max = 0;
  for (const [, count] of entries) {
    if (count > max) max = count;
  }

  const topSizes = entries
    .filter(([, count]) => count === max)
    .map(([size]) => size);

  return topSizes.length === 1 ? topSizes[0] : DEFAULT_SIZE;
};
