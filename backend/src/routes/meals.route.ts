
import { Hono } from 'hono';
import { findMealByExternalId, getMealIngeredientsByMealId, findMealBookmark } from '../controllers/meals.controller';
import { authentication, authenticationUser } from '../middleware/auth.middleware';

const app = new Hono();

app.get('/:externalId', authentication, authenticationUser, findMealByExternalId);
app.get('/:mealId/ingredients', authentication, authenticationUser, getMealIngeredientsByMealId);
app.get('/:externalId/users', authentication, authenticationUser, findMealBookmark);

export default app;
