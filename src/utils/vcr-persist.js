import firebase from 'firebase/app';
import debounce from 'lodash.debounce'

import 'firebase/database';

let database;


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

    database.ref(`casettes/${id}`).set(actions);
  },
};
