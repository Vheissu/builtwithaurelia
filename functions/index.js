const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const cors = require('cors');
const { render } = require('aurelia-ssr-engine');
const RSS = require('rss');

const feed = new RSS({
    title: 'Built With Aurelia',
    description: 'Latest submissions added to Built With Aurelia.',
    feed_url: 'https://builtwithaurelia.com/feed.xml',
    site_url: 'https://builtwithaurelia.com/'
});

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const app = new express();
const bundle = './dist/server.bundle';

app.use(cors({ origin: true }));

app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname, 'dist')));

const renderApplication = (req, res, next) => {
    const renderOptions = {
        preboot: true,
        prebootOptions: {
            uglify: true
        },
        bundlePath: require.resolve(bundle),
        template: require('fs').readFileSync(path.resolve('./dist/index.ssr.html'), 'utf-8')
    };

    const initializationOptions = {
        main: () => {
            delete require.cache[require.resolve(bundle)];
            return require(bundle);
        }
    };

    const url = `https://builtwithaurelia.com${req.path}`;

    const extensionMatcher = /^.*\.[^\\]+$/;
    if (req.path.match(extensionMatcher)) {
        return next();
    }

    return render(Object.assign({ url }, renderOptions), initializationOptions)
        .then(html => {
            console.log('Render response', html);
            return res.status(200).send(html);
        })
        .catch(e => {
            return res.status(500).send(`<html><body>Failed to render ${req.path}</body></html>`);
            console.log(`Failed to render ${req.path}`);
            console.log(e);
        });
};

app.get('*', (req, res, next) => {
    renderApplication(req, res, next);
});

app.get('rss', (req, res) => {
    functions.database.ref('submissions').onWrite(() => {
        admin.database().ref('submissions').orderByChild('added').once('value').then(snapshot => {
            let items = snapshot.val();

            if (items) {
                let counter = 0;

                for (let key in items) {
                    if (items.hasOwnProperty(key) && counter < 10) {
                        let item = items[key];

                        feed.item({
                            title: item.name,
                            description: item.description,
                            url: `https://builtwithaurelia.com/submission/${key}`
                        });

                        counter++;
                    }
                }

                let generatedFeed = feed.xml({indent: true});
                let buffer = Buffer.from(generatedFeed);
                let content = buffer.toString('base64');

                res.status(200).send(content);
            } else {
                res.status(500);
            }
        });
    });
});

const ssr = functions.https.onRequest(app);
const rss = functions.https.onRequest(app);

module.exports = {
    ssr,
    rss
};
