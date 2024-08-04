
import { Hono } from "hono";
import * as controller from "../controllers/profile.controller";
import { authentication, authenticationUser } from "../middleware/auth.middleware";
import { validate } from "../middleware/zod.middleware";
import * as validator from "../utils/validator/users.validator";

const app = new Hono();

app.get("/", authentication, authenticationUser, controller.show);
app.patch("/", authentication, authenticationUser, validate(validator.updateSchema), controller.update);
app.delete("/", authentication, authenticationUser, controller.remove);

export default app;
