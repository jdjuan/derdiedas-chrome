# Der Die Das privacy policy

Last updated: October 5, 2026. Applies to version 1.5 and later.

Der Die Das is a Chrome extension made by Juan Herrera to look up German noun genders.

## Local lookups

Typed nouns are processed locally using the dictionary bundled with the extension.
The extension does not transmit searches to a server, record browsing history,
use analytics, or collect account, identity, financial, health, or location information.

## Right-click selections

When you choose the extension's right-click command, Chrome provides the text you
explicitly selected. The extension temporarily stores that word in
`chrome.storage.session` (browser session memory) so the popup can look it up.
The pending word is removed when the popup consumes it. If opening the popup
fails, the word remains available for a manual toolbar lookup until it is consumed
or browser session storage is cleared. It is not saved to persistent local storage,
synchronized, or sent to the developer or any server.

The contextMenus permission provides the selection menu. The storage permission
provides this temporary transfer of the selected noun to the popup. The extension
has no content scripts or permission to read full webpages.

## Optional external links

If you click a Wiktionary entry or search link, your browser opens Wiktionary online
and includes that word in the URL. Wiktionary then receives the request under its
own privacy policy: https://foundation.wikimedia.org/wiki/Policy:Privacy_policy.
Other credit and developer links also open external websites when clicked.
The extension's noun lookups do not require opening these links.

## Data sharing

The developer does not receive, sell, or share your searches or selected words.
No user data is used for advertising, creditworthiness, or lending decisions.

## Contact and changes

For privacy questions, open an issue at
https://github.com/jdjuan/derdiedas-chrome/issues.
This policy will be updated if the extension's data handling changes.
