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
