module.exports = (req, res, next, { functions, admin }) => {
    const RSS = require('rss');

    const feed = new RSS({
        title: 'Built With Aurelia',
        description: 'Latest submissions added to Built With Aurelia.',
        feed_url: 'https://builtwithaurelia.com/feed',
        site_url: 'https://builtwithaurelia.com/'
    });

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
                        url: `https://builtwithaurelia.com/view/${key}`
                    });

                    counter++;
                }
            }

            let generatedFeed = feed.xml({ indent: true });
            let buffer = Buffer.from(generatedFeed);
            let content = buffer.toString('base64');

            res.status(200).send(content);
        } else {
            res.status(500);
        }
    });
};
