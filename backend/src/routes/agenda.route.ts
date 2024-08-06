
import { Hono } from "hono";
import * as controller from "../controllers/agenda.controller";
import { authentication, authenticationUser } from "../middleware/auth.middleware";
import { validate } from "../middleware/zod.middleware";
import * as validator from "../utils/validator/agenda.validator";

const app = new Hono();

app.get("/", authentication, authenticationUser, controller.find);
app.post("/", authentication, authenticationUser, validate(validator.createSchema), controller.create);
app.patch("/:agendaId", authentication, authenticationUser, validate(validator.updateSchema), controller.update);
app.delete("/:agendaId", authentication, authenticationUser, controller.remove);

export default app;
