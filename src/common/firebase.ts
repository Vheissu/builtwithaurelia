// Secular imports for smaller resulting bundle (Firebase can get big)
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Firebase configuration
const config = {
    apiKey: "AIzaSyDO0qFKD3epgUWyzcySSbwk-lRFZ38m92w",
    authDomain: "built-with-aurelia-6ef02.firebaseapp.com",
    databaseURL: "https://built-with-aurelia-6ef02.firebaseio.com",
    projectId: "built-with-aurelia-6ef02",
    storageBucket: "built-with-aurelia-6ef02.appspot.com",
    messagingSenderId: "380305050522"
};

// If we haven't already initialized an app, initialize it
if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default firebase;
