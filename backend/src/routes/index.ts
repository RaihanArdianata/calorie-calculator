import { Hono } from 'hono';

import auth from './auth.route';
import meals from './meals.route';
import users from './users.route';

const app = new Hono();

app.route('/auth', auth);
app.route('/meals', meals);
app.route('/users', users);

export default app;
