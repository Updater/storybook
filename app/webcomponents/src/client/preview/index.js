import { createStore } from 'redux';
import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import { navigator, window } from 'global';
import { handleKeyboardShortcuts } from '@storybook/ui/dist/libs/key_events';
import {
  StoryStore,
  ClientApi,
  ConfigApi,
  Actions,
  reducer,
  syncUrlWithStore,
} from '@storybook/core/client';

import render from './render';

// check whether we're running on node/browser
const isBrowser =
  navigator &&
  navigator.userAgent &&
  navigator.userAgent !== 'storyshots' &&
  !(navigator.userAgent.indexOf('Node.js') > -1) &&
  !(navigator.userAgent.indexOf('jsdom') > -1);

const storyStore = new StoryStore();
const reduxStore = createStore(reducer);

const decorateStory = (getStory, decorators) =>
  decorators.reduce(
    (decorated, decorator) => context => {
      const story = () => decorated(context);
      return decorator(story, context);
    },
    getStory
  );
const context = { storyStore, reduxStore, decorateStory };

if (isBrowser) {
  // create preview channel
  const channel = createChannel({ page: 'preview' });
  channel.on('setCurrentStory', data => {
    // If we're in the same kind just use redux, otherwise we need to reload the
    // iframe to prevent redefination of potentially shared webcomponents
    const previousKind = window.location.search.match(/selectedKind=([a-z-]*)/);
    if ((previousKind && previousKind[1]) === data.kind) {
      reduxStore.dispatch(Actions.selectStory(data.kind, data.story));
    } else {
      window.location.assign(`iframe.html?selectedKind=${data.kind}&selectedStory=${data.story}`);
    }
  });
  addons.setChannel(channel);
  Object.assign(context, { channel });

  syncUrlWithStore(reduxStore);

  // Handle keyboard shortcuts
  window.onkeydown = handleKeyboardShortcuts(channel);
}

const clientApi = new ClientApi(context);
export const { storiesOf, setAddon, addDecorator, clearDecorators, getStorybook } = clientApi;

const configApi = new ConfigApi({ ...context, clearDecorators });
export const { configure } = configApi;

// initialize the UI
const renderUI = () => {
  if (isBrowser) {
    render(context);
  }
};

reduxStore.subscribe(renderUI);

export const forceReRender = () => render(context, true);
