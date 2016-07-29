import { toFreq } from 'tonal-freq'

export const shouldTriggerAddNote({ ev, noteValue, currentNotes }) => {
  const frequency = toFreq(noteValue);

  const isValidKeyPressed = !!frequency;
  const isAlreadyPlaying = currentNotes.find(note => (
    note.value === noteValue
  ));
  const isSpecialKeyPressed = !!ev.metaKey || !!ev.ctrlKey || !!ev.shiftKey;

  return isValidKeyPressed && !isAlreadyPlaying && !isSpecialKeyPressed;
}
