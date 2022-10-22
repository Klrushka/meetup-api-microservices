import bcrypt from 'bcrypt';

export function encrypt(password: string): { hash: string, salt: string } {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return { hash, salt };
}