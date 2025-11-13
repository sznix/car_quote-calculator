const { test } = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.navigator = { vibrate: null };

const renderSizeStep = require('../assets/js/steps/SizeStep');

test('SizeStep - renders with tiles and buttons', () => {
  const step = renderSizeStep();

  // Should have tiles container (first child)
  assert.ok(step.children.length > 0);

  // Find the actions container
  const actionsDiv = step.querySelector('div');
  assert.ok(actionsDiv);

  // Find buttons
  const buttons = step.querySelectorAll('button');
  assert.strictEqual(buttons.length, 2, 'should have 2 buttons');

  const unsureBtn = buttons[0];
  const nextBtn = buttons[1];

  assert.strictEqual(unsureBtn.textContent, 'Not sure?');
  assert.strictEqual(nextBtn.textContent, 'Confirm');
});

test('SizeStep - Next button is initially disabled', () => {
  const step = renderSizeStep();
  const nextBtn = step.querySelectorAll('button')[1];

  assert.strictEqual(nextBtn.disabled, true);
});

test('SizeStep - selecting a tile enables Next button', () => {
  const step = renderSizeStep();

  // Get the first tile and click it
  const tiles = step.querySelectorAll('[role="button"][data-value]');
  tiles[0].click();

  // Next button should now be enabled
  const nextBtn = step.querySelectorAll('button')[1];
  assert.strictEqual(nextBtn.disabled, false);
});

test('SizeStep - clicking Next calls onNext with selected value', () => {
  let nextValue = null;
  const step = renderSizeStep({
    onNext(value) {
      nextValue = value;
    }
  });

  // Select sedan
  const tiles = step.querySelectorAll('[role="button"][data-value]');
  tiles[0].click();

  // Click Next
  const nextBtn = step.querySelectorAll('button')[1];
  nextBtn.click();

  assert.strictEqual(nextValue, 'sedan');
});

test('SizeStep - clicking Next when nothing selected does not call onNext', () => {
  let nextCalled = false;
  const step = renderSizeStep({
    onNext() {
      nextCalled = true;
    }
  });

  // Click Next without selecting anything
  const nextBtn = step.querySelectorAll('button')[1];
  nextBtn.click();

  assert.strictEqual(nextCalled, false);
});

test('SizeStep - "Not sure?" button opens modal', () => {
  const step = renderSizeStep();

  // Initially no modal
  assert.strictEqual(document.body.querySelectorAll('[role="dialog"]').length, 0);

  // Click "Not sure?"
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  // Modal should be present
  const modal = document.body.querySelector('[role="dialog"]');
  assert.ok(modal, 'modal should be opened');
  assert.strictEqual(modal.getAttribute('aria-modal'), 'true');
  assert.strictEqual(modal.getAttribute('aria-label'), 'Vehicle model lookup');

  // Clean up
  document.body.querySelector('[style*="position: fixed"]').remove();
});

test('SizeStep - modal contains input and buttons', () => {
  const step = renderSizeStep();

  // Open modal
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  const modal = document.body.querySelector('[role="dialog"]');
  const input = modal.querySelector('input[type="text"]');
  const buttons = modal.querySelectorAll('button');

  assert.ok(input, 'modal should have input');
  assert.strictEqual(input.placeholder, 'Enter make and model');
  assert.strictEqual(input.getAttribute('aria-label'), 'Vehicle make and model');

  assert.strictEqual(buttons.length, 2, 'modal should have 2 buttons');
  assert.strictEqual(buttons[0].textContent, 'Use');
  assert.strictEqual(buttons[1].textContent, 'Cancel');

  // Clean up
  document.body.querySelector('[style*="position: fixed"]').remove();
});

test('SizeStep - modal Cancel button closes modal', () => {
  const step = renderSizeStep();

  // Open modal
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  assert.ok(document.body.querySelector('[role="dialog"]'));

  // Click Cancel
  const modal = document.body.querySelector('[role="dialog"]');
  const cancelBtn = modal.querySelectorAll('button')[1];
  cancelBtn.click();

  // Modal should be closed
  assert.strictEqual(document.body.querySelectorAll('[role="dialog"]').length, 0);
});

test('SizeStep - modal Escape key closes modal', () => {
  const step = renderSizeStep();

  // Open modal
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  const overlay = document.body.querySelector('[style*="position: fixed"]');
  assert.ok(overlay);

  // Press Escape
  const event = new dom.window.KeyboardEvent('keydown', { key: 'Escape' });
  overlay.dispatchEvent(event);

  // Modal should be closed
  assert.strictEqual(document.body.querySelectorAll('[role="dialog"]').length, 0);
});

test('SizeStep - modal input suggests vehicle size', () => {
  const step = renderSizeStep();

  // Open modal
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  const modal = document.body.querySelector('[role="dialog"]');
  const input = modal.querySelector('input[type="text"]');

  // Type a known vehicle
  input.value = 'Honda Accord';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

  // Check if a tile is highlighted (has outline style)
  const tiles = step.querySelectorAll('[role="button"][data-value]');
  const sedanTile = Array.from(tiles).find(t => t.getAttribute('data-value') === 'sedan');

  assert.ok(sedanTile, 'sedan tile should exist');
  assert.ok(sedanTile.style.outline.includes('dashed'), 'sedan tile should be highlighted');

  // Clean up
  document.body.querySelector('[style*="position: fixed"]').remove();
});

test('SizeStep - modal Use button selects suggested tile', () => {
  const step = renderSizeStep();

  // Open modal
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  const modal = document.body.querySelector('[role="dialog"]');
  const input = modal.querySelector('input[type="text"]');

  // Type a known vehicle
  input.value = 'Honda Accord';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

  // Click Use
  const useBtn = modal.querySelectorAll('button')[0];
  useBtn.click();

  // Modal should be closed
  assert.strictEqual(document.body.querySelectorAll('[role="dialog"]').length, 0);

  // Sedan tile should be selected
  const tiles = step.querySelectorAll('[role="button"][data-value]');
  const sedanTile = Array.from(tiles).find(t => t.getAttribute('data-value') === 'sedan');
  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'true');

  // Next button should be enabled
  const nextBtn = step.querySelectorAll('button')[1];
  assert.strictEqual(nextBtn.disabled, false);
});

test('SizeStep - modal clears highlight when closed', () => {
  const step = renderSizeStep();

  // Open modal
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  const modal = document.body.querySelector('[role="dialog"]');
  const input = modal.querySelector('input[type="text"]');

  // Type a known vehicle to highlight a tile
  input.value = 'Honda Accord';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

  // Cancel modal
  const cancelBtn = modal.querySelectorAll('button')[1];
  cancelBtn.click();

  // Check that no tiles have dashed outline
  const tiles = step.querySelectorAll('[role="button"][data-value]');
  for (const tile of tiles) {
    assert.ok(!tile.style.outline.includes('dashed'), 'tiles should not have dashed outline');
  }
});

test('SizeStep - modal with unknown vehicle does not highlight any tile', () => {
  const step = renderSizeStep();

  // Open modal
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  const modal = document.body.querySelector('[role="dialog"]');
  const input = modal.querySelector('input[type="text"]');

  // Type an unknown vehicle
  input.value = 'Unknown Car Model';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

  // Check that no tiles have dashed outline
  const tiles = step.querySelectorAll('[role="button"][data-value]');
  for (const tile of tiles) {
    assert.ok(!tile.style.outline.includes('dashed'), 'tiles should not be highlighted for unknown model');
  }

  // Clean up
  document.body.querySelector('[style*="position: fixed"]').remove();
});

test('SizeStep - works without onNext callback', () => {
  const step = renderSizeStep();

  // Select a tile
  const tiles = step.querySelectorAll('[role="button"][data-value]');
  tiles[0].click();

  // Click Next - should not throw
  const nextBtn = step.querySelectorAll('button')[1];
  assert.doesNotThrow(() => {
    nextBtn.click();
  });
});

test('SizeStep - multiple tile selections update properly', () => {
  const step = renderSizeStep();

  const tiles = step.querySelectorAll('[role="button"][data-value]');

  // Select first tile
  tiles[0].click();
  assert.strictEqual(tiles[0].getAttribute('aria-pressed'), 'true');

  // Select second tile
  tiles[1].click();
  assert.strictEqual(tiles[0].getAttribute('aria-pressed'), 'false');
  assert.strictEqual(tiles[1].getAttribute('aria-pressed'), 'true');

  // Select third tile
  tiles[2].click();
  assert.strictEqual(tiles[0].getAttribute('aria-pressed'), 'false');
  assert.strictEqual(tiles[1].getAttribute('aria-pressed'), 'false');
  assert.strictEqual(tiles[2].getAttribute('aria-pressed'), 'true');
});

test('SizeStep - modal Use button with no suggestion closes modal without selecting', () => {
  const step = renderSizeStep();

  // Open modal
  const unsureBtn = step.querySelectorAll('button')[0];
  unsureBtn.click();

  const modal = document.body.querySelector('[role="dialog"]');
  const input = modal.querySelector('input[type="text"]');

  // Type an unknown vehicle
  input.value = 'Unknown Model';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

  // Click Use
  const useBtn = modal.querySelectorAll('button')[0];
  useBtn.click();

  // Modal should be closed
  assert.strictEqual(document.body.querySelectorAll('[role="dialog"]').length, 0);

  // Next button should still be disabled
  const nextBtn = step.querySelectorAll('button')[1];
  assert.strictEqual(nextBtn.disabled, true);
});
