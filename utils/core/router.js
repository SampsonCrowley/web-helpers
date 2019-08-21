export default class Router {
  static _isMounted = false
  static _changeListeners = []

  static mount() {
    if(!this._isMounted) {
      this._isMounted = true
      document.body.addEventListener('click', this._onClick)

      window.addEventListener('popstate', this._broadcast);
    }
  }

  static unmount() {
    if(this._isMounted) {
      this._isMounted = false
      document.body.removeEventListener('click', this._onClick)

      window.removeEventListener('popstate', this._broadcast);
    }
  }

  static register(cb) {
    this._changeListeners.push(cb)
    this.mount()
    cb(this._response())
  }

  static unregister(cb) {
    let idx
    while((idx = this._changeListeners.indexOf(cb)) !== -1) {
      this._changeListeners.splice(idx, 1)
    }

    if(!this._changeListeners.length) this.unmount()
  }

  static get basePath() {
    return ((document.querySelector('base') || {}).href || '').replace(this.origin, '').replace(/^\//, '')
  }

  static get location() {
    return window.location
  }

  static get origin() {
    return window.location.origin || window.location.protocol + '//' + window.location.host
  }

  static _response(event = {}) {
    return { location: this.location, basePath: this.basePath || '', event }
  }

  static _onClick = event => {
    let noOp = event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey

    if(noOp) return;

    const anchor = event.composedPath().filter(n => n.tagName === 'A')[0];

    noOp = !anchor
      || anchor.target
      || anchor.hasAttribute('download')
      || anchor.getAttribute('rel') === 'external'

    if(noOp) return;

    const href = anchor.href;

    if(!href || /^((?!http)[A-Za-z]+):/.test(href)) return;

    const location = this.location,
          origin   = this.origin

    if(href.indexOf(origin) !== 0) return;

    event.preventDefault();

    if (href !== location.href) {
      window.history.pushState({}, '', href);
      this._broadcast(event)
    }
  }


  static _broadcast = event => {
    const response = this._response(event)
    for(let i = 0; i < this._changeListeners.length; i++) {
      this._changeListeners[i](response)
    }
  }
}
