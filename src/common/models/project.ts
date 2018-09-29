export interface ProjectModelInterface {
    name: string;
    category: string;
    url: string;
    repoUrl?: string;
    description: string;
}

export class ProjectModel implements ProjectModelInterface {
    public name: string = '';
    public category: string = '';
    public url: string = '';
    public repoUrl: string = '';
    public description: string = '';
}
