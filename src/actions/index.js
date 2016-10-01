// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const DEACTIVATE_EFFECTS = 'EFFECTS/DEACTIVATE_EFFECTS';
export const UPDATE_EFFECTS_AMOUNT = 'EFFECTS/UPDATE_EFFECTS_AMOUNT';
export const CHANGE_AXIS_EFFECT = 'EFFECTS/CHANGE_AXIS_EFFECT';
export const TWEAK_AXIS_PARAMETER = 'EFFECTS/TWEAK_AXIS_PARAMETER';

export const ADD_NOTE = 'NOTES/ADD_NOTE';
export const REMOVE_NOTE = 'NOTES/REMOVE_NOTE';
export const REMOVE_ALL_NOTES = 'NOTES/REMOVE_ALL_NOTES';

export const UPDATE_OSCILLATOR = 'OSCILLATORS/UPDATE_OSCILLATOR';

export const UPDATE_STAGE = 'ONBOARDING/UPDATE_STAGE';
export const GO_TO_NEXT_STAGE = 'ONBOARDING/GO_TO_NEXT_STAGE';
export const COMPLETE_ONBOARDING = 'ONBOARDING/COMPLETE_ONBOARDING';
export const EXPERIMENT_WITH_NOTES = 'ONBOARDING/EXPERIMENT_WITH_NOTES';
export const EXPERIMENT_WITH_PAD = 'ONBOARDING/EXPERIMENT_WITH_PAD';

export const OPEN_MODAL = 'MODALS/OPEN_MODAL';
export const CLOSE_MODAL = 'MODALS/CLOSE_MODAL';

export const SET_ADMIN_MODE = 'IS_ADMIN/SET_ADMIN_MODE';

// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////

export const deactivateEffects = () => ({
  type: DEACTIVATE_EFFECTS,
  x: true,
  y: true,
});

export const updateEffectsAmount = ({ x, y }) => ({
  type: UPDATE_EFFECTS_AMOUNT,
  x,
  y,
});

export const changeAxisEffect = ({ axis, effect }) => ({
  type: CHANGE_AXIS_EFFECT,
  [axis]: {
    effect,
  },
});

export const tweakAxisParameter = ({ axis, options }) => ({
  type: TWEAK_AXIS_PARAMETER,
  [axis]: {
    options,
  },
});

export const addNote = ({ value, letter }) => ({
  type: ADD_NOTE,
  value,
  letter,
});

export const removeNote = ({ value }) => ({
  type: REMOVE_NOTE,
  value,
});

export const removeAllNotes = () => ({
  type: REMOVE_ALL_NOTES,
});

export const updateStage = ({ stage }) => ({
  type: UPDATE_STAGE,
  stage,
});

export const goToNextStage = () => ({
  type: GO_TO_NEXT_STAGE,
});

export const completeOnboarding = () => ({
  type: COMPLETE_ONBOARDING,
});

export const experimentWithNotes = () => ({
  type: EXPERIMENT_WITH_NOTES,
});

export const experimentWithPad = () => ({
  type: EXPERIMENT_WITH_PAD,
});

export const updateOscillator = ({ index, options }) => ({
  type: UPDATE_OSCILLATOR,
  index,
  options,
});

export const openModal = ({ name }) => ({
  type: OPEN_MODAL,
  name,
});

export const closeModal = () => ({
  type: CLOSE_MODAL,
});

export const setAdminMode = ({ adminMode }) => ({
  type: SET_ADMIN_MODE,
  adminMode,
});
