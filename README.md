# Der Die Das for Chrome

Version 1.5 restores German noun gender lookup using a bundled dictionary.
Searches work offline and require no server or API keys. Chrome 127 or newer
is required. The contextMenus and storage permissions enable right-click
lookup and temporarily hold the selected noun in browser session memory.
The dictionary includes 92,643 noun entries from german-nouns / Wiktionary.
Definitions are available through an optional online Wiktionary link.

## Try locally

1. Open `chrome://extensions` and enable Developer mode.
2. Select **Load unpacked** and choose this directory.
3. Open the extension and search for Haus, Frau, Mann, Mädchen, Band, or Leute.
4. Disconnect from the internet and repeat; noun lookup still works.
5. Select a noun on a webpage, right-click, and choose **Look up gender of**.
   The popup opens and searches automatically. If Chrome cannot open it,
   open the extension from the toolbar to look up the pending selection.

Exact spelling is required (case-insensitive lookup is supported). Inflected
forms and new compounds may be absent. Multiple recorded genders are shown
without guessing which meaning was intended. Plural-only nouns are labeled.

## Verify

Run `node --test tests/*.test.js`. No dependencies need installing.

## Rebuild the dictionary

Download the CSV at the pinned `SOURCE_URL` in `scripts/build_dictionary.py`,
then run `python3 scripts/build_dictionary.py /path/to/nouns.csv`.
The generated file is `data/nouns.json`. Preserve the license and attribution
files when distributing it; the adapted dictionary is CC BY-SA 4.0.

## Chrome Web Store release

Upload the prepared version 1.5 ZIP to the existing extension listing.
Rebuild it with `python3 scripts/package_release.py`; the archive is saved
as `dist/derdiedas-1.5.zip`.
Only runtime files, images, the dictionary, and its attribution/license
should be in the archive. Describe offline lookup and the change from Duden
to Wiktionary in the listing. This repository does not publish automatically.
