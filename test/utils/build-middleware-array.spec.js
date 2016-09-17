/* eslint-disable no-undef */
import { expect } from 'chai';

import buildMiddlewareArray from '../../src/utils/build-middleware-array';


describe('buildMiddlewareArray', () => {
  it('creates Capture middleware in regular mode', () => {
    const middlewares = buildMiddlewareArray();
    expect(middlewares).to.have.length.of(1);

    const [captureMiddleware] = middlewares;
    expect(captureMiddleware.toString()).to.match(/persistHandler/);
  });

  it('creates Retrieve and Replay in adminMode', () => {
    const middlewares = buildMiddlewareArray({ adminMode: true });
    expect(middlewares).to.have.length.of(2);

    const [retrieveMiddleware, replayMiddleware] = middlewares;
    expect(retrieveMiddleware.toString()).to.match(/retrieveHandler/);
    expect(replayMiddleware.toString()).to.match(/replayHandler/);
  });
});
