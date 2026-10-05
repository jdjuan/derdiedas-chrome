'use strict';

const NounDictionary = (() => {
  const normalize = (value) => value.normalize('NFC').trim();
  const create = (entries) => {
    const exact = new Map();
    const folded = new Map();
    for (const [word, mask] of entries) {
      const title = normalize(word);
      const key = title.toLowerCase();
      exact.set(title, { title, mask });
      // Preserve exact capitalization; combine recorded genders for ambiguous casing.
      const previous = folded.get(key);
      folded.set(key, { title: previous ? previous.title : title,
        mask: (previous ? previous.mask : 0) | mask });
    }
    return (value) => {
      const term = normalize(value);
      const noun = exact.get(term) || folded.get(term.toLowerCase());
      if (!noun) return null;
      const articles = ['der', 'die', 'das'].filter((_, index) => noun.mask & (1 << index));
      const pluralOnly = articles.length === 0 && Boolean(noun.mask & 8);
      return { title: noun.title, articles: pluralOnly ? ['die'] : articles, pluralOnly,
        link: 'https://de.wiktionary.org/wiki/' + encodeURIComponent(noun.title) + '#Deutsch' };
    };
  };
  return { create };
})();

if (typeof module !== 'undefined') module.exports = NounDictionary;
