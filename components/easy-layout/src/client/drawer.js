import { LitElement, html, css } from 'lit-element'
import TinyGesture from 'tinygesture'
// import 'hammerjs'
import { debounce } from '@web-helpers/core'

export class ClientDrawer extends LitElement {
  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflect: true
      },
      persistent: {
        type: Boolean,
        reflect: true
      },
      transitionDuration: {
        type: Number,
        value: 200
      },
      /**
       * The computed, read-only position of the drawer on the screen ('left' or
       * 'right').
       */
      position: {
        type: String,
        readOnly: true,
        reflect: true
      },
      /**
       * Disables swiping on the drawer.
       */
      disableSwipe: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`
        :host {
          position: fixed;
          top: -120px;
          right: 0;
          bottom: -120px;
          left: 0;

          visibility: hidden;

          transition-property: visibility;

          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        :host([opened]) {
          visibility: visible;
        }

        :host([persistent]) {
          width: 256px;
        }

        :host([persistent][position=left]) {
          right: auto;
        }

        :host([persistent][position=right]) {
          left: auto;
        }

        #content-container {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;

          width: 256px;
          padding: var(--app-drawer-content-padding, 120px 0);

          transition-property: -webkit-transform;
          transition-property: transform;
          -webkit-transform: translate3d(-100%, 0, 0);
          transform: translate3d(-100%, 0, 0);
          -webkit-transition: .25s ease-in-out;
          -moz-transition: .25s ease-in-out;
          -o-transition: .25s ease-in-out;
          transition: .25s ease-in-out;

          background-color: #FFF;
        }

        #content-container[persistent] {
          width: 100%;
        }

        #content-container[position=right] {
          right: 0;
          left: auto;

          -webkit-transform: translate3d(100%, 0, 0);
          transform: translate3d(100%, 0, 0);
        }

        #content-container[swipe-open]::after {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 100%;

          visibility: visible;

          width: 20px;

          content: '';
        }

        #content-container[swipe-open][position=right]::after {
          right: 100%;
          left: auto;
        }

        #content-container[opened] {
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }

        #scrim {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;

          transition-property: opacity;
          -webkit-transform: translateZ(0);
          transform:  translateZ(0);
          -webkit-transition: .25s ease-in-out;
          -moz-transition: .25s ease-in-out;
          -o-transition: .25s ease-in-out;
          transition: .25s ease-in-out;

          opacity: 0;
          background: var(--app-drawer-scrim-background, rgba(0, 0, 0, 0.5));
        }

        #scrim.visible {
          opacity: 1;
        }

        :host([no-transition]) #content-container {
          transition-property: none;
        }
      `
    ]
  }

  render() {
    return html`
      <div id="scrim" @click="${this.close}"></div>

      <!-- HACK(keanulee): Bind attributes here (in addition to :host) for styling to workaround Safari
      bug. https://bugs.webkit.org/show_bug.cgi?id=170762 -->
      <div
        id="content-container"
        ?opened="${this.opened}"
        ?persistent="${this.persistent}"
        position="${this.position || ''}"
        swipe-open
      >
        <slot></slot>
      </div>
    `
  }

  get contentContainer() {
    try {
      this._contentContainer = this._contentContainer || this.shadowRoot.getElementById('content-container')
    } catch(err) {
      console.log(err)
      this._contentContainer = null
    }
    return this._contentContainer
  }

  get scrim() {
    try {
      this._scrim = this._scrim || this.shadowRoot.getElementById('scrim')
    } catch(err) {
      console.log(err)
      this._scrim = null
    }
    return this._scrim
  }

  get opened() {
    return this._opened || null
  }

  set opened(value) {
    const oldValue = this._opened

    this._opened = !!value

    this.requestUpdate('opened', oldValue)

    this.dispatchEvent(
      new CustomEvent(
        'opened-changed',
        {
          detail: { opened: this.opened, value: this.opened },
          bubbles: true,
          cancelable: false,
        }
      )
    );
  }

  /** @override */
  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('keydown', this._escKeydownHandler);

    this.dispatchEvent(
      new CustomEvent(
        'app-reset-layout',
        {
          detail: null,
          bubbles: true,
          cancelable: false,
        }
      )
    );
  }

  firstUpdated() {
    // Only listen for horizontal track so you can vertically scroll
    // inside the drawer.
    // this._hammer = new Hammer(this)
    // this._hammer.on('swipeleft swiperight', this._track)
    this._gesture = new TinyGesture(this, { mouseSupport: true })
    this._gesture.on('swiperight', this._trackRight)
    this._gesture.on('swipeleft', this._trackLeft)

  }

  updated(changed) {
    if(changed.has('opened') || changed.has('persistent')) this._openedPersistentChanged(this.opened, this.persistent)
  }

  /** @override */
  disconnectedCallback() {
    document.removeEventListener('keydown', this._escKeydownHandler);
    this._gesture.off('swiperight', this._trackRight)
    this._gesture.off('swipeleft', this._trackLeft)
    super.disconnectedCallback()
  }

  /**
   * Opens the drawer.
   */
  open() {
    this.opened = true;
  }

  /**
   * Closes the drawer.
   */
  close() {
    this.opened = false;
  }

  /**
   * Toggles the drawer open and close.
   */
  toggle() {
    this.opened = !this.opened;
  }

  /**
   * Gets the width of the drawer.
   *
   * @return {number} The width of the drawer in pixels.
   */
  getWidth() {
    console.log(this)
    return this._savedWidth || this.contentContainer.offsetWidth;
  }
  _escKeydownHandler = (event) => {
    var ESC_KEYCODE = 27;
    if (event.keyCode === ESC_KEYCODE) {
      // Prevent any side effects if app-drawer closes.
      event.preventDefault();
      this.close();
    }
  }

  _track = (type) => {
    if (this.persistent || this.disableSwipe) {
      return;
    }

    // Disable user selection on desktop.
    // event.preventDefault();

    switch (type) {
      case 'swipeleft':
        this.close()
        break;
      case 'swiperight':
        this.open()
        break;
    }
  }

  _trackRight = (ev) => {
    // ev.type = 'swiperight'
    this._track('swiperight')
  }
  _trackLeft = (ev) => {
    // ev.type = 'swipeleft'
    this._track('swipeleft')
  }
  /**
   * Resets the layout.
   *
   * @method resetLayout
   */
  resetLayout() {
    this.dispatchEvent(
      new CustomEvent(
        'app-reset-layout',
        {
          detail: null,
          bubbles: true,
          cancelable: false,
        }
      )
    );
  }

  _openedPersistentChanged(opened, persistent) {
    this._toggleClass('visible', opened && !persistent, this.scrim);
  }

  _toggleClass(name, bool, node) {
    node = node || this
    if (bool === undefined) {
      bool = !node.classList.contains(name)
    }
    if (bool) {
      node.classList.add(name);
    } else {
      node.classList.remove(name);
    }
  }

  /**
   * Fired when the state of the drawer has changed.
   *
   * @event opened-changed
   */

  /**
   * Fired when the layout of app-drawer has changed.
   *
   * @event app-reset-layout
   */

  /**
   * Fired when app-drawer has finished transitioning.
   *
   * @event app-drawer-transitioned
   */
}

window.customElements.define('easy-layout-client-app-drawer', ClientDrawer);
