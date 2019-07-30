export default class MediaQuery {
  static watchers = {}

  static register(query, cb) {
    this.watchers[query] = this.watchers[query] || {
      mql: window.matchMedia(query),
      callbacks: [],
    };

    const { mql } = this.watchers[query]

    this.watchers[query].callbacks.push(cb)
    mql.addListener(cb);
    cb(mql);
  }

  static unregister(query, cb) {
    const watcher = this.watchers[query]

    if(watcher) {
      let idx
      while((idx = watcher.callbacks.indexOf(cb)) !== -1) {
        watcher.mql.removeListener(watcher.callbacks[idx])
        watcher.callbacks.splice(idx, 1)
      }

      if(!watcher.callbacks.length) delete this.watchers[query]
    }
  }
}
