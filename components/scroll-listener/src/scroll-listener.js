import { LitElement, html, css } from 'lit-element'

export class ScrollListener extends LitElement {
  static get properties() {
    return {
      scrollTarget: {
        attribute: false
        // type: HTMLElement,
        // value: function() {
        //   return this._defaultScrollTarget;
        // }
      },
      hasListener: {
        type: Boolean
      },
      _attached: {
        type: Boolean,
        attribute: false
      }
    }
  }

  get hasListener() {
    return !!this._hasListener
  }

  set hasListener(value) {
    const valueWas = this.hasListener
    this._hasListener = !!value
    this.requestUpdate('hasListener', valueWas)
    if(this._isValidScrollTarget()) this._toggleScrollListener(this._hasListener, this.scrollTarget);
  }

  get domHost() {
    try {
      return this.getRootNode().host
    } catch(err) {
      console.log(err)
      return null
    }
  }

  /**
   * The default scroll target. Consumers of this behavior may want to customize
   * the default scroll target.
   *
   * @type {Element}
   */
  get _defaultScrollTarget() {
    return this._doc;
  }

  /**
   * Shortcut for the document element
   *
   * @type {Element}
   */
  get _doc() {
    return this.ownerDocument.documentElement;
  }

  get _docIsTarget(){
    return this.scrollTarget === this._doc
  }

  /**
   * Gets the number of pixels that the content of an element is scrolled
   * upward.
   *
   * @type {number}
   */
  get _scrollTop() {
    if(this._isValidScrollTarget()) {
      return this._docIsTarget
        ? window.pageYOffset
        : this.scrollTarget.scrollTop;
    }
    return 0;
  }

  /**
   * Gets the number of pixels that the content of an element is scrolled to the
   * left.
   *
   * @type {number}
   */
  get _scrollLeft() {
    if(this._isValidScrollTarget()) {
      return this._docIsTarget
        ? window.pageXOffset
        : this.scrollTarget.scrollLeft;
    }
    return 0;
  }

  /**
   * Gets the width of the scroll target.
   *
   * @type {number}
   */
  get _scrollTargetWidth() {
    if(this._isValidScrollTarget()) {
      return this._docIsTarget
        ? window.innerWidth
        : this.scrollTarget.offsetWidth;
    }
    return 0;
  }

  /**
   * Gets the height of the scroll target.
   *
   * @type {number}
   */
  get _scrollTargetHeight() {
    if(this._isValidScrollTarget()) {
      return this._docIsTarget
        ? window.innerHeight
        : this.scrollTarget.offsetHeight;
    }
    return 0;
  }

  /**
   * Sets the number of pixels that the content of an element is scrolled
   * upward.
   *
   * @type {number}
   */
  set _scrollTop(top) {
    if(this._docIsTarget) {
      window.scrollTo(window.pageXOffset, top);
    } else if(this._isValidScrollTarget()) {
      this.scrollTarget.scrollTop = top;
    }
  }

  /**
   * Sets the number of pixels that the content of an element is scrolled to the
   * left.
   *
   * @type {number}
   */
  set _scrollLeft(left) {
    if(this._docIsTarget) {
      window.scrollTo(left, window.pageYOffset);
    } else if(this._isValidScrollTarget()) {
      this.scrollTarget.scrollLeft = left;
    }
  }

  render() {
    return html`<slot id="slot"></slot>`
  }

  constructor(){
    super()
    this.hasListener = true
    this._attached = false
  }

  connectedCallback() {
    super.connectedCallback()
    this._attached = true
    if(!this._isValidScrollTarget()) this.scrollTarget = this._defaultScrollTarget
    this._scrollTopWas = this.scrollTop
    this._scrollLeftWas = this.scrollLeft
    this._lastTimestamp = 0
  }

  firstUpdated() {
    this._scrollTopWas = this.scrollTop
    this._scrollLeftWas = this.scrollLeft
    this._lastTimestamp = 0
  }

  disconnectedCallback() {
    this._attached = false
    super.disconnectedCallback()
  }

  updated(changed) {
    if(changed.has('scrollTarget') || changed.has('_attached')) this._scrollTargetChanged(changed)
  }

  _scrollTargetChanged(changed) {
    let targetWas = changed.get('scrollTarget');

    if(targetWas && this._isValidScrollTarget(targetWas)) this._toggleScrollListener(false, targetWas);

    if(!this._attached) {
      return;
    }
    // Support element id references
    if(this.scrollTarget === 'document') {
      this.scrollTarget = this._doc;

    } else if(typeof scrollTarget === 'string') {
      let domHost = this.domHost;

      this.scrollTarget = (domHost || this.ownerDocument).querySelector('#' + scrollTarget);
    } else if(this._isValidScrollTarget()) {
      this._toggleScrollListener(this.hasListener, this.scrollTarget);
    } else {
      this.scrollTarget = this._defaultScrollTarget
    }
  }

  _scrollHandler = () => {
    this._dispatchChange()
  }

  _dispatchChange = () => {
    const now = performance.now(),
          y = this._scrollTopWas > this._scrollTop
            ? 'up'
            : this._scrollTopWas < this._scrollTop ? 'down' : null,
          yDistance = y
            ? this._scrollTop - this._scrollTopWas
            : 0,
          yVelocity = yDistance / (now - this._lastTimestamp),
          x = this._scrollLeftWas > this._scrollLeft
            ? 'left'
            : this._scrollLeftWas < this._scrollLeft ? 'right' : null,
          xDistance = x
            ? this._scrollLeft - this._scrollLeftWas
            : 0,
          xVelocity = xDistance / (now - this._lastTimestamp)

    this._lastTimestamp = now
    this._scrollTopWas = this._scrollTop
    this._scrollLeftWas = this._scrollLeft

    if(y || x) {
      const detail = { y, yDistance, yVelocity, x, xDistance, xVelocity }
      if(this._onScroll) this._onScroll({detail})
      else this.dispatchEvent(
        new CustomEvent(
          'element-scrolled',
          {
            detail,
            bubbles: true,
            cancelable: true,
          }
        )
      )
    }

  }

  /**
   * Scrolls the content to a particular place.
   *
   * @method scroll
   * @param {number|!{left: number, top: number}} leftOrOptions The left position or scroll options
   * @param {number=} top The top position
   * @return {void}
   */
  scroll(leftOrOptions, top) {
    var left;

    if(typeof leftOrOptions === 'object') {
      left = leftOrOptions.left;
      top = leftOrOptions.top;
    } else {
      left = leftOrOptions;
    }

    left = left || 0;
    top = top || 0;
    if(this._docIsTarget) {
      window.scrollTo(left, top);
    } else if(this._isValidScrollTarget()) {
      this.scrollTarget.scrollLeft = left;
      this.scrollTarget.scrollTop = top;
    }
  }

  /**
   * Returns true if the scroll target is a valid HTMLElement.
   *
   * @return {boolean}
   */
  _isValidScrollTarget(target) {
    return (target || this.scrollTarget) instanceof HTMLElement;
  }

  _toggleScrollListener(shouldHaveListener, scrollTarget) {
    const eventTarget = scrollTarget === this._doc ? window : scrollTarget

    eventTarget.removeEventListener('scroll', this._scrollHandler);

    if(shouldHaveListener) {
      eventTarget.addEventListener('scroll', this._scrollHandler);
    }
  }
}

window.customElements.define('scroll-listener', ScrollListener);
