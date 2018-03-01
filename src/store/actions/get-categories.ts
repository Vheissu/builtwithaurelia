export function getCategories(state) {
    const categories = {
        all: { name: 'All', value: '', count: 0 },
        mobile: { name: 'Mobile', value: 'mobile', count: 0 },
        plugin: { name: 'Plugins', value: 'plugin', count: 0 },
        theme: { name: 'Themes', value: 'theme', count: 0 },
        website: { name: 'Websites', value: 'website', count: 0 }
    };

    const currentCategory = categories.all;

    return { ...state, ...{ categories, currentCategory } };
}
