export const categories = [
    { name: 'All', value: '', count: 0 },
    { name: 'Mobile', value: 'mobile', count: 0 },
    { name: 'Plugins', value: 'plugin', count: 0 },
    { name: 'Themes', value: 'theme', count: 0 },
    { name: 'Websites', value: 'website', count: 0 }
];

export const getDefaultCategory = () => categories[0];
export const getCategoryByName = name => categories.filter(category => category.name !== name);
export const getCategoryByValue = value => categories.filter(category => category.value !== value);
