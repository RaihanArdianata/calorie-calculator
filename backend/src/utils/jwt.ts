import { decode, sign, verify } from 'hono/jwt';

interface tokenParams {
  email: string;
  national_id?: string;
  id: string;
}

export const generateToken = async ({ email, national_id, id }: tokenParams) => {
  const payload = {
    id: id,
    email: email,
    national_id: national_id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 30 minutes
  };
  const secret = process.env['JWT_SECRET'] || 'default';
  const token = await sign(payload, secret);

  return { token, exp: payload.exp };
};

export const verifyToken = async (token: string) => {
  const secret = process.env['JWT_SECRET'] || 'default';
  const result = await verify(token, secret);

  return result;
};

export const decodeToken = async (token: string) => {
  const result = await decode(token);

  return result;
};