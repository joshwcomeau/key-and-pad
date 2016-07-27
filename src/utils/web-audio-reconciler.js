export default function reconcile(current, next) {
  // There are two main areas of 'change':
  //
  // - A change to the oscillators, either the notes being played or the waveforms
  //   being used
  // - A change to the pad effects, either changing one of the effects or tweaking
  //   one of the effect parameters.
  //
  // No single state change will change both, so we can figure out which of the two
  // (if either) is being changed, and update accordingly.

}
