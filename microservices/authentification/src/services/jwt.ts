import jwt from 'jsonwebtoken';

export function generateJwt(
  id: string,
  roles: Array<string>
): { token: string } {
  const payload = { id, roles };

  return {
    token: jwt.sign(payload, process.env.SECRET_KEY ?? '', {
      expiresIn: '24h',
    }),
  };
}
