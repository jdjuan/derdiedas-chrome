'use strict';

const input$ = document.getElementById('word-input');
const searchButton$ = document.getElementById('search-button');
const loader$ = document.getElementById('loader');
const notFound$ = document.getElementById('not-found');
const notFoundMessage$ = document.getElementById('not-found-message');
const severalMeanings$ = document.getElementById('several-meanings');
const serverError$ = document.getElementById('server-error');
const result$ = document.getElementById('result');
const title$ = document.getElementById('title');
const article$ = document.getElementById('article');
const description$ = document.getElementById('description');
const link$ = document.getElementById('link');
let dictionaryPromise;
let latestSearch = 0;

const loadDictionary = () => {
  if (!dictionaryPromise) {
    dictionaryPromise = fetch('data/nouns.json')
      .then((response) => {
        if (!response.ok) throw new Error('Dictionary could not be loaded');
        return response.json();
      })
      .then(NounDictionary.create)
      .catch((error) => {
        dictionaryPromise = undefined;
        throw error;
      });
  }
  return dictionaryPromise;
};

const searchDefinition = async () => {
  const search = ++latestSearch;
  const term = input$.value.normalize('NFC').trim();
  for (const element of [result$, notFound$, serverError$, description$, severalMeanings$]) {
    element.style.display = 'none';
  }
  loader$.style.display = 'none';
  if (!term) {
    input$.focus();
    return;
  }
  loader$.style.display = 'block';
  try {
    const lookup = await loadDictionary();
    if (search !== latestSearch) return;
    const noun = lookup(term);
    if (!noun) {
      notFoundMessage$.textContent = 'This noun is not in the offline dictionary. Check the spelling or try its singular form.';
      notFound$.style.display = 'block';
      document.getElementById('not-found-link').href =
        'https://de.wiktionary.org/wiki/Special:Search?search=' + encodeURIComponent(term);
      return;
    }
    title$.textContent = noun.title;
    article$.textContent = noun.articles.join(' / ');
    link$.href = noun.link;
    if (noun.pluralOnly) {
      description$.textContent = 'Plural-only noun: die is the plural article.';
      description$.style.display = 'block';
    } else if (noun.articles.length > 1) {
      severalMeanings$.style.display = 'block';
    }
    result$.style.display = 'block';
  } catch (error) {
    if (search === latestSearch) serverError$.style.display = 'block';
  } finally {
    if (search === latestSearch) loader$.style.display = 'none';
  }
};

searchButton$.onclick = searchDefinition;
input$.onkeyup = ({ key }) => {
  if (key === 'Enter') searchDefinition();
};

if (typeof chrome !== 'undefined' && chrome.storage?.session) {
  chrome.storage.session.get('pendingWord')
  .then(async ({ pendingWord }) => {
    if (typeof pendingWord === 'string' && pendingWord.trim()) {
      await chrome.storage.session.remove('pendingWord');
      input$.value = pendingWord;
      searchDefinition();
    }
  })
  .catch((error) => console.warn('Could not read the selected noun.', error));
}
