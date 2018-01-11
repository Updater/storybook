const template = `
  <style>
    .error {
      background-color: #ff4747;
      font-size: 24px;
    }
  </style>
  <div class="error">
    <slot></slot>
  </div>
`;

const tpl = document.createElement('template');
tpl.appendChild(document.createRange().createContextualFragment(template));

class Error extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).appendChild(tpl.content.cloneNode(true));
  }
}

customElements.define('storybook-error', Error);
