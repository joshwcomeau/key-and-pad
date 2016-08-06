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
      // This is where the magic happens!
      let actionIndex = 0;

      window.setInterval(() => {
        const { selectedCasette, actions } = store.getState().vcrPlayer;
        const relevantActions = actions[selectedCasette];

        const nextAction = relevantActions[actionIndex];

        next(nextAction);

        actionIndex++;
      }, 1000);
    }

    default: {
      return next(action);
    }
  }
};

export default vcrRetrieveMiddleware
