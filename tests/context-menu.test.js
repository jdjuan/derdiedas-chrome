const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function background({ failStorage = false, failPopup = false } = {}) {
  const state = { data: {}, events: [], warnings: [] };
  const chrome = {
    runtime: { onInstalled: { addListener(fn) { state.install = fn; } } },
    contextMenus: {
      create(options) { state.menu = options; },
      onClicked: { addListener(fn) { state.click = fn; } }
    },
    storage: { session: { async set(value) {
      if (failStorage) throw new Error('Storage unavailable');
      Object.assign(state.data, value); state.events.push('stored');
    } } },
    action: { async openPopup(options) {
      state.options = options; state.events.push('opened');
      if (failPopup) throw new Error('Popup unavailable');
    } }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../background.js'), 'utf8'), {
    chrome, console: { warn(...args) { state.warnings.push(args); } }
  });
  return state;
}

test('selection menu is registered on install', () => {
  const state = background(); state.install();
  assert.equal(state.menu.id, 'lookupGermanWord');
  assert.equal(state.menu.contexts.join(','), 'selection');
  assert.match(state.menu.title, /%s/);
});
test('selection is stored before popup opens in the originating window', async () => {
  const state = background();
  await state.click({ menuItemId: 'lookupGermanWord', selectionText: '  Hund  ' }, { windowId: 3 });
  assert.equal(state.data.pendingWord, 'Hund');
  assert.deepEqual(state.events, ['stored', 'opened']);
  assert.equal(state.options.windowId, 3);
});
test('unrelated menu items and empty selections are ignored', async () => {
  const state = background();
  await state.click({ menuItemId: 'other', selectionText: 'Hund' });
  await state.click({ menuItemId: 'lookupGermanWord', selectionText: '   ' });
  await state.click({ menuItemId: 'lookupGermanWord' });
  assert.deepEqual(state.events, []);
});
test('popup failure retains the selection for manual toolbar lookup', async () => {
  const state = background({ failPopup: true });
  await state.click({ menuItemId: 'lookupGermanWord', selectionText: 'Hund' });
  assert.equal(state.data.pendingWord, 'Hund');
  assert.equal(state.warnings.length, 1);
});
test('storage failure does not open a popup with stale data', async () => {
  const state = background({ failStorage: true });
  await state.click({ menuItemId: 'lookupGermanWord', selectionText: 'Hund' });
  assert.deepEqual(state.events, []);
  assert.equal(state.warnings.length, 1);
});
