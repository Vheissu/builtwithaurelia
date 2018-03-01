export interface State {
    categories: {};
    currentCategory: string;
    projects: any[];
    backupProjects: any[];
    user: {};
    currentPage: number;
    totalNumberOfPages: number;
    currentSortMode: string;
}

export const initialState: State = {
    categories: {},
    currentCategory: null,
    projects: [],
    backupProjects: [],
    user: {},
    currentPage: 1,
    totalNumberOfPages: -1,
    currentSortMode: 'popular'
};
