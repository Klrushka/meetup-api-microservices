import { googleUser } from '../models/db/google.user';

const serialize = (user: any, done: any) => {
    done(null, user.email);
};

const deserialize = async (email: string, done: any) => {
    try {
        const user = await googleUser.findOne({email});
        done(null, user);
    } catch (err) {
        done(err);
    }
};

export { serialize, deserialize };
