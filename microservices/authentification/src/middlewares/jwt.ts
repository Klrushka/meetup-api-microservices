import { expressjwt } from 'express-jwt';

export const jwt = expressjwt({
    secret: process.env.SECRET_KEY ?? '',
    algorithms: ['HS256'],
});
