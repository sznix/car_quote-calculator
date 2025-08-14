const models = require('../data/vehicle-models.json');

// Build a lookup index for quicker matching
const INDEX = models.map(({ make, model, size }) => {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  return {
    make: makeLower,
    model: modelLower,
    combined: `${makeLower} ${modelLower}`,
    size,
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

  let max = 0;
  for (const count of Object.values(counts)) {
    if (count > max) max = count;
  }
  if (max === 0) return null;

  const top = Object.keys(counts).filter((size) => counts[size] === max);
  return top.length === 1 ? top[0] : DEFAULT_SIZE;
};
