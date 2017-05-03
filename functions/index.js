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

      res.send(feed.xml({indent: true}));
    }
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
