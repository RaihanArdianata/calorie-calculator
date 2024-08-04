import { Hono } from 'hono';

import auth from './auth.route';
import meals from './meals.route';

const app = new Hono();

app.route('/auth', auth);
app.route('/meals', meals);

export default app;
