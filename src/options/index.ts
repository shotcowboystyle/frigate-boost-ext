import { render } from 'solid-js/web';
import 'webext-base-css';
import optionsStorage from '../utils/options-storage.js';
// import './index.css';
import Option from './Options';

const appContainer = document.querySelector('#app-container');
if (!appContainer) {
  throw new Error('Can not find AppContainer');
}

render(Option, appContainer);

async function init() {
  await optionsStorage.syncForm('#options-form');
}

init();
