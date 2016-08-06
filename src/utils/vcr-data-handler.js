import firebase from 'firebase/app';
import debounce from 'lodash.debounce'

import 'firebase/database';

const sessionStart = Date.now();
const config = {
  apiKey: "AIzaSyDZUV6qop3EoFnvnxVbt6vO4sq-EhJ3TPg",
  authDomain: "key-pad-casettes.firebaseapp.com",
  databaseURL: "https://key-pad-casettes.firebaseio.com",
  storageBucket: "key-pad-casettes.appspot.com",
};

firebase.initializeApp(config);
const database = firebase.database();


const vcrDataHandler = {
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

  retrieveList() {
    return firebase.database().ref('casettes').once('value');
  },

  retrieveAction({ id }) {
    return firebase.database().ref(`actions/${id}`).once('value');
  }
};

// Debounce our `persist` method, to avoid spamming firebase whenever
// a small change happens
vcrDataHandler.persist = debounce(vcrDataHandler.persist, 1000);

export default vcrDataHandler;
