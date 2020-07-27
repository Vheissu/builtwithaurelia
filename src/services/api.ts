import { app } from '../common/firebase';

export class Api {
    public async loadSubmissions(): Promise<unknown[]> {
        const submissionRef = await app.firestore().collection('submissions').where('status', '==', 'published').get();

        return submissionRef.docs.reduce((acc, value) => {
            acc.push({ id: value.id, ...value.data() });
            return acc;
        }, []);
    }

    public async loadSubmission(submissionId: string): Promise<unknown> {
        const submissionRef = await app.firestore().collection('submissions').doc(submissionId).get();

        return submissionRef.exists ? { id: submissionRef.id, ...submissionRef.data() } : null;
    }

    public async createSubmission(data: any): Promise<unknown> {
        const submissionRef = await app.firestore().collection('submissions').add(data);

        return submissionRef.id;
    }
}