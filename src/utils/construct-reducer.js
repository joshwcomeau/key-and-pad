const noop = function noop() {};

export default function constructReducer(initialState, caseCreator = noop) {
  // Because this function creates a reducer, it needs to return a reducer.
  return (state = initialState, action) => {
    // caseCreator is a function that returns an object, representing all
    // of our former cases in the switch statement. It's a function so that
    // the cases have access to the state and the action.
    const cases = caseCreator(state, action);

    // The expressions for each case will have been resolved to static values.
    // we can simply select the one that matches our action's type.
    const newState = cases[action.type];

    // We still need to cover our former 'default' case.
    // Simply return the original state if newState is undefined.
    return typeof newState !== 'undefined' ? newState : state;
  };
}
