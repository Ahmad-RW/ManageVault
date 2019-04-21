import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA8MSEWQcREJz84if4HWvXbugg977vBFrY",
    authDomain: "managevault.firebaseapp.com",
    databaseURL: "https://managevault.firebaseio.com",
    projectId: "managevault",
    storageBucket: "managevault.appspot.com",
    messagingSenderId: "920806818532"
  };
 const fb = firebase.initializeApp(config);
 export default fb;
