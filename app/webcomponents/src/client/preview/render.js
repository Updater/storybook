function createFragment(DOMText) {
  return document.createRange().createContextualFragment(DOMText);
}

function emptyRoot(root) {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
}

export function renderError(error) {
  const errorFragment = createFragment(`
    <div>
      ${error.message}
    </div>
  `);

  const errorRoot = document.querySelector('#error-display');
  emptyRoot(errorRoot);
  errorRoot.appendChild(errorFragment);
}

export function renderException(error) {
  renderError(error);
}

function scopeScripts(storyString) {
  let escapedScripts = storyString.replace(new RegExp('<script>'), '<script>{');
  escapedScripts = escapedScripts.replace(new RegExp('</script>'), '}</script>');
  return escapedScripts;
}

function renderStoryString(story) {
  const storyString = scopeScripts(story);

  const root = document.querySelector('#root');
  emptyRoot(root);

  const child = createFragment(storyString);
  root.appendChild(child);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return;

  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStory(selectedKind, selectedStory);

  const context = {
    kind: selectedKind,
    story: selectedStory,
  };

  const storyString = story ? story(context) : '<p>There is no preview for this story</p>';

  if (storyString.then) {
    storyString.then(renderStoryString);
  } else {
    renderStoryString(storyString);
  }
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
