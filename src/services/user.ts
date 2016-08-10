declare var firebase;

import {computedFrom, autoinject} from 'aurelia-framework';

@autoinject
export class UserService {
    userLoggedIn: boolean = false;

    constructor() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.userLoggedIn = true;
            } else {
                this.userLoggedIn = false;
            }
        });
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    register(email, password) {
        return new Promise((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    @computedFrom('userLoggedIn')
    get isLoggedIn() {
        return this.userLoggedIn;
    }

    getLoggedInUser() {
        return firebase.auth().currentUser;
    }

    logout() {
        return firebase.auth().signOut();
    }
}
