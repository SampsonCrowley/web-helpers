import { LitElement, html } from 'lit-element';
import { registerElement } from '@web-helpers/core'
import { CalendarStyles } from '@web-helpers/styles';

export class CalendarElementHeader extends LitElement {
  static get properties() {
    return {
      dateFormat: { type: String },
    };
  }

  static get styles() {
    return [
      CalendarStyles
    ];
  }

  render() {
    return html`
      <ul class="weekdays">
        <li>
          <abbr title="S">Sunday</abbr>
        </li>
        <li>
          <abbr title="M">Monday</abbr>
        </li>
        <li>
          <abbr title="T">Tuesday</abbr>
        </li>
        <li>
          <abbr title="W">Wednesday</abbr>
        </li>
        <li>
          <abbr title="T">Thursday</abbr>
        </li>
        <li>
          <abbr title="F">Friday</abbr>
        </li>
        <li>
          <abbr title="S">Saturday</abbr>
        </li>
      </ul>
    `
  }

}

registerElement('calendar-element-header', CalendarElementHeader);
