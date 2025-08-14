export function renderVehicleSizeTiles({ selected = null, onSelect } = {}) {
  const sizes = [
    { id: 'sedan', label: 'Sedan', models: ['Camry', 'Accord'] },
    { id: 'sports', label: 'Sports', models: ['911', 'Corvette'] },
    { id: 'small_suv', label: 'Small SUV', models: ['RAV4', 'CR-V'] },
    { id: 'large_suv', label: 'Large SUV', models: ['Tahoe', 'Explorer'] },
    { id: 'full_van', label: 'Full Van', models: ['Sprinter', 'Transit'] },
    { id: 'boat', label: 'Boat', models: ['Bayliner', 'Sea Ray'] }
  ];

  const container = document.createElement('div');
  container.className = 'grid grid-cols-2 md:grid-cols-3 gap-4';

  let current = selected;
  const tiles = [];

  const select = (id) => {
    current = id;
    tiles.forEach((tile) => {
      tile.setAttribute('aria-pressed', tile.dataset.id === current ? 'true' : 'false');
    });
    onSelect && onSelect(id);
  };

  sizes.forEach((s) => {
    const tile = document.createElement('div');
    tile.dataset.id = s.id;
    tile.className = 'border p-4 rounded cursor-pointer select-none text-center';
    tile.setAttribute('role', 'button');
    tile.tabIndex = 0;
    tile.setAttribute('aria-pressed', s.id === current ? 'true' : 'false');

    const label = document.createElement('div');
    label.className = 'font-semibold';
    label.textContent = s.label;
    tile.appendChild(label);

    const models = document.createElement('div');
    models.className = 'text-xs text-gray-500';
    models.textContent = s.models.join(', ');
    tile.appendChild(models);

    const trigger = () => {
      if (typeof window !== 'undefined') {
        window.navigator?.vibrate?.(10);
      }
      select(s.id);
    };

    tile.addEventListener('click', trigger);
    tile.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        trigger();
      }
    });

    tiles.push(tile);
    container.appendChild(tile);
  });

  return container;
}
