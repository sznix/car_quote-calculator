const { test } = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.navigator = { vibrate: null };

const renderVehicleSizeTiles = require('../assets/js/components/VehicleSizeTiles');

test('VehicleSizeTiles - renders all 6 vehicle size tiles', () => {
  const container = renderVehicleSizeTiles();

  assert.strictEqual(container.children.length, 6, 'should render 6 tiles');

  const expectedSizes = ['sedan', 'sports', 'small_suv', 'large_suv', 'full_van', 'boat'];
  const expectedLabels = ['Sedan', 'Sports', 'Small SUV', 'Large SUV', 'Full Van', 'Boat'];

  for (let i = 0; i < 6; i++) {
    const tile = container.children[i];
    assert.strictEqual(tile.className, 'vehicle-size-tile');
    assert.strictEqual(tile.getAttribute('data-value'), expectedSizes[i]);
    assert.strictEqual(tile.textContent, expectedLabels[i]);
  }
});

test('VehicleSizeTiles - tiles have correct ARIA attributes', () => {
  const container = renderVehicleSizeTiles();

  for (const tile of container.children) {
    assert.strictEqual(tile.getAttribute('role'), 'button');
    assert.strictEqual(tile.tabIndex, 0);
    assert.ok(['true', 'false'].includes(tile.getAttribute('aria-pressed')));
  }
});

test('VehicleSizeTiles - clicking a tile updates selection', () => {
  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];

  // Initially not pressed
  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'false');

  // Click the tile
  sedanTile.click();

  // Should be pressed now
  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'true');
  assert.strictEqual(sedanTile.style.background, 'rgb(224, 224, 224)');
});

test('VehicleSizeTiles - only one tile can be selected at a time', () => {
  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];
  const sportsTile = container.children[1];

  // Click sedan
  sedanTile.click();
  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'true');
  assert.strictEqual(sportsTile.getAttribute('aria-pressed'), 'false');

  // Click sports
  sportsTile.click();
  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'false');
  assert.strictEqual(sportsTile.getAttribute('aria-pressed'), 'true');
});

test('VehicleSizeTiles - Enter key selects a tile', () => {
  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];

  // Create and dispatch Enter key event
  const event = new dom.window.KeyboardEvent('keydown', { key: 'Enter' });
  sedanTile.dispatchEvent(event);

  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'true');
});

test('VehicleSizeTiles - Space key selects a tile', () => {
  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];

  // Create and dispatch Space key event
  const event = new dom.window.KeyboardEvent('keydown', { key: ' ' });
  sedanTile.dispatchEvent(event);

  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'true');
});

test('VehicleSizeTiles - other keys do not select a tile', () => {
  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];

  // Create and dispatch Tab key event
  const event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
  sedanTile.dispatchEvent(event);

  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'false');
});

test('VehicleSizeTiles - onSelect callback is called with correct value', () => {
  let selectedValue = null;
  const container = renderVehicleSizeTiles({
    onSelect(value) {
      selectedValue = value;
    }
  });

  const sedanTile = container.children[0];
  sedanTile.click();

  assert.strictEqual(selectedValue, 'sedan');
});

test('VehicleSizeTiles - onSelect is called on keyboard selection', () => {
  let selectedValue = null;
  const container = renderVehicleSizeTiles({
    onSelect(value) {
      selectedValue = value;
    }
  });

  const sportsTile = container.children[1];
  const event = new dom.window.KeyboardEvent('keydown', { key: 'Enter' });
  sportsTile.dispatchEvent(event);

  assert.strictEqual(selectedValue, 'sports');
});

test('VehicleSizeTiles - initial selected value is applied', () => {
  const container = renderVehicleSizeTiles({ selected: 'large_suv' });

  const largeSuvTile = container.children[3];
  assert.strictEqual(largeSuvTile.getAttribute('aria-pressed'), 'true');
  assert.strictEqual(largeSuvTile.style.background, 'rgb(224, 224, 224)');
});

test('VehicleSizeTiles - focus adds outline style', () => {
  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];

  // Trigger focus event
  const focusEvent = new dom.window.Event('focus');
  sedanTile.dispatchEvent(focusEvent);

  // JSDOM doesn't convert colors to rgb format like browsers do
  assert.ok(sedanTile.style.outline.includes('2px'), 'outline should include 2px');
  assert.ok(sedanTile.style.outline.includes('solid'), 'outline should be solid');
  assert.strictEqual(sedanTile.style.outlineOffset, '2px');
});

test('VehicleSizeTiles - blur removes outline style', () => {
  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];

  // Trigger focus first
  const focusEvent = new dom.window.Event('focus');
  sedanTile.dispatchEvent(focusEvent);

  // Then blur
  const blurEvent = new dom.window.Event('blur');
  sedanTile.dispatchEvent(blurEvent);

  assert.strictEqual(sedanTile.style.outline, '');
  assert.strictEqual(sedanTile.style.outlineOffset, '');
});

test('VehicleSizeTiles - vibrate is called when navigator.vibrate exists', () => {
  let vibrateCallCount = 0;
  let vibrateDuration = null;

  global.navigator.vibrate = (duration) => {
    vibrateCallCount++;
    vibrateDuration = duration;
  };

  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];
  sedanTile.click();

  assert.strictEqual(vibrateCallCount, 1);
  assert.strictEqual(vibrateDuration, 10);

  // Clean up
  global.navigator.vibrate = null;
});

test('VehicleSizeTiles - works when onSelect is not provided', () => {
  const container = renderVehicleSizeTiles();
  const sedanTile = container.children[0];

  // Should not throw
  assert.doesNotThrow(() => {
    sedanTile.click();
  });

  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'true');
});

test('VehicleSizeTiles - works with no options provided', () => {
  const container = renderVehicleSizeTiles();

  assert.strictEqual(container.children.length, 6);
  assert.strictEqual(container.children[0].getAttribute('aria-pressed'), 'false');
});
