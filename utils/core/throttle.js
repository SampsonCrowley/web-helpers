export function debounce(func, delay = 300){
  let timeout;
  return function() {
    if(timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, arguments), delay)
  }
}

export function throttle(func, interval = 300, shouldDebounce = false) {
  let lastCall = 0,
      debounced = shouldDebounce && debounce(func, interval);

  return function () {
    let now = (new Date()).getTime();
    if(now - lastCall < interval)
      return debounced && debounced.apply(this, arguments);

    lastCall = now;
    return func.apply(this, arguments)
  }
}
