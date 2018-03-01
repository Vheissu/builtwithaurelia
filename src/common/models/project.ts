export interface ProjectModelInterface {
    email: string;
    password: string;
    password2: string;
    name: string;
    category: string;
    url: string;
    repoUrl?: string;
    description: string;
    twitterHandle?: string;
}

export const ProjectModel: ProjectModelInterface = {
    email: '',
    password: '',
    password2: '',
    name: '',
    category: 'website',
    url: '',
    repoUrl: '',
    description: '',
    twitterHandle: ''
};
