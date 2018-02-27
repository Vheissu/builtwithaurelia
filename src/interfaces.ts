export interface SubmissionInterface {
    _uid: string;
    added: number;
    category: string;
    description: string;
    name: string;
    twitterHandle: string;
    url: string;
    repoUrl: string;
    votes: any;
    status: 'published' | 'unpublished' | 'moderation-queue' | 'draft' | 'rejected';
    currentUserHasVotedFor?: boolean;
    key?: string;
}