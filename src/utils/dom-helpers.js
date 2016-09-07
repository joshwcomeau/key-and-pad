/** getElementTranslate
  Return the current transform: translate applied to the element.

  @param {DOMNode} elem
  @returns [number, number]
*/
export const getElementTranslate = elem => {
  const transform = window.getComputedStyle(elem).transform;

  if (transform === 'none') {
    return [0, 0];
  }

  // TODO: support items with 3D transforms applied.

  return transform
    .match(/[\d\.]+/g)  // extract numbers
    .map(i => +i)       // convert "1" to an actual number 1
    .slice(4);          // return the last 2 items of the 6-item array.
};


/** fadeElementAway
  Removes an element from the DOM by first fading it out.

  @param {string} selector
  @param {number} duration
  @returns a Promise that resolves once the fade is completed
*/
export const fadeElementAway = ({ selector, duration }) => {
  return new Promise((resolve, reject) => {
    const elem = document.querySelector(selector);

    if (!elem) {
      reject(`Element not found with selector '${selector}'`);
    }

    elem.style.transition = `opacity ${duration}ms`;
    elem.style.opacity = 0;

    function removeAndResolve() {
      elem.parentNode.removeChild(elem);
      resolve();
    }

    // Remove it from the DOM so that it's not in the way.
    window.setTimeout(() => {
      // It isn't super important that we do this ASAP, generally.
      // If the browser allows us to queue it until it's idle, take advantage
      if (window.requestIdleCallback) {
        window.requestIdleCallback(removeAndResolve);
      } else {
        removeAndResolve();
      }
    }, duration);
  });
};
