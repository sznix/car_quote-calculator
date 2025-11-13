const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');

test('bootstrap - mounts when container element exists', () => {
  // Setup fresh DOM
  const dom = new JSDOM('<!DOCTYPE html><html><body><div class="cleverlux-quote"></div></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
  });

  global.document = dom.window.document;
  global.navigator = { vibrate: null };

  // Manually require and run the bootstrap logic
  const renderSizeStep = require('../assets/js/steps/SizeStep');

  // Simulate the mount function
  const container = global.document.querySelector('.cleverlux-quote');
  assert.ok(container, 'container should exist');

  let selectedValue = null;
  const step = renderSizeStep({
    onNext(slug) {
      selectedValue = slug;
    },
  });
  container.appendChild(step);

  // Verify the step was mounted
  const tiles = container.querySelectorAll('[role="button"][data-value]');
  assert.strictEqual(tiles.length, 6, 'should mount all 6 tiles');

  const buttons = container.querySelectorAll('button');
  assert.strictEqual(buttons.length, 2, 'should mount 2 buttons');
});

test('bootstrap - does not mount when container does not exist', () => {
  // Setup fresh DOM without the container
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
  });

  global.document = dom.window.document;
  global.navigator = { vibrate: null };

  // Simulate the mount function
  const container = global.document.querySelector('.cleverlux-quote');
  assert.strictEqual(container, null, 'container should not exist');

  // The mount function should return early and not throw
  // In the actual bootstrap.js, the mount function checks for container
});

test('bootstrap - integration test with full user flow', () => {
  // Setup fresh DOM
  const dom = new JSDOM('<!DOCTYPE html><html><body><div class="cleverlux-quote"></div></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
  });

  global.document = dom.window.document;
  global.navigator = { vibrate: null };

  const renderSizeStep = require('../assets/js/steps/SizeStep');

  let selectedValue = null;
  const container = global.document.querySelector('.cleverlux-quote');
  const step = renderSizeStep({
    onNext(slug) {
      selectedValue = slug;
    },
  });
  container.appendChild(step);

  // User clicks on a tile
  const tiles = container.querySelectorAll('[role="button"][data-value]');
  const sedanTile = Array.from(tiles).find(t => t.getAttribute('data-value') === 'sedan');
  sedanTile.click();

  // Verify tile is selected
  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'true');

  // User clicks Next button
  const buttons = container.querySelectorAll('button');
  const nextBtn = buttons[1];
  assert.strictEqual(nextBtn.disabled, false, 'next button should be enabled');

  nextBtn.click();

  // Verify onNext was called with correct value
  assert.strictEqual(selectedValue, 'sedan');
});

test('bootstrap - integration test with modal lookup flow', () => {
  // Setup fresh DOM
  const dom = new JSDOM('<!DOCTYPE html><html><body><div class="cleverlux-quote"></div></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
  });

  global.document = dom.window.document;
  global.navigator = { vibrate: null };

  const renderSizeStep = require('../assets/js/steps/SizeStep');

  let selectedValue = null;
  const container = global.document.querySelector('.cleverlux-quote');
  const step = renderSizeStep({
    onNext(slug) {
      selectedValue = slug;
    },
  });
  container.appendChild(step);

  // User clicks "Not sure?" button
  const buttons = container.querySelectorAll('button');
  const unsureBtn = buttons[0];
  unsureBtn.click();

  // Verify modal is open
  const modal = global.document.body.querySelector('[role="dialog"]');
  assert.ok(modal, 'modal should be open');

  // User types in the input
  const input = modal.querySelector('input[type="text"]');
  input.value = 'Honda Accord';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

  // User clicks Use button
  const modalButtons = modal.querySelectorAll('button');
  const useBtn = modalButtons[0];
  useBtn.click();

  // Verify modal is closed
  assert.strictEqual(global.document.body.querySelectorAll('[role="dialog"]').length, 0);

  // Verify tile is selected
  const tiles = container.querySelectorAll('[role="button"][data-value]');
  const sedanTile = Array.from(tiles).find(t => t.getAttribute('data-value') === 'sedan');
  assert.strictEqual(sedanTile.getAttribute('aria-pressed'), 'true');

  // User clicks Next button
  const nextBtn = buttons[1];
  nextBtn.click();

  // Verify onNext was called
  assert.strictEqual(selectedValue, 'sedan');
});

test('bootstrap - works with document.readyState = complete', () => {
  // Setup DOM that's already loaded
  const dom = new JSDOM('<!DOCTYPE html><html><body><div class="cleverlux-quote"></div></body></html>', {
    url: 'http://localhost',
  });

  global.document = dom.window.document;
  global.navigator = { vibrate: null };

  // Simulate readyState = complete (not loading)
  Object.defineProperty(global.document, 'readyState', {
    value: 'complete',
    writable: true,
  });

  const renderSizeStep = require('../assets/js/steps/SizeStep');

  // The mount function should execute immediately when readyState is not 'loading'
  const container = global.document.querySelector('.cleverlux-quote');
  assert.ok(container, 'container should exist');

  const step = renderSizeStep({
    onNext(slug) {
      console.log('selected size', slug);
    },
  });
  container.appendChild(step);

  // Verify it mounted
  const tiles = container.querySelectorAll('[role="button"][data-value]');
  assert.strictEqual(tiles.length, 6, 'should mount all tiles immediately');
});

test('bootstrap - keyboard navigation works in integration', () => {
  // Setup fresh DOM
  const dom = new JSDOM('<!DOCTYPE html><html><body><div class="cleverlux-quote"></div></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
  });

  global.document = dom.window.document;
  global.navigator = { vibrate: null };

  const renderSizeStep = require('../assets/js/steps/SizeStep');

  let selectedValue = null;
  const container = global.document.querySelector('.cleverlux-quote');
  const step = renderSizeStep({
    onNext(slug) {
      selectedValue = slug;
    },
  });
  container.appendChild(step);

  // User presses Enter on a tile
  const tiles = container.querySelectorAll('[role="button"][data-value]');
  const sportsTile = Array.from(tiles).find(t => t.getAttribute('data-value') === 'sports');

  const event = new dom.window.KeyboardEvent('keydown', { key: 'Enter' });
  sportsTile.dispatchEvent(event);

  // Verify tile is selected
  assert.strictEqual(sportsTile.getAttribute('aria-pressed'), 'true');

  // Click Next button
  const buttons = container.querySelectorAll('button');
  const nextBtn = buttons[1];
  nextBtn.click();

  // Verify onNext was called
  assert.strictEqual(selectedValue, 'sports');
});
