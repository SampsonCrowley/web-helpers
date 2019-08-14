import { LitElement, html } from 'lit-element';
import { CalendarStyles, SharedStyles } from '@web-helpers/styles';
import { DateSerializer, registerElement } from '@web-helpers/core'
import {
  addDays as dateFnsAddDays,
  format as dateFnsFormat,
  isSameDay as dateFnsIsSameDay,
  isSameMonth as dateFnsIsSameMonth,
} from 'date-fns'

export class CalendarElementBody extends LitElement {
  static get properties() {
    return {
      startDate: { attribute: false },
      endDate: { attribute: false },
      currentMonth: { attribute: false },
      selectedDate: { attribute: false },
      dayFormat: { attribute: false },
      _rows: { attribute: false }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      CalendarStyles
    ];
  }

  render() {
    return html`
      <ul class="day-grid">
        ${this.rows}
      </ul>
    `
  }

  get rows() {
    return this._rows || []
  }

  updated(changed) {
    if(!changed.has('_rows')) this._buildRows()
  }

  _onDateClick = (ev) => {
    const date = new Date(+ev.currentTarget.dataset.date)
    return this.dispatchEvent(
      new CustomEvent(
        'date-clicked',
        {
          detail: { date, value: dateFnsFormat(date, 'yyyy-MM-dd') },
          bubbles: true,
          cancelable: true,
          composed: true,
        }
      )
    )
  }

  _buildRows = () => {
    const rows = [];

    let day = this.startDate
    while (day <= this.endDate) {
      const fullDate  = dateFnsFormat(day, 'MMMM do, yyyy'),
            formatted = dateFnsFormat(day, this.dayFormat || 'd'),
            className = !dateFnsIsSameMonth(day, this.currentMonth)
              ? 'other-month'
              : (this.selectedDate && dateFnsIsSameDay(day, this.selectedDate))
                ? 'selected-date'
                : 'current-month'

      rows.push(
        html`
          <li
            class="${className} clickable"
            data-display="${formatted}"
            data-date="${+day}"
            @click="${this._onDateClick}"
          >
            <!-- <abbr title="${fullDate}">
              <svg width="100%" height="100%" viewBox="0 0 45 45">
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${formatted}</text>
              </svg>
            </abbr> -->
            <abbr title="${fullDate}">${formatted}</abbr>
          </li>
        `
      );
      day = dateFnsAddDays(day, 1)
    }

    this._rows = rows;

    return this._rows
  }

}

registerElement('calendar-element-body', CalendarElementBody);
