import { Hono } from "hono";
import * as controller from "../controllers/users.controller";
import { authentication, authenticationAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/zod.middleware";
import * as validator from "../utils/validator/users.validator";

const app = new Hono();

app.get("/", authentication, authenticationAdmin, controller.fetchAll);
app.post("/", authentication, authenticationAdmin, validate(validator.createSchema), controller.create);
app.delete("/", authentication, authenticationAdmin, validate(validator.deleteSchema), controller.removes);
app.get("/:userId/fav-meals", authentication, authenticationAdmin, controller.favMeals);

export default app;
