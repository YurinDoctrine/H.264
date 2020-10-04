// Saves options to chrome.storage
function save_options() {
  const enable = document.getElementById("enable").checked;
  chrome.storage.local.set({
    enable: enable,
  });
}

// Restores checkbox state using the options stored in chrome.storage.
function restore_options() {
  // Use default value enable = true
  chrome.storage.local.get({ enable: true }, (options) => {
    document.getElementById("enable").checked = options.enable;
  });
}

// Restore saved options when extension is loaded
document.addEventListener("DOMContentLoaded", restore_options);

// l10n
for (let element of document.querySelectorAll("[data-l10n-id]")) {
  element.textContent = chrome.i18n.getMessage(element.dataset.l10nId);
}
