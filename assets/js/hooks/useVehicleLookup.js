const fs = require('fs');
const path = require('path');

function useVehicleLookup(searchTerm) {
  // 1. Input validation: return null for empty, whitespace, null, undefined
  if (!searchTerm || typeof searchTerm !== 'string') {
    return null;
  }
  
  const trimmed = searchTerm.trim();
  if (trimmed === '') {
    return null;
  }

  // 4. Data load: correct path and handle missing file gracefully
  let vehicleModels = [];
  try {
    const dataPath = path.join(__dirname, '../data/vehicle-models.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    vehicleModels = JSON.parse(data);
  } catch (error) {
    console.warn('Failed to load vehicle models data:', error.message);
    return null;
  }

  // 2. Case-insensitive substring matching on make OR model
  const searchLower = trimmed.toLowerCase();
  const matches = vehicleModels.filter(vehicle => 
    vehicle.make.toLowerCase().includes(searchLower) ||
    vehicle.model.toLowerCase().includes(searchLower)
  );

  if (matches.length === 0) {
    return null;
  }

  // 3. Frequency-based tie-breaking: most frequent size, default to 'sedan' on tie
  const sizeCounts = {};
  matches.forEach(vehicle => {
    sizeCounts[vehicle.size] = (sizeCounts[vehicle.size] || 0) + 1;
  });

  let mostFrequentSize = 'sedan'; // default
  let maxCount = 0;

  for (const [size, count] of Object.entries(sizeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentSize = size;
    }
  }

  return mostFrequentSize;
}

module.exports = useVehicleLookup;