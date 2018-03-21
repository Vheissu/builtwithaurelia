import { categories, getDefaultCategory } from '../../common/models/categories';

export function getCategories(state) {
    const currentCategory = getDefaultCategory();

    return { ...state, ...{ categories, currentCategory } };
}
