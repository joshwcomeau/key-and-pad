import firebase from "firebase/app";
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
  },

  persist(casette) {
    const { id, actions } = casette;

    database.ref(`casettes/${id}`).set(actions);
  },
};
