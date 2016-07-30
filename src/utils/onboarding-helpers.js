import onboardingStages from '../data/onboarding-stages';

const warnIfStageNotFound = stage => {
  console.warn(`
    Warning: Onboarding
    You tried to look up the onboarding stage ${stage}, but no stage was found.
    The valid stages are: ${onboardingStages.join(', ')}.
  `);
}

export const isBeforeStage = (stage, currentStage) => {
  const stageIndex = onboardingStages.indexOf(stage);
  const currentStageIndex = onboardingStages.indexOf(currentStage);

  if (stageIndex === -1) { warnIfStageNotFound(stage); }

  return currentStageIndex < stageIndex;
}

export const isAfterStage = (stage, currentStage) => {
  const stageIndex = onboardingStages.indexOf(stage);
  const currentStageIndex = onboardingStages.indexOf(currentStage);

  if (stageIndex === -1) { warnIfStageNotFound(stage); }

  return currentStageIndex > stageIndex;
}

export const isSameStage = (stage, currentStage) => {
  const stageNameIsValid = onboardingStages.includes(stage);
  if (!stageNameIsValid) { warnIfStageNotFound(stage); }

  // This seems silly, but it's helpful for the warning if a stage name changes.
  return stage === currentStage;
}
