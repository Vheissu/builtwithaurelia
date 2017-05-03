const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const RSS = require('rss');

const feed = new RSS({
  title: 'Built With Aurelia',
  description: 'Latest submissions added to Built With Aurelia.',
  feed_url: 'http://builtwithaurelia.com/#/feed',
  site_url: 'http://builtwithaurelia.com/'
});

const fs = require('fs');
const GitHubApi = require('github');

const github = new GitHubApi({
    debug: true,
    protocol: "https",
    host: "api.github.com",
    pathPrefix: '',
    Promise: require('bluebird'),
    followRedirects: false,
    timeout: 5000
});

github.authenticate({
    type: "token",
    token: "26762cfd2f4779d311a73ee33263fba08dcd8cd3",
});

exports.rssFeed = functions.https.onRequest((req, res) => {
  admin.database().ref('submissions').orderByChild('added').once('value').then(snapshot => {
    let items = snapshot.val();

    if (items) {
      for (let key in items) {
        let item = items[key];

        feed.item({
          title: item.name,
          description: item.description,
          url: `http://builtwithaurelia.com/#/submission/${key}`
        });
      }

      let generatedFeed = feed.xml({indent: true});
      generatedFeed = Buffer.from(generatedFeed);

      github.repos.getContent({
        owner: 'Vheissu',
        repo: 'builtwithaurelia',
        path: 'feed.xml',
        ref: 'gh-pages'
      }, function(err, res) {
        if (!err && res['sha']) {
          github.repos.updateFile({
            owner: 'Vheissu',
            repo: "builtwithaurelia",
            path: "feed.xml",
            message: "created rss feed",
            branch: "gh-pages",
            content: ''+generatedFeed.toString("base64")+'',
            sha: res['sha']
          }, function(err, res) {
            console.log(err, res);
          });
        }
    });
    }
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
