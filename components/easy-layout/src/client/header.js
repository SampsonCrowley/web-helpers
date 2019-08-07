import { LitElement, html, css } from 'lit-element'
import { ScrollListener } from '@web-helpers/scroll-listener'

export class ClientHeader extends ScrollListener {
  static get properties() {
    return {
      scrollTarget: {
        attribute: false
        // type: HTMLElement,
        // value: function() {
        //   return this._defaultScrollTarget;
        // }
      },
      shadow: {
        type: Boolean,
        reflect: true
      },
      hasListener: {
        type: Boolean
      },
      _attached: {
        type: Boolean,
        attribute: false
      },
      _translated: {
        type: Number,
        attribute: false
      },
      _transitionDuration: {
        type: Number,
        attribute: false
      },
    }
  }

  static get styles() {
    return [
      css`
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: var(--app-header-z-index, 100)
        }

        #outer-wrapper {

          position: relative;
          display: block;
          transition-property: -webkit-transform;
          transition-property: transform;
          -webkit-transition: 0 ease-in-out;
          -moz-transition: 0 ease-in-out;
          -o-transition: 0 ease-in-out;
          transition: 0 ease-in-out;
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
          will-change: transform;

          background-color: var(--app-header-background-color, #FFFFFF);
          color: var(--app-header-text-color, #000000);
          border-bottom: 1px solid #eee;
          text-align: center;
        }

        #outer-wrapper::before {
          position: absolute;
          right: 0px;
          bottom: -5px;
          left: 0px;
          width: 100%;
          height: 5px;
          content: "";
          transition: opacity 0.4s;
          pointer-events: none;
          opacity: 0;
          box-shadow: inset 0px 5px 6px -3px rgba(0, 0, 0, 0.4);
          will-change: opacity;
        }

        :host([shadow]) #outer-wrapper::before {
          opacity: 1;
        }

        #content-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        :host([disabled]) #outer-wrapper,
        :host([disabled]) #outer-wrapper::after,
        /* Silent scrolling should not run CSS transitions */
        :host([silent-scroll]) #outer-wrapper,
        :host([silent-scroll]) #outer-wrapper::after,
        :host([disabled]) ::slotted(app-toolbar:first-of-type),
        :host([disabled]) ::slotted([sticky]),
        /* Silent scrolling should not run CSS transitions */
        :host([silent-scroll]) ::slotted(app-toolbar:first-of-type),
        :host([silent-scroll]) ::slotted([sticky]) {
          transition: none !important;
        }
      `
    ]
  }

  get _style() {
    return this.__style || ''
  }

  set _style(val) {
    this.__style = `transform: translate3d(0px, -${this._translated || 0}%, 0px); transition-duration: ${this._transitionDuration || 0}ms`;
    return this._style
  }

  connectedCallback() {
    super.connectedCallback()
    this.scrollTarget = this.ownerDocument.documentElement
    this._translated = 0
    this.totalDistance = 0
  }

  // render() {
  //   return html`
  //     <div id="content-container">
  //       <scroll-listener
  //         .scrollTarget="${this.scrollTarget}"
  //         @element-scrolled=${this._onScroll}
  //       >
  //         <slot id="slot"></slot>
  //       </scroll-listener>
  //     </div>
  //   `
  // }

  render() {
    return html`
      <div id="outer-wrapper" style="${this._style}">
        <div id="content-container">
          <slot id="slot"></slot>
        </div>
      </div>
    `
  }

  _heightPercentage = v =>
    Number(v || 0) / this.getBoundingClientRect().height * 100

  _maxPercentage = v =>
    Math.min(Math.max(v, 0), 100)

  update(...args) {
    this._style = ''
    super.update(...args)
  }

  get _hasScrolled() {
    return this._docIsTarget
      ? window.scrollY
      : this.scrollTarget.scrollTop
  }

  _onScroll(ev) {
    const { y, yDistance, yVelocity } = ev.detail
    const moved = !!this.totalDistance,
          up    = y === 'up'

    this.totalDistance = this.totalDistance + Number(yDistance || 0)

    if(this.shadow && (!moved || !this.totalDistance)) this.shadow = false

    if(y && yDistance) {
      if(up && (this._translated === 0)) return;
      if(!up && (this._translated === 100)) return;

      if(this.totalDistance > this.offsetHeight) return this._setTranslation(up ? 0 : 300, true)

      this._setTranslation(this._maxPercentage(this._heightPercentage(this.totalDistance)), (this._translated === 0) && moved)
    }
  }

  _setTranslation(value, withAnimation) {
    if(withAnimation) {
      clearTimeout(this._shadowTimeout)
      this._transitionDuration = 300
      this.shadow = true
      this._translated = value
      this._shadowTimeout = setTimeout(() => {
        this._transitionDuration = 0
      }, 300)
    } else {
      this._translated = value
    }
  }
}

window.customElements.define('easy-layout-client-app-header', ClientHeader);
