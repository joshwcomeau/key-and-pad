// STAGES
// The onboarding flow is linear, and involves the following stages:
//
// - initial
//     No keyboard is shown, only a simple "Why hello there!" message in the center
//     of the screen.
//     ENDING TRIGGER: button click
//
// - initial-confirmed
//     A transition stage where the introduction is disposed of
//     ENDING TRIGGER: time
//
//
// - keys-introduced
//     The keyboard fades in, centered, and text below reads "These are your keys"
//     a downward bouncing arrow encourages the user to press a letter on their physical
//     keyboard.
//     ENDING TRIGGER: pressing a key (or two?)
//
// - keys-confirmed
//     The text changes to a confirmation. The bouncing arrow stops. Maybe a
//     checkmark somewhere?
//     ENDING TRIGGER: time
//
// - pad-introduced
//     The keyboard slides to the left, and the XY Pad fades in.
//     The text changes to explain what it is.
//     ENDING TRIGGER: pressing a key while the pad is depressed
//
// - pad-confirmed
//     The text changes to a confirmation.
//     ENDING TRIGGER: time
//
// - control-panel-introduced
//     The keyboard and pad slide up, and a control panel fades in, in the center
//     of the screen. Below that, the text explains that the sounds can be tweaked
//     by using these controls. Encourage experimentation
//     ENDING TRIGGER: unsure. Either time, or changing a control.
//
// - completed
//     The keyboard, pad, and control panel all revert to their normal position.
//     No text is shown.
//     Update localStorage so that they are not shown the onboarding again.

export default [
  'initial',
  'initial-confirmed',
  'keys-introduced',
  'keys-confirmed',
  'pad-introduced',
  'pad-confirmed',
  'control-panel-introduced',
  'control-panel-confirmed',
  'completed',
];
