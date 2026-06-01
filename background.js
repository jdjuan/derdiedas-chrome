'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lookupGermanWord',
    title: 'Look up gender of "%s"',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'lookupGermanWord') {
    const selectedWord = info.selectionText.trim();
    chrome.storage.local.set({ pendingWord: selectedWord }, () => {
      chrome.action.openPopup?.() 
    });
  }
});