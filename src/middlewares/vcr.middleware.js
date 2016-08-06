import uuid from 'node-uuid';

const vcrMiddleware = persistor => {
  persistor.initialize();

  return store => {
    const startTime = getCurrentTime();
    const casette = {
      // TODO: Allow for custom ID?
      id: uuid.v4(),
      actions: [],
    };

    return next => action => {
      casette.actions.push({
        ...action,
        time: getCurrentTime() - startTime,
      });

      persistor.persist(casette);

      return next(action);
    };
  };
};

export default vcrMiddleware


function getCurrentTime() {
  // If performance.now is available, use that.
  if (window.performance && typeof window.performance.now === 'function') {
    return performance.now();
  }

  // TODO: Polyfill, or fallback to Date.now?
}
