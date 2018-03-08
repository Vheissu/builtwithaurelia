const path = require('path');
const { render } = require('aurelia-ssr-engine');

module.exports = (req, res, next, initialState) => {
    const bundle = './dist/server.bundle';

    console.log('Render application started');

    const template = require('fs').readFileSync(path.resolve('./dist/index.ssr.html'), 'utf-8')
        .replace("// [prerendered model]", `window.__PRELOADED_STATE__ = ${JSON.stringify(initialState)};`);

    console.log('Template read', template);

    const renderOptions = {
        preboot: true,
        prebootOptions: {
            uglify: true
        },
        bundlePath: require.resolve(bundle),
        template
    };

    console.log('Setting render options', renderOptions);

    const initializationOptions = {
        main: () => {
            delete require.cache[require.resolve(bundle)];
            return require(bundle);
        }
    };

    console.log('Initialization options', initializationOptions);

    const url = `https://builtwithaurelia.com${req.path}`;

    console.log('Request path', url);

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
