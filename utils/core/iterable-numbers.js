if(!Number.prototype[Symbol.iterator]) {
  Number.prototype[Symbol.iterator] = function* () {
    for( let i = 0; i < this; i++) {
      yield i;
    }
  }
}
