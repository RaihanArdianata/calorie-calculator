import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { timeout } from 'hono/timeout';
import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables; }>();

// Middleware
app.use(
  '/api/*',
  cors({
    origin: ['*'],
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);
app.use(logger());

app.use('/api', timeout(5000));

app.get('/proxy/:request', async (ctx) => {
  const request = ctx.req.param('request');
  const removedURL = request.replace("mealdb", "");

  const url = `https://www.themealdb.com/api/json/v1/1/${removedURL}`;
  const response = await fetch(url);
  console.log(response);

  if (!response.ok) {
    return ctx.json({ error: 'Failed to fetch data from external API' }, 500);
  }
  const data = await response.json();
  return ctx.json(data);
});

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
    alg: 'HS256',
  })
);

app.route('/api', routes); // Ensure routes are correct and match

app.onError(errorHandler);

export default app;
