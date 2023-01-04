import type { Runtime } from 'webextension-polyfill';
import browser from 'webextension-polyfill';

const uninstallUrl = 'https://justiceo.github.io/xtension/uninstall.html';
const welcomeUrl = 'https://justiceo.github.io/xtension/uninstall.html';

const onInstalled = (details: Runtime.OnInstalledDetailsType) => {
  // On fresh install, open page how to use extension.
  if (details.reason === 'install') {
    browser.tabs.create({
      url: welcomeUrl,
      active: true,
    });
  }

  // Set url to take users upon uninstall.
  browser.runtime.setUninstallURL(uninstallUrl);
};

export default onInstalled;
