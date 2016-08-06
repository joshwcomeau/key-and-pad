import vcrDataHandler from '../utils/vcr-data-handler';
import {
  CASETTES_LIST_REQUEST,
  SELECT_CASETTE,
  PLAY,
  casetteActionsReceive,
  casettesListReceive
} from '../ducks/vcr-player.duck';


const vcrRetrieveMiddleware = store => next => action => {
  switch (action.type) {
    case CASETTES_LIST_REQUEST: {
      vcrDataHandler
        .retrieveList()
        .then(snapshot => snapshot.val())
        .then(casettes => next(casettesListReceive({ casettes })));

      return next(action);
    }

    case SELECT_CASETTE: {
      // If we already have the casette's actions, no data-fetching is required.
      const storedActions = store.getState().vcrPlayer.actions;
      if (storedActions[action.id]) {
        return next(action);
      }

      vcrDataHandler
        .retrieveAction({ id: action.id })
        .then(snapshot => snapshot.val())
        .then(casetteActions => {
          next(casetteActionsReceive({
            id: action.id,
            casetteActions,
          }));

          // Also dispatch the original action;
          // We still need to select the casette we just received actions for.
          next(action);
        });

      return;
    }

    case PLAY: {
      const state = store.getState().vcrPlayer;
      const relevantActions = state.actions[state.selectedCasette];

      playActions(relevantActions, next);
    }

    default: {
      return next(action);
    }
  }
};

function playActions([action, ...restOfActions], next) {
  next(action);

  window.setTimeout(
    () => playActions(restOfActions, next),
    restOfActions[0].delay
  );
}

export default vcrRetrieveMiddleware
