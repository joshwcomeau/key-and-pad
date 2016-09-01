import onboardingStages from '../data/onboarding-stages';

const warnIfStageNotFound = stage => {
  console.warn(`
    Warning: Onboarding
    You tried to look up the onboarding stage ${stage}, but no stage was found.
    The valid stages are: ${onboardingStages.join(', ')}.
  `);
};

const evaluate = (currentStage, condition, stage) => {
  const stageIndex = onboardingStages.indexOf(stage);
  const currentStageIndex = onboardingStages.indexOf(currentStage);

  if (stageIndex === -1) { warnIfStageNotFound(stage); }

  switch (condition) {
    case 'is-before': return currentStageIndex < stageIndex;
    case 'is-after': return currentStageIndex > stageIndex;
    case 'is-at-least': return currentStageIndex >= stageIndex;
    case 'is-same': return currentStageIndex === stageIndex;
    default: return;
  }
};

export const isBefore = currentStage => stage => {
  return evaluate(currentStage, 'is-before', stage);
};

export const isAfter = currentStage => stage => {
  return evaluate(currentStage, 'is-after', stage);
};

export const isAtLeast = currentStage => stage => {
  return evaluate(currentStage, 'is-at-least', stage);
};

export const isSame = currentStage => stage => {
  return evaluate(currentStage, 'is-same', stage);
};
