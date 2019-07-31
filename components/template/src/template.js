import { html, css, LitElement } from 'lit-element';
import registerEl from '@web-helpers/core/register-element'

export class Template extends LitElement {
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

export const register = (tagName) => registerEl(tagName || 'template-helper', Template)

export default Template
