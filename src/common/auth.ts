import { firebase } from './firebase';

export class Auth {
    private auth;
    private loggedIn = false;
    private token;

    constructor() {
        this.auth = firebase.auth();

        this.auth.onAuthStateChanged(async user => {
            // eslint-disable-next-line no-undef
            const token = await this.auth?.currentUser?.getIdTokenResult(true);

            if (user) {
                this.loggedIn = true;
                this.token = token;
                console.log(user);
            } else {
                this.loggedIn = false;
                this.token = null;
            }
        });
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
