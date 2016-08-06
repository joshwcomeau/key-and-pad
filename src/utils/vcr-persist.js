import firebase from 'firebase/app';
import debounce from 'lodash.debounce'

import 'firebase/database';

let database;
const sessionStart = Date.now();


export default {
  initialize() {
    const config = {
      apiKey: "AIzaSyDZUV6qop3EoFnvnxVbt6vO4sq-EhJ3TPg",
      authDomain: "key-pad-casettes.firebaseapp.com",
      databaseURL: "https://key-pad-casettes.firebaseio.com",
      storageBucket: "key-pad-casettes.appspot.com",
    };

    firebase.initializeApp(config);
    database = firebase.database();

    // Debounce our `persist` method, to avoid spamming firebase whenever
    // a small change happens
    this.persist = debounce(this.persist, 1000);
  },

  persist(casette) {
    const { id, actions } = casette;

    // For efficiency, we want our firebase structure to look like:
    /*
      {
        casettes: {
          abc123: { timestamp: 123456789, numOfActions: 200 },
          xyz789: { ... }
        ],
        actions: {
          abc123: [
            {
              time: 100,
              action: {
                // Redux action
                type: 'DO_THING',
                payload: { ... }
              }
            }
          ],
          xyz789: [ ... ],
        },
      }
    */

    database.ref(`casettes/${id}`).set({
      timestamp: sessionStart,
      numOfActions: actions.length,
    });

    database.ref(`actions/${id}`).set(actions);
  },
};
