import { html, css, LitElement } from 'lit-element';

export default class TestDemo extends LitElement {
  static get styles() {
    return css`
      :host {
        background: #2e2e2e;
        background: var(--header-bg-color, #2e2e2e);
        display: block;
        padding: 25px;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.title = '';
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <div>
        <slot></slot>
      </div>
    `;
  }
}

window.customElements.define('test-demo', TestDemo);
