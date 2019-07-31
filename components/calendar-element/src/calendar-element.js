import { LitElement, html } from 'lit-element';
import { CalendarStyles, SharedStyles } from '@web-helpers/styles'
import { DateSerializer, registerElement } from '@web-helpers/core'
import dateFns from 'date-fns'

import './calendar-body'
import './calendar-header'

const headerFormat = 'MMMM YYYY',
      labelFormat = "dddd",
      dayFormat = 'D'

export class CalendarElement extends LitElement {
  static get properties() {
    return {
      selectedDate: {
        attribute: 'selected-date',
        converter: DateSerializer,
        reflect: true,
      },
      headerFormat: { type: String },
      headerStyle: { type: String },
      labelFormat: { type: String },
      dayFormat: { type: String },
      _currentMonth: { attribute: false },
      _startDate: { attribute: false },
      _formattedMonth: { type: String },
      _startOfMonth: { attribute: false },
      _endOfMonth: { attribute: false },
      _bodyStartDate: { attribute: false },
      _bodyEndDate: { attribute: false },
    };
  }

  static get styles() {
    return [
      SharedStyles,
      CalendarStyles,
    ]
  }

  static _attributeNameForProperty(property) {
    return property.replace(/([A-Z]+)/g, '-$1').toLowerCase();
  }

  constructor() {
    super()

    this._currentMonth = new Date()

    this._buildStateForMonth()
  }

  render() {
    return html`
      <header style="${this.headerStyle || ''}">
        <div class="calendar-nav" data-function='previous-month' @click="${this._previousMonth}" >
          <i class="material-icons clickable">
            chevron_left
          </i>
        </div>

        <span>
          ${this._formattedMonth}
        </span>

        <div class="calendar-nav" data-function='previous-month' @click="${this._nextMonth}">
          <i class="material-icons clickable">
            chevron_right
          </i>
        </div>
      </header>

      <calendar-header labelFormat="${this.labelFormat}"></calendar-header>

      <calendar-body
        .startDate="${this._bodyStartDate}"
        .endDate="${this._bodyEndDate}"
        .currentMonth="${this._currentMonth}"
        .selectedDate="${this.selectedDate}"
        .dayFormat="${this.dayFormat}"
        @date-clicked=${this._onDateClick}
      ></calendar-body>
    `
  }

  get selectedDate() {
    return this._selectedDate || null
  }

  set selectedDate(value) {
    const oldValue = this._selectedDate

    this._selectedDate = value ? dateFns.parse(value) : null

    this.requestUpdate('selectedDate', oldValue)

    if(this.selectedDate && !dateFns.isSameMonth(this.selectedDate, this._startOfMonth)) {
      this._currentMonth = this.selectedDate
      this._buildStateForMonth()
    }

    this.dispatchEvent(
      new CustomEvent(
        'date-change',
        {
          detail: { date: this.selectedDate, value: this.selectedDate ? dateFns.format(this.selectedDate, 'YYYY-MM-DD') : null },
          bubbles: true,
          cancelable: false,
        }
      )
    );
  }

  get labelFormat() {
    return this._labelFormat || labelFormat
  }

  set labelFormat(value) {
    const oldValue = this._labelFormat

    this._labelFormat = String(value || '')

    this.requestUpdate('labelFormat', oldValue)
  }

  get dayFormat() {
    return this._dayFormat || dayFormat
  }

  set dayFormat(value) {
    const oldValue = this._dayFormat

    this._dayFormat = String(value || '')

    this.requestUpdate('dayFormat', oldValue)
  }

  _calcHeaderText(date, format) {
    return dateFns.format(date, format || headerFormat)
  }

  _calcWeekStart(date) {
    return dateFns.startOfWeek(date)
  }

  _calcWeekEnd(date) {
    return dateFns.endOfWeek(date)
  }

  _calcMonthStart(date) {
    return dateFns.startOfMonth(date)
  }

  _calcMonthEnd(date) {
    return dateFns.endOfMonth(date)
  }

  _buildStateForMonth = () => {
    this._startOfMonth   = this._calcMonthStart(this._currentMonth),
    this._endOfMonth     = this._calcMonthEnd(this._startOfMonth),
    this._startDate      = this._calcWeekStart(this._currentMonth),
    this._bodyStartDate  = this._calcWeekStart(this._startOfMonth),
    this._bodyEndDate    = this._calcWeekEnd(this._endOfMonth),
    this._formattedMonth = this._calcHeaderText(this._currentMonth, this.headerFormat)
  }

  _changeMonth = (count = 1) => {
    this._currentMonth = dateFns.addMonths(this._currentMonth, count)

    this._buildStateForMonth()
  }

  _nextMonth = () => this._changeMonth(1)

  _previousMonth = () => this._changeMonth(-1)

  _onDateClick = (ev) => {
    ev.stopPropagation()
    this.selectedDate = (ev.detail || {}).date || new Date
  }
}

export const register = (tagName) => registerElement(tagName || 'calendar-element', CalendarElement)

export default CalendarElement
