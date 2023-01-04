// import ReactDom from "react-dom/client";
import { onMessage } from 'webext-bridge';
// import browser from "webextension-polyfill";
// import { App } from "./views/App";
import { MESSAGING_PREVIOUS_TAB } from '@src/constants';

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[frigate-boost] Hello world from content script');

  // communication example: send previous tab title from background page
  onMessage(MESSAGING_PREVIOUS_TAB, ({ data }) => {
    console.log(`[frigate-boost] Navigate from page '${data.title}'`);
  });

  // mount component to context window
  // const container = document.createElement("div");
  // const root = document.createElement("div");
  // const styleEl = document.createElement("link");
  // const shadowDOM =
  // 	container.attachShadow?.({ mode: __DEV__ ? "open" : "closed" }) ||
  // 	container;
  // styleEl.setAttribute("rel", "stylesheet");
  // styleEl.setAttribute(
  // 	"href",
  // 	browser.runtime.getURL("dist/contentScripts/style.css")
  // );
  // shadowDOM.appendChild(styleEl);
  // shadowDOM.appendChild(root);
  // document.body.appendChild(container);
  // ReactDom.createRoot(root).render(<App />);
})();
