const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const entries = JSON.parse(fs.readFileSync(path.join(root, 'data/nouns.json')));
const lookup = require('../dictionary').create(entries);

test('known nouns, Unicode normalization, and casing', () => {
  for (const [word, article] of [[' Haus ', 'das'], ['frau', 'die'], ['MANN', 'der'],
    ['Ma\u0308dchen', 'das'], ['Straße', 'die'], ['Fahrrad', 'das']]) {
    assert.deepEqual(lookup(word).articles, [article]);
  }
});
test('homonyms retain all genders and plural-only nouns are labeled', () => {
  assert.deepEqual(lookup('Band').articles, ['der', 'die', 'das']);
  assert.deepEqual(lookup('See').articles, ['der', 'die']);
  assert.equal(lookup('Leute').pluralOnly, true);
  assert.deepEqual(lookup('Leute').articles, ['die']);
});
test('unknown words and object prototype keys cannot become results', () => {
  for (const word of ['', 'xyznotanoun123', '__proto__', 'constructor']) {
    assert.equal(lookup(word), null);
  }
  assert.equal(lookup('Mädchen').link, 'https://de.wiktionary.org/wiki/M%C3%A4dchen#Deutsch');
});
test('every bundled entry has a valid title, mask, and rendered article', () => {
  assert.equal(entries.length, 92643);
  for (const [title, mask] of entries) {
    assert.equal(typeof title, 'string');
    assert.ok(Number.isInteger(mask) && mask > 0 && mask < 16);
    assert.ok(lookup(title).articles.length > 0, title);
  }
});

function popup(fetcher) {
  const elements = new Map();
  const context = vm.createContext({
    document: { getElementById(id) {
      if (!elements.has(id)) elements.set(id, { style: {}, value: '', focus() {} });
      return elements.get(id);
    } }, fetch: fetcher
  });
  for (const file of ['dictionary.js', 'popup.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  }
  return { elements, async search(value) {
    elements.get('word-input').value = value;
    await elements.get('search-button').onclick();
  } };
}

test('popup loads only local data once; results and misses reset cleanly', async () => {
  let calls = 0;
  const app = popup(async (url) => {
    assert.equal(url, 'data/nouns.json');
    calls++;
    return { ok: true, json: async () => entries };
  });
  await app.search('Band');
  assert.equal(app.elements.get('article').textContent, 'der / die / das');
  assert.equal(app.elements.get('several-meanings').style.display, 'block');
  await app.search('Haus');
  assert.equal(app.elements.get('several-meanings').style.display, 'none');
  assert.equal(app.elements.get('article').textContent, 'das');
  await app.search('xyznotanoun123');
  assert.equal(app.elements.get('not-found').style.display, 'block');
  assert.equal(app.elements.get('result').style.display, 'none');
  assert.match(app.elements.get('not-found-link').href, /search=xyznotanoun123$/);
  await app.search('   ');
  assert.equal(app.elements.get('not-found').style.display, 'none');
  assert.equal(app.elements.get('loader').style.display, 'none');
  assert.equal(calls, 1);
});
test('dictionary loading errors are visible and retryable', async () => {
  let calls = 0;
  const app = popup(async () => {
    if (++calls === 1) throw new Error('Read failed');
    return { ok: true, json: async () => entries };
  });
  await app.search('Haus');
  assert.equal(app.elements.get('server-error').style.display, 'block');
  await app.search('Frau');
  assert.equal(app.elements.get('server-error').style.display, 'none');
  assert.equal(app.elements.get('article').textContent, 'die');
});
test('latest search wins when users type while the dictionary is loading', async () => {
  let resolve;
  const app = popup(() => new Promise(done => { resolve = done; }));
  const first = app.search('Haus');
  const second = app.search('Frau');
  resolve({ ok: true, json: async () => entries });
  await Promise.all([first, second]);
  assert.equal(app.elements.get('title').textContent, 'Frau');
});
