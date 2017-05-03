const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const RSS = require('rss');

const feed = new RSS({
    title: 'Built With Aurelia',
    description: 'Latest submissions added to Built With Aurelia.',
    feed_url: 'http://builtwithaurelia.com/feed.xml',
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

function getFeedFile() {
    return new Promise((resolve, reject) => {
        github.repos.getContent({
            owner: 'Vheissu',
            repo: 'builtwithaurelia',
            path: 'feed.xml',
            ref: 'gh-pages'
        }, function(err, res) {
            if (!err || err === null) {
                resolve(res['data']);
            } else {
                reject(err);
            }
        });
    });
}

exports.rssFeed = functions.database.ref('submissions').onWrite(() => {
    return new Promise((resolve, reject) => {
        admin.database().ref('submissions').orderByChild('added').once('value').then(snapshot => {
            let items = snapshot.val();

            items.sort((a, b) => {
                return b.added - a.added;
            });

            if (items) {
                let counter = 0;

                for (let key in items) {
                    if (items.hasOwnProperty(key) && counter < 10) {
                        let item = items[key];

                        feed.item({
                            title: item.name,
                            description: item.description,
                            url: `http://builtwithaurelia.com/#/submission/${key}`
                        });

                        counter++;
                    }
                }

                let generatedFeed = feed.xml({indent: true});
                let buffer = Buffer.from(generatedFeed);
                let content = buffer.toString('base64');

                getFeedFile().then(file => {
                    github.repos.updateFile({
                        owner: 'Vheissu',
                        repo: "builtwithaurelia",
                        path: "feed.xml",
                        message: "updated rss feed",
                        branch: "gh-pages",
                        content: content,
                        sha: file['sha']
                    });

                    resolve();
                }).catch(e => {
                    reject(e);
                });
            }
        });
    });
});

/*exports.rssfeed2 = functions.database.ref('submissions').onWrite(event => {
  const collectionRef = event.data.ref;

  return collectionRef.once('value')
    .then(messagesData => counterRef.set(messagesData.numChildren()));
});*/

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
