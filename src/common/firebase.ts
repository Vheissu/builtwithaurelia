import firebaseConfig from '../config/firebase.config.json';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const app: firebase.app.App = firebase.initializeApp(firebaseConfig);
const auth: firebase.auth.Auth = app.auth();

export async function authStateChanged(): Promise<{user: firebase.User, token: firebase.auth.IdTokenResult} | null> {
    return new Promise(resolve => {
        firebase.auth().onAuthStateChanged(async user => {
            // eslint-disable-next-line no-undef
            const token = await firebase.auth()?.currentUser?.getIdTokenResult(true);

            if (user) {
                console.log(user);
                resolve({user, token});
            } else {
                resolve(null);
            }
        });
    });
}

export async function getFirebaseUser(username: string): Promise<firebase.firestore.DocumentData | null> {
    const doc = await firebase
        .firestore()
        .collection('users')
        .doc(username)
        .get();

    return doc.exists ? doc.data() : null;
}

export { app, auth, firebase };
