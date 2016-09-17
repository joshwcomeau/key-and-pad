/* eslint-disable no-undef */
import 'babel-polyfill';
import { expect } from 'chai';
import sinon from 'sinon';
import { take, put } from 'redux-saga/effects';

import {
  experimentWithNotes,
  experimentWithPad,
  goToNextStage,
  completeOnboarding,
  GO_TO_NEXT_STAGE,
  ADD_NOTE,
  UPDATE_EFFECTS_AMOUNT,
} from '../../src/actions';
import { delay } from '../../src/utils/misc-helpers';
import { ONBOARDING_COMPLETED_FLAG } from '../../src/data/app-constants';
import {
  numOfKeypressesNeeded,
  numOfPadUpdatesNeeded,
} from '../../src/data/onboarding-config';
import onboarding, {
  handleKeyExperiments,
  handlePadExperiments,
} from '../../src/sagas/onboarding.saga';


describe('Onboarding sagas', () => {
  before(() => {
    global.localStorage = {
      setItem: sinon.stub(),
    };
  });

  afterEach(() => {
    localStorage.setItem.reset();
  });

  describe('primary watcher saga', () => {
    const generator = onboarding();

    it('takes the GO_TO_NEXT_STAGE action', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        take(GO_TO_NEXT_STAGE)
      );
    });

    it('waits 1000ms', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        // Note: the delay length is not actually tested.
        // Not top-priority, but we should find a solution to this.
        delay(1000)
      );
    });

    it('goes to the next stage', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        put(goToNextStage())
      );
    });

    // KEY EXPERIMENTS
    it('yields to handleKeyExperiments (tested below)', () => {
      expect(generator.next().value).to.be.an.instanceOf(handleKeyExperiments);
    });

    it('goes to the next stage, after key experiments', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        put(goToNextStage())
      );
    });

    it('waits 2000ms', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        // Note: the delay length is not actually tested.
        // Not top-priority, but we should find a solution to this.
        delay(2000)
      );
    });

    it('goes to the next stage, after a delay', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        put(goToNextStage())
      );
    });

    // PAD EXPERIMENTS
    it('yields to handlePadExperiments (tested below)', () => {
      expect(generator.next().value).to.be.an.instanceOf(handlePadExperiments);
    });

    it('goes to the next stage, after pad experiments', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        put(goToNextStage())
      );
    });

    it('waits 2000ms', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        // Note: the delay length is not actually tested.
        // Not top-priority, but we should find a solution to this.
        delay(2000)
      );
    });

    it('goes to the next stage, after a delay', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        put(goToNextStage())
      );
    });


    // CONTROL PANEL
    it('waits 5000ms for the Control Panel to be introduced', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        // Note: the delay length is not actually tested.
        // Not top-priority, but we should find a solution to this.
        delay(5000)
      );
    });

    it('shows the final "Good to go" message', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        // Note: the delay length is not actually tested.
        // Not top-priority, but we should find a solution to this.
        put(goToNextStage())
      );
    });

    it('waits a final 2000ms', () => {
      expect(
        generator.next().value
      ).to.deep.equal(
        // Note: the delay length is not actually tested.
        // Not top-priority, but we should find a solution to this.
        delay(2000)
      );
    });

    it('sets the ONBOARDING_COMPLETED_FLAG in localStorage, and completes onboarding', () => {
      const nextValue = generator.next().value;

      expect(localStorage.setItem.callCount).to.equal(1);
      expect(localStorage.setItem.args[0]).to.deep.equal([
        ONBOARDING_COMPLETED_FLAG, true,
      ]);

      expect(nextValue).to.deep.equal(put(completeOnboarding()));
    });

    it('has completed the generator', () => {
      const finalNext = generator.next();
      expect(finalNext.value).to.equal(undefined);
      expect(finalNext.done).to.equal(true);
    });
  });


  describe('handleKeyExperiments', () => {
    const generator = handleKeyExperiments();

    for (let i = 0; i < numOfKeypressesNeeded; i++) {
      it(`takes ADD_NOTE (iteration ${i + 1})`, () => {
        expect(
          generator.next().value
        ).to.deep.equal(
          take(ADD_NOTE)
        );
      });

      it(`puts experimentWithNotes (iteration ${i + 1})`, () => {
        expect(
          generator.next().value
        ).to.deep.equal(
          put(experimentWithNotes())
        );
      });
    }

    it('completes after enough iterations', () => {
      expect(generator.next().done).to.equal(true);
    });
  });


  describe('handlePadExperiments', () => {
    context('while notes are held down', () => {
      const generator = handlePadExperiments();

      for (let i = 0; i < numOfPadUpdatesNeeded; i++) {
        it(`takes UPDATE_EFFECTS_AMOUNT (iteration ${i + 1})`, () => {
          expect(
            generator.next().value
          ).to.deep.equal(
            take(UPDATE_EFFECTS_AMOUNT)
          );
        });

        it(`yields a select to get notes (iteration ${i + 1})`, () => {
          expect(
            generator.next().value.SELECT.selector
          ).to.be.a('function');
        });

        it(`puts experimentWithPad (iteration ${i + 1})`, () => {
          expect(
            generator.next(['A', 'B', 'C']).value
          ).to.deep.equal(
            put(experimentWithPad())
          );
        });
      }

      it('completes after enough iterations', () => {
        expect(generator.next().done).to.equal(true);
      });
    });
  });
});
