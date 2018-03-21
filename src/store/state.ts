interface CategoryInterface {
    name: string;
    value: string;
    count: number;
}

export interface State {
    categories: CategoryInterface[];
    currentCategory: string;
    projects: any[];
    backupProjects: any[];
    user: {};
    currentPage: number;
    totalNumberOfPages: number;
    currentSortMode: string;
}

export const initialState: State = {
    categories: [],
    currentCategory: null,
    projects: [],
    backupProjects: [],
    user: {},
    currentPage: 1,
    totalNumberOfPages: -1,
    currentSortMode: 'popular'
};
