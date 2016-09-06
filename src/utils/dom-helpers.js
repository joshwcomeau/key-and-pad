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
  Return the current transform: translate applied to the element.

  @param {string} selector
  @param {number} duration
  @returns null
*/
export const fadeElementAway = ({ selector, duration }) => {
  const elem = document.querySelector(selector);

  elem.style.transition = `opacity ${duration}`;
  elem.style.opacity = 0;

  // Remove it from the DOM so that it's not in the way.
  window.setTimeout(() => {
    // It isn't super important that we do this ASAP, generally.
    // If the browser allows us to queue it until it's idle, take advantage
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => elem.parentNode.removeChild(elem));
    } else {
      elem.parentNode.removeChild(elem);
    }
  }, duration);
};
