import { renderVehicleSizeTiles } from '../components/VehicleSizeTiles.js';

try {
  const el = renderVehicleSizeTiles({ onSelect: (v) => console.log('selected', v) });
  document.body.appendChild(el);
} catch (err) {
  console.error('vehicle-size-demo failed', err);
}
