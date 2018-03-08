module.exports = (req, res, next, { functions, admin }) => {
    const RSS = require('rss');

    res.set('Content-Type', 'text/xml');

    const feed = new RSS({
        title: 'Built With Aurelia',
        description: 'Latest submissions added to Built With Aurelia.',
        feed_url: 'https://builtwithaurelia.com/feed',
        site_url: 'https://builtwithaurelia.com/'
    });

    admin.database().ref('submissions').orderByChild('added').once('value').then(snapshot => {
        const items = [];

        snapshot.forEach(snap => {
            const item = snap.val();
            items.push({ key: snap.key, name: item.name, description: item.description});
        });

        if (items) {
            items.reverse();

            for (let i = 0; i < 10; i++) {
                const { name, description, key } = items[i];

                feed.item({
                    title: name,
                    description: description,
                    url: `https://builtwithaurelia.com/view/${key}`
                });
            }

            let generatedFeed = feed.xml({ indent: true });
            // let buffer = Buffer.from(generatedFeed);
            // let content = buffer.toString('base64');

            res.status(200).send(generatedFeed);
        } else {
            res.status(500);
        }
    });
};
