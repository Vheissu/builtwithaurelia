import firebase from '../common/firebase';

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
