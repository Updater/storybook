'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = renderError;
exports.renderException = renderException;
exports.renderMain = renderMain;
exports.default = renderPreview;
function createFragment(DOMText) {
  return document.createRange().createContextualFragment(DOMText);
}

function renderError(error) {
  var errorFragment = createFragment('\n    <div>\n      ' + error.message + '\n    </div>\n  ');
  document.querySelector('#error-display').appendChild(errorFragment);
}

function renderException(error) {
  renderError(error);

  // console.log(error.stack);
}

var previousStory = void 0;
var previousKind = void 0;

function emptyRoot(root) {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
}

function renderMain(data, storyStore, forceRender) {
  if (storyStore.size() === 0) return;

  var selectedKind = data.selectedKind,
      selectedStory = data.selectedStory;


  var story = storyStore.getStory(selectedKind, selectedStory);

  // https://github.com/storybooks/react-storybook/issues/116
  if (forceRender || selectedKind !== previousKind || previousStory !== selectedStory) {
    previousStory = selectedStory;
    previousKind = selectedKind;
  } else {
    return;
  }

  var context = {
    kind: selectedKind,
    story: selectedStory
  };

  var CustomElement = story ? story(context) : '<p>There is no preview for this story</p>';

  var root = document.querySelector('#root');
  emptyRoot(root);
  var child = void 0;

  if (typeof CustomElement === 'string') {
    child = createFragment(CustomElement);
  } else {
    child = new CustomElement();
  }

  root.appendChild(child);
}

function renderPreview(_ref) {
  var reduxStore = _ref.reduxStore,
      storyStore = _ref.storyStore;
  var forceRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var state = reduxStore.getState();
  if (state.error) {
    return renderException(state.error);
  }

  try {
    return renderMain(state, storyStore, forceRender);
  } catch (ex) {
    return renderException(ex);
  }
}