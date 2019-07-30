let _defaultTitle = window.defaultTitle || '',
    _defaultDescription = window.defaultDescription || ''

export default class Metadata {
  static currentState = {
    title:         _defaultTitle,
    description:   _defaultDescription,
    'og:url':      window.location.href,
    'og:image':    '',
    'og:imageAlt': ''
  }

  static _changeListeners = []

  static register(cb) {
    this._changeListeners.push(cb)
    this.mount()
    cb(this.current)
  }

  static unregister(cb) {
    let idx
    while((idx = this._changeListeners.indexOf(cb)) !== -1) {
      this._changeListeners.splice(idx, 1)
    }

    if(!this._changeListeners.length) this.unmount()
  }

  static update({ title, description, url, image, imageAlt, setDefault, setDefaultTitle, setDefaultDescription }) {
    let updated = false
    if(setDefault || setDefaultTitle) title = _defaultTitle = String(title || '')
    if(setDefault || setDefaultDescription) description = _defaultDescription = String(description || '')

    if(title !== undefined) {
      updated = true
      title = title || _defaultTitle

      this.currentState.title = document.title = title;
      this.setMetaTag('property', 'og:title', title);
    }

    if(description !== undefined) {
      updated = true
      description = description || ''

      this.setMetaTag('name', 'description', description, true);
      this.setMetaTag('property', 'og:description', description, true);
    }

    if(image !== undefined) {
      updated = true
      image = image || ''

      this.setMetaTag('property', 'og:image', image, true);
    }

    if(imageAlt !== undefined) {
      updated = true
      imageAlt = imageAlt || ''

      this.setMetaTag('property', 'og:image:alt', imageAlt, true);
    }

    if(url !== undefined) {
      updated = true
      url = url || window.location.href;

      this.setMetaTag('property', 'og:url', url, true);
    }

    if(updated) this._broadcast()
  }

  static setMetaTag(attrName, attrValue, content, noBroadcast) {

    if(this.currentState[attrValue] !== undefined) {
      content = content || ''

      noBroadcast = noBroadcast || this.currentState[attrValue] === content

      this.currentState[attrValue] = content
    } else {
      noBroadcast = true
    }

    let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content || '');

    if(!noBroadcast) this._broadcast()
  }

  static _broadcast() {
    for(let i = 0; i < this._changeListeners.length; i++) {
      this._changeListeners[i](this.currentState)
    }
  }
}
