import { firebase } from './firebase';

export class Auth {
    private auth;

    constructor() {
        this.auth = firebase.auth();
    }

    createWithEmailAndPassword(email, password) {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    signInWithEmailAndPassword(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        return this.auth.signInWithPopup(provider);
    }

    signInWithGithub() {
        const provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('user');

        return this.auth.signInWithPopup(provider);
    }

    signInWithFacebook() {
        const provider = new firebase.auth.FacebookAuthProvider();

        return this.auth.signInWithPopup(provider);
    }

    signOut() {
        return this.auth.signOut();
    }

    get isSignedIn() {
        return !!this.currentUser;
    }

    get currentUser() {
        return this.auth.currentUser;
    }
}
