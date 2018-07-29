import { PLATFORM } from 'aurelia-pal';

export const colours = [
    'bg--purple',
    'bg--grapefruit',
    'bg--medium-blue',
    'bg--bright-blue',
    'bg--gentle-pink',
    'bg--teal',
    'bg--light-cyan',
    'bg--brave-orange',
    'bg--yellow-its-me',
    'bg--green',
    'bg--pie',
    'bg--middle-blue'
];


export const getColourFromHashedString = str => {
    if (str) {
        let hash = hashString(str);
        let index = hash % colours.length;

        return colours[index];
    }

    return null;
};

export const hashString = str => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        hash += charCode;
    }

    return hash;
};

export const paginate = (page, maxPerPage, items) => {
    let offset = (page - 1) * maxPerPage;
    let totalPages = Math.ceil(items.length / maxPerPage);

    return {
        items: (maxPerPage === -1) ? items : items.slice(offset, offset + maxPerPage),
        pages: totalPages
    };
};

export const slugify = str => {
    return str.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export let categories = [
    {name: 'Website', value: 'website', selected: true, count: 0},
    {name: 'Plugin', value: 'plugin', count: 0},
    {name: 'Mobile Application', value: 'mobile', count: 0},
    {name: 'Theme', value: 'theme', count: 0}
];

export const scrollTop = () => {
    PLATFORM.global.scrollTo(0, 0);
};

export const isEmpty = str => {
    return typeof str === 'string' && str.trim() === '';
};

export const notEmpty = str => {
    return typeof str === 'string' && str.trim() !== '';
};

export const stringInObject = (str, obj) => {
    return typeof str === 'string' && obj && str in obj || false;
};

export const isUrl = str => {
    return typeof str === 'string' && (str.indexOf('http:') >= 0 || str.indexOf('https:') >= 0) || false;
};

export const requiredField = (field, map) => {
    return field && map && map.indexOf(field) >= 0 || false;
};

export const equals = (a, b) => {
    return a === b;
};
