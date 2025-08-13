import { renderVehicleSizeTiles } from "../components/VehicleSizeTiles.js";

try {
  const el = renderVehicleSizeTiles({
    onSelect: (id) => console.log('selected', id)
  });
  document.body.appendChild(el);
} catch (err) {
  // not running in browser
}
