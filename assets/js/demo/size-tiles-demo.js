const renderVehicleSizeTiles = require('../components/VehicleSizeTiles');

const state = { selected: 'sedan' };

function handleSelect(value) {
  state.selected = value;
  selectedEl.textContent = `Selected: ${value}`;
}

const tiles = renderVehicleSizeTiles({
  selected: state.selected,
  onSelect: handleSelect,
});

document.body.appendChild(tiles);

const selectedEl = document.createElement('div');
selectedEl.textContent = `Selected: ${state.selected}`;
document.body.appendChild(selectedEl);
