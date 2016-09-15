<a href="http://keyandpad.com">
  <img src="misc/logo_large.png" width="246" height="75" />
</a>

#### A Web Audio experiment, featuring a keyboard-controlled synthesizer and a mouse-controlled X/Y pad (eg. kaoss pad). Built with [React](https://github.com/facebook/react) and [Redux](https://github.com/reactjs/redux).

### [Make some music!](http://keyandpad.com)

---------------

### Web Audio Reconciler

Key&Pad uses the Web Audio API to generate oscillators and effects. I needed some way for these nodes to be updated when the state in the Redux store changed, so I took inspiration from React and wrote [a reconciler](https://github.com/joshwcomeau/Key-Pad/blob/master/src/utils/web-audio-reconciler.js).

It subscribes to the store, and whenever a change is published, it calculates the minimum change needed to update the Web Audio nodes.

Oscillators are cheap and disposable. When a note is played or released, we can simply scrap all existing oscillators and recreate them from the Redux state.

When dragging on the X/Y pad, though, effect parameters change incredibly fast, so a bit more precision is required. Thankfully, the currently-active effect is available in Redux state, so it's simply a matter of switching on the effect name, and applying the new amount.

I'm quite pleased with this approach. We're maintaining a single source of truth by having Redux state hold the data needed to build the Web Audio nodes, and our reconciler ensures that updates are performant and straightforward. A single function controls every possible update, and the changes that flow through from Redux to the imperative Web Audio API are easy to follow.

### Redux VCR

This synth was developed in tandem with Redux VCR, an ambitious and experimental devtool that records user sessions so they can be played back by app developers.

DAWs like Ableton Live have an interesting "record" option. Rather than record the resulting audio, it instead records the sequence of MIDI actions needed to construct the audio. This way, recordings can be edited and tweaked, and they're a much smaller file size.

It occurred to me that Redux functions in a very similar manner; If you store all of your app state in redux, you can simply replay those actions in realtime to re-create the session on the fly.

I really wanted to see what people would create with Key&Pad, and this tool allows me to anonymously collect and watch what people do; not just the resulting audio, but also the notes pressed, the X/Y pad updates, etc.

Typically, Redux VCR's recorded sessions would only be viewable by developers and administrators. Because Key&Pad records no personal information, though, its cassettes can be replayed by anybody. Simply [visit this secret URL](http://keyandpad.com/?adminMode=true) and interact with the VCR :)

### Special Thanks

The Web Audio API is immensely powerful, but it gives you the primitives needed to construct advanced effects. For the most part, I deferred this task to the makers of [Tuna.js](https://github.com/Theodeus/tuna) and [Soundbank](https://github.com/mmckegg/soundbank).

If anyone else is working with Web Audio, I recommend both of these tools.
