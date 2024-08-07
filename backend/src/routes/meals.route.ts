
import { Hono } from 'hono';
import { findMealByExternalId, findMealBookmark, getMealIngredientsByMealId } from '../controllers/meals.controller';
import { authentication, authenticationUser } from '../middleware/auth.middleware';
import { add, removes } from '../controllers/favorite.meal.controller';

const app = new Hono();

app.get('/:externalId', findMealByExternalId);
app.get('/:externalId', findMealByExternalId);
app.get('/:mealId/ingredients', getMealIngredientsByMealId);
app.get('/:externalId/users', authentication, authenticationUser, findMealBookmark);


app.post('/:mealId/favorite', authentication, authenticationUser, add);
app.delete('/:mealId/favorite/:favoriteId', authentication, authenticationUser, removes);

export default app;
