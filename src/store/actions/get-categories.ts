import { categories, getDefaultCategory } from '../../common/models/categories';

export async function getCategories(state) {
    const newState = {...state};

    newState.currentCategory = getDefaultCategory();
    newState.categories = [...categories];

    return newState;
}
