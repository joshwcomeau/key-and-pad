# Key&Pad

### A Web Audio experiment, featuring a keyboard-controlled synthesizer and a mouse-controlled X/Y pad (eg. kaoss pad). Built with [React](https://github.com/facebook/react) and [Redux](https://github.com/reactjs/redux).

[ Image here ]

## How it works

#### Web Audio Reconciler


Key&Pad uses the Web Audio API to create oscillators and effects.

My first shot at the project was very imperative. When a note was played, I'd create an oscillator. When a filter was tweaked, I'd update the filter parameter.

I was maintaining state in multiple places: little objects existed to remember what the current set of oscillators or effect parameters were. This was all in addition to the state sitting in Redux's store.

I decided to do things a little more idiomatically, and take inspiration from React.

I added [a reconciler](temp) that subscribes to the Redux store, and evaluates what needs to change. Oscillators are, by design, cheap and disposable, so if the notes have changed I can just stop all current oscillators and create new ones.

Certain things, like effects, need to be

As someone who dabbles in electronic music production, I really like how DAWs like Ableton Live records not the audio itself, but the sequence of MIDI actions required to assemble and play the audio. When you replay a track you've made, it simply traverses the sequence of events (notes played, effects tweaked).

The natural equivalency in web development is Redux. With Redux, your entire application state can be captured as a sequence of actions. This is an awesome way to manage state for this kind of application, both because it's intuitive, and because it's serializable.

I'm using React for components, because it's awesome :)
