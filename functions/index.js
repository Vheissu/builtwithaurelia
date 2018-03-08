const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const cors = require('cors');
const renderApplication = require('./render');
const renderFeed = require('./rss-feed');

let initialStateModel = {
    categories: {},
    currentCategory: null,
    projects: [],
    backupProjects: [],
    user: {},
    currentPage: 1,
    totalNumberOfPages: -1,
    currentSortMode: 'popular'
};



const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.database();

const app = new express();

app.use(cors({ origin: true }));

app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/feed', (req, res, next) => {
    return renderFeed(req, res, next, { functions, admin });
});

app.get('*', (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=180');

    const extensionMatcher = /^.*\.[^\\]+$/;
    if (req.path.match(extensionMatcher)) {
        return next();
    }

    if (!req.path) {
        req.path = '/';
    }

    db.ref('submissions').once('value', snapshot => {
        initialStateModel.projects = snapshot.val();

        renderApplication(req, res, next, initialStateModel);
    });
});

exports.api = functions.https.onRequest(app);
