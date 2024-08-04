
import { Hono } from 'hono';
import { validate } from '../middleware/zod.middleware';
import { loginSchema, registerSchema } from '../utils/validator/auth.validator';
import { login, register } from '../controllers/auth.controller';

const app = new Hono();

app.post('/login', validate(loginSchema), login);
app.post('/register', validate(registerSchema), register);

export default app;
