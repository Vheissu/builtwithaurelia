import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import slugify from 'slugify';

const app = express();
app.disable('x-powered-by');

app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cacheMiddleware = (req, res, next: any) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    next();
};

app.use(cacheMiddleware);

export const createUser = functions.auth.user().onCreate((user) => {
    return admin.firestore()
        .collection('users')
        .doc(user.uid)
        .set({ ...user })
});

export const deleteUser = functions.auth.user().onDelete((user) => {
    return admin.firestore()
        .collection('users')
        .doc(user.uid)
        .delete();
});

export const submissionCreated = functions.firestore.document('submissions/{submissionId}').onWrite((change) => {
    const newValue = change.after.data();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const slug = slugify((newValue as any).title as string, { lower: true });

    return change.after.ref.set({
        slug,
        status: 'awaiting-moderation'
    }, { merge: true })
});

export const submissionUpdated = functions.firestore.document('submissions/{submissionId}').onUpdate((change) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldSlug = slugify((oldValue as any).title as string, { lower: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const slug = slugify((newValue as any).title as string, { lower: true });

    // Prevent infinite loops, if the new and old slug matches, no change was made
    if (oldSlug === slug) {
        return false;
    }

    return change.after.ref.set({
        slug
    }, { merge: true })
});

export const api = functions
    .runWith({ memory: '1GB', timeoutSeconds: 120 })
    .https
    .onRequest(app);