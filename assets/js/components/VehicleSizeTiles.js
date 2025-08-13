export function renderVehicleSizeTiles({ selected = null, onSelect } = {}) {
  const sizes = [
    { id: 'sedan', label: 'Sedan', models: ['Camry', 'Accord'] },
    { id: 'sports', label: 'Sports', models: ['911', 'Corvette'] },
    { id: 'small_suv', label: 'Small SUV', models: ['RAV4', 'CR-V'] },
    { id: 'large_suv', label: 'Large SUV', models: ['Tahoe', 'Suburban'] },
    { id: 'full_van', label: 'Full Van', models: ['Sprinter', 'Transit'] },
    { id: 'boat', label: 'Boat', models: ['Bayliner', 'Sea Ray'] },
  ];

  const container = document.createElement('div');
  container.className = 'flex flex-wrap gap-2';

  const tiles = [];

  function vibrate() {
    if (typeof window !== 'undefined') {
      window.navigator?.vibrate?.(10);
    }
  }

  function update() {
    tiles.forEach(({ id, el }) => {
      const isSel = id === selected;
      el.setAttribute('aria-pressed', isSel ? 'true' : 'false');
      el.classList.toggle('bg-blue-100', isSel);
    });
  }

  function handleSelect(id) {
    selected = id;
    update();
    onSelect?.(id);
    vibrate();
  }

  sizes.forEach((size) => {
    const tile = document.createElement('div');
    tile.className = 'border rounded p-4 m-2 w-40 cursor-pointer select-none text-center';
    tile.setAttribute('role', 'button');
    tile.tabIndex = 0;

    const label = document.createElement('div');
    label.className = 'font-semibold mb-1';
    label.textContent = size.label;

    const models = document.createElement('div');
    models.className = 'text-xs text-gray-600';
    models.textContent = size.models.join(', ');

    tile.appendChild(label);
    tile.appendChild(models);

    tile.addEventListener('click', () => handleSelect(size.id));
    tile.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleSelect(size.id);
      }
    });

    tiles.push({ id: size.id, el: tile });
    container.appendChild(tile);
  });

  update();
  return container;
}
