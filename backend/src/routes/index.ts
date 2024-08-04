import { Hono } from 'hono';

import auth from './auth.route';
import meals from './meals.route';
import users from './users.route';
import profile from './profile.route';

const app = new Hono();

app.route('/auth', auth);
app.route('/meals', meals);
app.route('/users', users);
app.route('/profile', profile);

export default app;
