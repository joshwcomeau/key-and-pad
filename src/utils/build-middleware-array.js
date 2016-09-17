import {
  createCaptureMiddleware,
  createPersistHandler,
  createRetrieveHandler,
  createRetrieveMiddleware,
  createReplayMiddleware,
} from 'redux-vcr';

import { firebaseAuth } from '../data/firebase';

import {
  COMPLETE_ONBOARDING,
} from '../actions';


export default function buildMiddlewareArray({ adminMode = false } = {}) {
  const middlewares = [];

  if (adminMode) {
    const retrieveHandler = createRetrieveHandler({ firebaseAuth });

    middlewares.push(
      createRetrieveMiddleware({ retrieveHandler, requiresAuth: false }),
      createReplayMiddleware({
        maximumDelay: 2000,
        // The cassette was not recorded in admin mode, but we need to replay
        // it in admin mode. Without this override, it switches modes on us,
        // and we lose our spiffy VCR :o
        overwriteCassetteState: {
          isAdmin: true,
        },
      })
    );
  } else {
    const persistHandler = createPersistHandler({
      firebaseAuth,
      debounceLength: 500,
    });

    middlewares.push(createCaptureMiddleware({
      persistHandler,
      blacklist: [{ matchingCriteria: 'startsWith', type: 'MODALS/' }],
      startTrigger: COMPLETE_ONBOARDING,
      minimumActionsToPersist: 20,
    }));
  }

  return middlewares;
}
