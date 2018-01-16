const definedElements = new Map();

function createFragment(DOMText) {
  return document.createRange().createContextualFragment(DOMText);
}

export function renderError(error) {
  const errorFragment = createFragment(`
    <div>
      ${error.message}
    </div>
  `);
  document.querySelector('#error-display').appendChild(errorFragment);
}

export function renderException(error) {
  renderError(error);
}

let previousStory;
let previousKind;

function emptyRoot(root) {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
}

export function renderMain(data, storyStore, forceRender) {
  if (storyStore.size() === 0) return;

  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStory(selectedKind, selectedStory);

  // https://github.com/storybooks/react-storybook/issues/116
  if (forceRender || selectedKind !== previousKind || previousStory !== selectedStory) {
    previousStory = selectedStory;
    previousKind = selectedKind;
  } else {
    return;
  }

  const context = {
    kind: selectedKind,
    story: selectedStory,
  };

  const CustomElement = story ? story(context) : '<p>There is no preview for this story</p>';

  const root = document.querySelector('#root');
  emptyRoot(root);
  let child;

  if (typeof CustomElement === 'string') {
    child = createFragment(CustomElement);
  } else {
    const name = `storybook-${CustomElement.name.toLowerCase()}`;
    if(!definedElements.has(name)) {
      definedElements.set(name, CustomElement);
      customElements.define(name, CustomElement);
    }

    const DefinedConstructor = definedElements.get(name);
    child = new DefinedConstructor();
 }

  root.appendChild(child);
}

export default function renderPreview({ reduxStore, storyStore }, forceRender = false) {
  const state = reduxStore.getState();
  if (state.error) {
    return renderException(state.error);
  }

  try {
    return renderMain(state, storyStore, forceRender);
  } catch (ex) {
    return renderException(ex);
  }
}
