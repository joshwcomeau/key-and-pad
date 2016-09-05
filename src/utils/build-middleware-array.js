import { createCaptureMiddleware } from 'redux-vcr.capture';
import { createPersistHandler } from 'redux-vcr.persist';
import { createRetrieveHandler, createRetrieveMiddleware } from 'redux-vcr.retrieve';
import { createReplayMiddleware } from 'redux-vcr.replay';

import { firebaseAuth } from '../data/firebase';

import {
  COMPLETE_ONBOARDING,
} from '../actions';


export default function buildMiddlewareArray({ adminMode }) {
  const middlewares = [];

  if (adminMode) {
    const retrieveHandler = createRetrieveHandler({ firebaseAuth });

    middlewares.push(
      createRetrieveMiddleware({ retrieveHandler, requiresAuth: false }),
      createReplayMiddleware({
        maximumDelay: 100,
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
      startTrigger: COMPLETE_ONBOARDING,
    }));
  }

  return middlewares;
}
