import { html, css, LitElement } from 'lit-element'
import { ifDefined } from 'lit-html/directives/if-defined';
import {
  currencyFeedback,
  currencyFormat,
  currencyPattern,
  currencyRegex,
  emailFeedback,
  emailPattern,
  emailRegex,
  keyCodes,
  phoneChars,
  phoneFeedback,
  phoneFormat,
  phonePattern,
  phoneRegex,
  inputProperties,
} from './constants'

export * from './constants'

export class InputField extends LitElement {
  static get properties() {
    return inputProperties;
  }

  static get styles() {
    return [
      css`
        * {
         box-sizing: border-box;
        }

        :host {
          display: block;
          width: 100%;
        }

        label {
          display: inline-block;
          margin-bottom: .5rem;
        }

        input {
          display: block;
          width: 100%;
          height: calc(1.5em + .75rem + 2px);
          padding: .375rem .75rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #495057;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #ced4da;
          border-radius: .25rem;
          transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }

        input:required,
        input:invalid {
          border-color: #F22;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M505.403 406.394L295.389 58.102c-8.274-13.721-23.367-22.245-39.39-22.245s-31.116 8.524-39.391 22.246L6.595 406.394c-8.551 14.182-8.804 31.95-.661 46.37 8.145 14.42 23.491 23.378 40.051 23.378h420.028c16.56 0 31.907-8.958 40.052-23.379 8.143-14.421 7.89-32.189-.662-46.369zm-28.364 29.978a12.684 12.684 0 0 1-11.026 6.436H45.985a12.68 12.68 0 0 1-11.025-6.435 12.683 12.683 0 0 1 .181-12.765L245.156 75.316A12.732 12.732 0 0 1 256 69.192c4.41 0 8.565 2.347 10.843 6.124l210.013 348.292a12.677 12.677 0 0 1 .183 12.764z' fill='%23d80027'/%3E%3Cpath d='M256.154 173.005c-12.68 0-22.576 6.804-22.576 18.866 0 36.802 4.329 89.686 4.329 126.489.001 9.587 8.352 13.607 18.248 13.607 7.422 0 17.937-4.02 17.937-13.607 0-36.802 4.329-89.686 4.329-126.489 0-12.061-10.205-18.866-22.267-18.866zM256.465 353.306c-13.607 0-23.814 10.824-23.814 23.814 0 12.68 10.206 23.814 23.814 23.814 12.68 0 23.505-11.134 23.505-23.814 0-12.99-10.826-23.814-23.505-23.814z' fill='%23d80027'/%3E%3C/svg%3E")
        }

        input:required:valid {
          border-color: #28a745;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
        }

        input:valid,
        input:invalid {
          background-repeat: no-repeat;
          background-size: 0.75rem 0.75rem;
          background-position: top 0.25rem right 0.25rem;
          padding-right: 0.4rem;
        }

        input ~ small {
          display: none;
          margin-top: .5rem;
        }

        input:focus ~ small {
          display: block
        }
      `
    ]
  }

  static _attributeNameForProperty(property) {
    return property.replace(/([A-Z]+)/g, '-$1').toLowerCase();
  }

  get el() {
    return this._el || (this._el = this.shadowRoot.querySelector('input')) || {}
  }

  get isActive() {
    return this.shadowRoot
      && (document.activeElement === this)
      && (this.shadowRoot.activeElement === this.el)
  }

  get value() {
    return this._value || ''
  }

  set value(value) {
    const previousValue = this._value

    this._value = String(value || '')

    if(this._value !== previousValue) {
      this.el.value = this.value
      const active = !!this.isActive

      this.dispatchEvent(
        new CustomEvent(
          active ? 'input' : 'change',
          {
            detail: { element: this, previousValue, value: this.value, active },
            bubbles: true,
            cancelable: false,
          }
        )
      );

      this.requestUpdate('value', previousValue)

      if(active) this.onActiveChange()
      else this.onPassiveChange()

      this._caretPosition = 0

      this.validateInput()
    }
  }

  get lastKey() {
    const k = String(this._lastKey || '').toLowerCase()
    delete this._lastKey
    return k
  }

  get transformInput() {
    return this._transformInput
  }

  set transformInput(value) {
    if(typeof value === 'function') {
      this._transformInput = value
      this.onPassiveChange()
    }
  }

  get validateWith() {
    return this.validator
    || this.builtInValidator
    || (_ => '')
  }

  get patternWith() {
    return this.pattern
    || this.builtInPattern
    || undefined
  }

  get feedbackWith() {
    return this.feedback
    || this.builtInFeedback
    || undefined
  }

  get formatKeys() {
    return [
      'currencyFormat',
      'emailFormat',
      'phoneFormat',
      'phoneFormatOnBlur',
    ]
  }

  constructor() {
    super()

    this.id = `input-id-${+(new Date())}`
    this.type= 'text'
    this.value = ''
  }

  connectedCallback() {
    super.connectedCallback()
    this._attached = true
  }

  firstUpdated(changedProperties) {
    this.onPassiveChange()
    this.el.value = this.value
    this.validateInput()
  }

  disconnectedCallback() {
    this._attached = false
    super.disconnectedCallback()
  }

  updated(changed) {
    if(this.formatKeys.some(key => changed.has(key))) {
      if(this.formatKeys.some(k => this[k])) {
        const [ regex, pattern, feedback ] =
                this.emailFormat
                  ? [ emailRegex, emailPattern, emailFeedback ]
                  : (this.phoneFormat || this.phoneFormatOnBlur)
                    ? [ phoneRegex, phonePattern, phoneFeedback ]
                    : [ currencyRegex, currencyPattern, currencyFeedback ],
              badMessage =
                this.currencyFormat
                  ? 'Invalid Amount'
                  : `Invalid ${this.emailFormat ? 'Email' : 'Phone'} Format`

        this.builtInValidator =
          value =>
            (this.allowedBlank(value) || regex.test(value))
              ? ''
              : badMessage

        this.builtInPattern = pattern || ''

        this.builtInFeedback = feedback || ''

        if(this.isActive) this.onActiveChange()
        else this.onPassiveChange()
      } else {
        this.builtInValidator = null
      }
      this.requestUpdate()
    }
  }

  render() {
    return html`
      ${
        this.skipExtras
          ? ''
          : html`<label for="${ifDefined(this.id)}">${this.label}</label>`
      }
      <input
        id="${this.id}"
        name="${ifDefined(this.name)}"
        type="${this.type || 'text'}"
        placeholder="${ifDefined(this.placeholder || undefined)}"
        pattern="${ifDefined(this.patternWith)}"
        ?required="${this.required}"
        value="${ifDefined(this.value || undefined)}"
        .value="${this.value}"
        @change=${this.onChange}
        @input=${this.onInput}
        @keydown=${this.onKeyDown}
        @blur=${this.onChange}
      />
      ${
        this.skipExtras
          ? ''
          : html`<small>${this.feedbackWith}</small>`
      }
    `
  }

  allowedBlank(value) {
    return !!(!this.required && (String(value || '') === ''))
  }

  validateInput = () => {
    try {
      this._attached && this.el.setCustomValidity(this.validateWith(this.value))
    } catch (err) {
      console.error(err)
    }
  }

  onChange = (ev) => {
    const value = this.value
    this.onInput(ev)
    if(this.value === value) this.onPassiveChange()
  }

  onKeyDown = (ev) => {
    this._lastKey = ev.key || keyCodes["which" in ev ? ev.which : ev.keyCode]
  }

  onInput = (ev) => {
    this.setSelection(() => {
      this._caretPosition = Number(this.el.selectionEnd) || 0
    })

    const lastKey = this.lastKey || ''

    let value = String(ev.currentTarget.value || '')

    if(this.preTransform) {
      const result = this.preTransform.call(this, value, lastKey, this._caretPosition)
      if(typeof result === "object") {
        value = result.value
        if(result.caretPosition) this._caretPosition = result.caretPosition
      } else value = String(result || '')
    } else {
      let char
      if(
        this.phoneFormat
        &&  (value.length >= this._caretPosition)
        &&  (
              (
                phoneChars.test(char = this.value.slice(this._caretPosition, this._caretPosition + 1))
                &&  new RegExp(`^[^${char}]`).test(value.slice(this._caretPosition, this._caretPosition + 1))
              )
              || (
                /^\+[^6]/.test(value)
                && /^back/.test(lastKey)
                &&  /[a-z]/.test(value.slice(this._caretPosition - 1, this._caretPosition))
              )
            )
      ) {
        const slice = (add = 0) => {
          value = value.slice(0, this._caretPosition - 1 + add) + value.slice(this._caretPosition + add)
          this._caretPosition = this._caretPosition - 1 + add
        }
        if(/^del/.test(lastKey)) {
          while(phoneChars.test(value.slice(this._caretPosition, this._caretPosition + 1))) slice(1)
          slice(1)
        } else if(/^back/.test(lastKey)) {
          while(phoneChars.test(value.slice(this._caretPosition - 1, this._caretPosition))) slice()
          if(!/^\+[^6]/.test(value)) slice()
        }
      }
    }
    this.value = value
  }

  /**
   * format emails and money on blur since selectionRange is not applicable
   * @type {Function}
   * @param {event} ev - synthetic change event
   */
  onPassiveChange = () => {
    const value = String(this.value || '')
    if(this.transformInput) {
      this.value = this.transformInput.call(this, value, "blur")
    } else if(this.emailFormat) {
      this.value = value.toLowerCase()
    } else if(this.currencyFormat) {
      this.value = this.allowedBlank(value) ? value : currencyFormat(value || '0')
    } else if (this.phoneFormatOnBlur || this.phoneFormat) {
      this.value = phoneFormat(this.value, this)
    }
  }

  /**
   * Set Caret Position where applicable, format phone numbers
   * @type {Function}
   * @param {event} ev - synthetic change event
   */
  onActiveChange = () => {
    const raw = this.value
    let formatted = raw
    if(this.transformInput) formatted = this.transformInput.call(this, raw, "input")
    else if(this.phoneFormat) formatted = phoneFormat.call(this, raw)

    let j = 0, ogPos = this._caretPosition, caretPosition = this._caretPosition

    if(raw && (raw !== formatted)) {
      const r = raw.toUpperCase(),
            f = String(formatted || '').toUpperCase(),
            l = Math.max(f.length, r.length)

      for(let i = 0; i < ogPos; i++) {
        const jWas = j
        while(r[i] !== f[j] && j < l) j++

        if(r[i] === f[j]) {
          caretPosition = caretPosition + j - jWas
          j++
        } else {
          console.log(r[i] + " Not Found", caretPosition)
          caretPosition = caretPosition - 1
          j = jWas
        }
      }

      this._caretPosition = caretPosition

      this.value = formatted
    }

    while(this.phoneFormat && /(\-|\s)$/.test(formatted.slice(0, caretPosition))) caretPosition = caretPosition - 1

    this.setSelection(() => {
      this.el.selectionStart = this.el.selectionEnd = caretPosition
    })
  }

  setSelection(func) {
    if(/date|email/.test(String(this.el.type || ''))) return;

    try {
      const ogType = this.el.type || 'text',
            needsChange = !(/text|search|password|tel|url/.test(ogType))

      if(needsChange) this.el.type = 'text'
      func()
      if(needsChange) this.el.type = ogType
    } catch(err) {
      console.error(err)

      this.el.type = this.type || 'text'
    }
  }


}

window.customElements.define('input-field', InputField);
