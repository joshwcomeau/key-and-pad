import vcrDataHandler from '../utils/vcr-data-handler';
import {
  CASETTES_LIST_REQUEST,
  SELECT_CASETTE,
  TOGGLE_PLAY_PAUSE,
  casetteActionsReceive,
  casettesListReceive,
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

    case TOGGLE_PLAY_PAUSE: {
      // Dispatch the action right away, so that it updates our state.
      // This is how we know whether this is a 'PLAY' or 'PAUSE' action.
      next(action);

      const state = store.getState().vcrPlayer;
      const actions = state.actions[state.selectedCasette];
      const { playStatus } = state;

      if (playStatus === 'playing') {
        return playActions({
          store,
          next,
          actions,
        });
      }

      return;
    }

    default: {
      return next(action);
    }
  }
};

function playActions({ store, next, actions }) {
  const [action, ...restOfActions] = actions;

  next(action);

  // TODO: Dispatch an action to increment casette_action_index.

  const { playStatus } = store.getState().vcrPlayer;

  if (playStatus === 'playing') {
    window.setTimeout(
      () => playActions({ store, next, actions: restOfActions }),
      restOfActions[0].delay
    );
  }
}

export default vcrRetrieveMiddleware;
