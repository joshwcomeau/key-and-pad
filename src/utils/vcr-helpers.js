// TODO: Move me into a VCR helpers file.
export const getValues = obj => Object.keys(obj).map(key => obj[key]);

export const getCurrentTime = () => {
  // If performance.now is available, use that.
  if (window.performance && typeof window.performance.now === 'function') {
    return performance.now();
  }

  // TODO: Polyfill, or fallback to Date.now?
  return null;
};
