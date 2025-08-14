const renderVehicleSizeTiles = require('../components/VehicleSizeTiles');
const lookupVehicleSize = require('../hooks/useVehicleLookup');

function renderSizeStep({ onNext } = {}) {
  let selected = null;
  let nextBtn;
  const root = document.createElement('div');

  const tiles = renderVehicleSizeTiles({
    onSelect(value) {
      selected = value;
      nextBtn.disabled = !selected;
    },
  });
  root.appendChild(tiles);

  const actions = document.createElement('div');
  actions.style.marginTop = '1rem';
  root.appendChild(actions);

  const unsureBtn = document.createElement('button');
  unsureBtn.type = 'button';
  unsureBtn.textContent = 'Not sure?';
  actions.appendChild(unsureBtn);

  nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.textContent = 'Confirm';
  nextBtn.disabled = true;
  nextBtn.style.marginLeft = '0.5rem';
  actions.appendChild(nextBtn);

  nextBtn.addEventListener('click', () => {
    if (selected && typeof onNext === 'function') {
      onNext(selected);
    }
  });

  unsureBtn.addEventListener('click', openModal);

  function openModal() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.right = 0;
    overlay.style.bottom = 0;
    overlay.style.background = 'rgba(0,0,0,0.3)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const modal = document.createElement('div');
    modal.style.background = '#fff';
    modal.style.padding = '1rem';
    modal.style.borderRadius = '4px';
    modal.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    overlay.appendChild(modal);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter make and model';
    modal.appendChild(input);

    const confirm = document.createElement('button');
    confirm.type = 'button';
    confirm.textContent = 'Use';
    confirm.style.marginLeft = '0.5rem';
    modal.appendChild(confirm);

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Cancel';
    cancel.style.marginLeft = '0.5rem';
    modal.appendChild(cancel);

    document.body.appendChild(overlay);
    input.focus();

    let suggested = null;

    function highlightSuggestion(value) {
      for (const child of tiles.children) {
        const match = child.getAttribute('data-value') === value;
        child.style.outline = match ? '2px dashed #2684ff' : '';
        child.style.outlineOffset = match ? '2px' : '';
      }
    }

    input.addEventListener('input', () => {
      suggested = lookupVehicleSize(input.value);
      highlightSuggestion(suggested);
    });

    confirm.addEventListener('click', () => {
      if (suggested) {
        const tile = tiles.querySelector(`[data-value="${suggested}"]`);
        if (tile) { tile.click(); }
      }
      close();
    });

    cancel.addEventListener('click', close);

    function close() {
      overlay.remove();
      highlightSuggestion(null);
    }
  }

  return root;
}

module.exports = renderSizeStep;
