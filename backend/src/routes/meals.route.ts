
import { Hono } from 'hono';
import { findMealByExternalId, getMealIngeredientsByMealId } from '../controllers/meals.controller';

const app = new Hono();

app.get('/:externalId', findMealByExternalId);
app.get('/:mealId/ingredients', getMealIngeredientsByMealId);

export default app;
