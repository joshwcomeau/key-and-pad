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
      createReplayMiddleware({ maximumDelay: 100 })
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
