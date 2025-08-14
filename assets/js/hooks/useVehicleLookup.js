const models = require('../data/vehicle-models.json');

let index;

const ALIASES = {
  'c class': 'mercedes benz c class',
  'mercedes c class': 'mercedes benz c class',
};

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getIndex() {
  if (!index) {
    index = new Map();
    for (const { make, model, size } of models) {
      const key = normalize(`${make} ${model}`);
      index.set(key, size);
    }
  }
  return index;
}

function lookupVehicleSize(name) {
  if (typeof name !== 'string') return null;
  const normalized = normalize(name);
  const key = ALIASES[normalized] || normalized;
  return getIndex().get(key) || null;
}

module.exports = lookupVehicleSize;
