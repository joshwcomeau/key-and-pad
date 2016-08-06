export default function wrapReducer(reducer) {
  return (state = {}, action) => {
    switch(action.type) {
      // When our special action is dispatched, we want to re-initialize
      // the state, so that our casette can be played from a blank state.
      case '@@REWIND':
        return reducer({}, {});

      default:
        // Otherwise, delegate to the original reducer.
        return reducer(state, action);
    }
  };
}
