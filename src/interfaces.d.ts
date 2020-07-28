type Status = 'draft' | 'awaiting-moderation' | 'published';

interface Submission {
    id: string;
    title: string;
    category: string;
    slug: string;
    description: string;
    status: Status;
    datetime: string;
}