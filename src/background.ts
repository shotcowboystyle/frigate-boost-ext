import {
  MESSAGING_DELETE_EVENTS,
  MESSAGING_GET_CURRENT_TAB,
  MESSAGING_PREVIOUS_TAB,
} from '@src/constants';
import { makeRequest } from '@utils/fetch';
import { onMessage, sendMessage } from 'webext-bridge';
import type { Tabs } from 'webextension-polyfill';
import browser from 'webextension-polyfill';
import onInstalled from './background/on-installed';
import './utils/options-storage';

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client');
  // load latest content script
  import('./background/content-script-hmr');
}

browser.runtime.onInstalled.addListener(onInstalled);

let previousTabId = 0;

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId;
    return;
  }

  let tab: Tabs.Tab;

  try {
    tab = await browser.tabs.get(previousTabId);
    previousTabId = tabId;
  } catch {
    return;
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab);
  sendMessage(
    MESSAGING_PREVIOUS_TAB,
    { title: tab.title },
    { context: 'content-script', tabId },
  );
});

onMessage(MESSAGING_GET_CURRENT_TAB, async () => {
  try {
    const tab = await browser.tabs.get(previousTabId);
    return {
      title: tab?.title,
    };
  } catch {
    return {
      title: undefined,
    };
  }
});

onMessage(MESSAGING_DELETE_EVENTS, async ({ data }) => {
  try {
    const res = await makeRequest({
      apiEndpointPath: `/api/events/${data.eventId}`,
      method: 'DELETE',
    });
    return res;
  } catch {
    return {
      success: false,
    };
  }
});

console.log('background loaded');
