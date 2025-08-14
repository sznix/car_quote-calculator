const SIZES = [
  ['sedan', 'Sedan'],
  ['sports', 'Sports'],
  ['small_suv', 'Small SUV'],
  ['large_suv', 'Large SUV'],
  ['full_van', 'Full Van'],
  ['boat', 'Boat'],
];

function renderVehicleSizeTiles({ selected, onSelect } = {}) {
  let current = selected || null;
  const container = document.createElement('div');

  function updatePressed() {
    for (const child of container.children) {
      const value = child.getAttribute('data-value');
      const isPressed = value === current;
      child.setAttribute('aria-pressed', String(isPressed));
      child.style.background = isPressed ? '#e0e0e0' : '';
    }
  }

  function handleSelect(value) {
    current = value;
    updatePressed();
    if (typeof navigator !== 'undefined') {
      navigator.vibrate?.(10);
    }
    if (typeof onSelect === 'function') {
      onSelect(value);
    }
  }

  for (const [value, label] of SIZES) {
    const tile = document.createElement('div');
    tile.className = 'vehicle-size-tile';
    tile.tabIndex = 0;
    tile.setAttribute('role', 'button');
    tile.setAttribute('data-value', value);
    tile.setAttribute('aria-pressed', String(value === current));
    tile.textContent = label;

    tile.addEventListener('click', () => handleSelect(value));
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(value);
      }
    });
    tile.addEventListener('focus', () => {
      tile.style.outline = '2px solid #2684ff';
      tile.style.outlineOffset = '2px';
    });
    tile.addEventListener('blur', () => {
      tile.style.outline = '';
      tile.style.outlineOffset = '';
    });

    container.appendChild(tile);
  }

  updatePressed();
  return container;
}

module.exports = renderVehicleSizeTiles;
