import vcrDataHandler from '../utils/vcr-data-handler';
import { CASETTES_LIST_REQUEST } from '../ducks/vcr-player.duck';


const vcrRetrieveMiddleware = store => next => action => {
  switch (action.type) {
    case CASETTES_LIST_REQUEST: {
      vcrDataHandler.retrieveList();
      return next(action);
    }
    default: {
      return next(action);
    }
  }
};

export default vcrRetrieveMiddleware
