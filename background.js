'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lookupGermanWord',
    title: 'Look up gender of "%s"',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'lookupGermanWord') return;
  const selectedWord = (info.selectionText || '').trim();
  if (!selectedWord) return;
  try {
    await chrome.storage.session.set({ pendingWord: selectedWord });
    const options = tab && Number.isInteger(tab.windowId) ? { windowId: tab.windowId } : {};
    await chrome.action.openPopup(options);
  } catch (error) {
    // Keep the pending selection so opening the toolbar popup can retry.
    console.warn('Could not open the noun lookup popup. Open it from the toolbar.', error);
  }
});
