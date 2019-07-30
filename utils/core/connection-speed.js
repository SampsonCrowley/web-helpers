let connectionSpeedStateChangeTimeout;

export default class ConnectionSpeed {
  static currentState = {
    downlink: 10,
    downlinkMax: 10,
    effectiveType: '4g',
    rtt: 100,
    type: 'unknown',
    ofline: navigator.onLine === false
  }

  static _hasChangeListener = false

  static _changeListeners = []
  static _statusChangeListeners = []

  static connection = null

  static mount = () => {
    if(!this._hasChangeListener) {
      this.connection = this.connection
        || navigator.connection
        || navigator.mozConnection
        || navigator.webkitConnection

      if(this.connection) {
        this._hasChangeListener = true

        window.addEventListener('online', this.updateStatus);
        window.addEventListener('offline', this.updateStatus);
        this.connection.addEventListener('change', this.updateConnection)

        this.updateConnection()
      }
    }
  }

  static unmount = () => {
    if(this._hasChangeListener) {
      this._hasChangeListener = false
      this._changeListeners.splice(0)
      this._statusChangeListeners.splice(0)
      window.removeEventListener('online', this.updateStatus);
      window.removeEventListener('offline', this.updateStatus);
      this.connection.removeEventListener('change', this.updateConnection)
    }
  }

  static register = (cb) => {
    if(cb) this._changeListeners.push(cb)
    this.mount()
  }

  static unregister = (cb) => {
    let idx
    while((idx = this._changeListeners.indexOf(cb)) !== -1) {
      this._changeListeners.splice(idx, 1)
    }
  }

  static registerStatus = (cb) => {
    if(cb) {
      this._statusChangeListeners.push(cb)
      cb(this.currentState.offline)
    }

    this.mount()
  }

  static unregisterStatus = (cb) => {
    let idx
    while((idx = this._statusChangeListeners.indexOf(cb)) !== -1) {
      this._statusChangeListeners.splice(idx, 1)
    }
  }

  static updateStatus = () => {
    const { offline } = this.currentState;

    this.currentState.offline = navigator.onLine === false

    if(offline !== this.currentState.offline) this.broadcastStatus()
  }

  static updateConnection = () => {
    if(connectionSpeedStateChangeTimeout) window.cancelAnimationFrame(connectionSpeedStateChangeTimeout);

    if(this.connection) {
      connectionSpeedStateChangeTimeout = window.requestAnimationFrame(() => {
        const offline = navigator.onLine === false,
              previousOffline = this.currentState.offline
        this.currentState = {
          type:          this.connection.type || 'unknown',
          effectiveType: this.connection.effectiveType || '4g',
          downlink:      +(this.connection.downlink || 10),
          downlinkMax:   +(this.connection.downlinkMax || this.connection.downlink || 10),
          rtt:           +(this.connection.rtt || 100),
          offline
        }

        this.broadcast()
        if(offline !== previousOffline) this.broadcastStatus()
      })
    }
  }

  static broadcast = () => {
    for(let i = 0; i < this._changeListeners.length; i++) {
      try {
        const cb = this._changeListeners[i]
        cb && cb(this.currentState)
      } catch(err) {
        console.error(err)
      }
    }
  }

  static broadcastStatus = () => {
    for(let i = 0; i < this._statusChangeListeners.length; i++) {
      try {
        const cb = this._statusChangeListeners[i]
        cb && cb(this.currentState.offline)
      } catch(err) {
        console.error(err)
      }
    }
  }
}
