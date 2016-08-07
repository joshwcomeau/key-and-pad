Module has 3 main exports:

redux-vcr/capture
redux-vcr/persist
redux-vcr/player


When it comes time to decouple from this project, here are the needed pieces:

PLAYER
wrap-reducer
vcr-player-duck
Icon (along with all used icon SVGs)
vcr-retrieve.middleware.js
components/Backdrop
components/ReduxVCR
components/VCR
components/CasetteList
components/Casette

PERSIST
vcr-persist.middleware.js
vcr-data-handler.js

CAPTURE
vcr-data-handler.js

Also require some NPM packages:
- classnames
- react-addons-css-transition-group

CAPTURE

Create a middleware that intercepts all actions, along with their timestamp delta from the store instantiation.

Some way of attaching session ID. For now just use a UUID.

Format:

sessionAbc: [
  {
    time: 0,
    action: {
      type: @@INIT
    }
  }, {
    time: 123.456 // in ms, with as much precision as possible
    action: {
      type: 'WHATEVER',
      payload: { thing: 'hi' }
    }
  }
]

Send those actions (debounced and collected, maybe?) to the server. The user will need to pass it a URL to POST to on configuration, so that the client can delegate the job of persisting this data to the server-side component.


PERSIST

Runs on a Node server. Will need to be handed the Express app object, so that it
can create a POST endpoint and listen for dispatches.

Config:

- Express `app` object
- endpoint as a string.
- AWS credentials. Because this is the server, we don't have to worry too much.
- bucket


PLAYER

A React component, included in dev mode, that fetches a list of recent session IDs and allows you to play them.
