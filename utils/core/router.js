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
    cb({ location: window.location })
  }

  static unregister(cb) {
    let idx
    while((idx = this._changeListeners.indexOf(cb)) !== -1) {
      this._changeListeners.splice(idx, 1)
    }

    if(!this._changeListeners.length) this.unmount()
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

    if(!href || href.indexOf('mailto:') !== -1) return;

    const location = window.location,
          origin   = location.origin || location.protocol + '//' + location.host

    if(href.indexOf(origin) !== 0) return;

    event.preventDefault();

    if (href !== location.href) {
      window.history.pushState({}, '', href);
      this._broadcast(event)
    }
  }

  static _broadcast = event => {
    const response = { location: window.location, event }
    for(let i = 0; i < this._changeListeners.length; i++) {
      this._changeListeners[i](response)
    }
  }
}
