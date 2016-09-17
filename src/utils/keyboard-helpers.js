import { toFreq } from 'tonal-freq';
import keycode from 'keycode';
import keyboardNotes from '../data/keyboard-notes';


export const getNoteAndLetter = ev => {
  const letter = keycode(ev).toUpperCase();
  const noteValue = keyboardNotes[letter];

  return [noteValue, letter];
};

export const shouldEventTriggerAction = ({ ev, noteValue, currentNotes, mode }) => {
  const frequency = toFreq(noteValue);

  const isValidNote = !!frequency;
  const isSpecialKeyPressed = !!ev.metaKey || !!ev.ctrlKey || !!ev.shiftKey;

  // If we're pressing a key, we need to ensure the note isn't already playing.
  // If we're releasing, though, we need to ensure that it _is_.
  const isAlreadyPlaying = currentNotes.find(note => note.value === noteValue);
  const isValidForMode = mode === 'release' ? isAlreadyPlaying : !isAlreadyPlaying;

  return isValidNote && isValidForMode && !isSpecialKeyPressed;
};
