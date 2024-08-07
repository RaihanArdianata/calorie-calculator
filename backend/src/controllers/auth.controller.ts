import { createUser, getUser } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { loginSchemaType, registerSchemaType } from "../utils/validator/auth.validator";
import { isEmpty } from "lodash";
import { bcryptVerify } from "../utils/hashing";
import ApiError from "../utils/ApiError";
import * as HttpStatus from "http-status";
import { generateToken } from "../utils/jwt";
import { isEmailOrUsernameTaken } from "../services/users.service";

// owner
export const register = catchAsync(async (c) => {
  const { email, firstName, lastName, password, phone }: registerSchemaType = await c.req.parseBody();

  const taken = await isEmailOrUsernameTaken(`${firstName.toLowerCase()}_${lastName.toLowerCase()}`, email);

  if (taken) throw new ApiError(HttpStatus.UNAUTHORIZED, { message: "your name or email is already taken!" });

  const result = await createUser({
    email, first_name: firstName, last_name: lastName, password, phone
  });
  return c.json({ result });
});

export const login = catchAsync(async (c) => {
  const { password, username }: loginSchemaType = await c.req.parseBody();

  const findUser = await getUser({ email: username, phone: username, username });

  if (isEmpty(findUser)) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: "unauthorize" });
  } else {
    const verifiedPassword = await bcryptVerify(password, findUser.password);
    if (verifiedPassword) {
      const { id, email, first_name, last_name, roles } = findUser;
      const { token, exp } = await generateToken({ email, id });
      return c.json({ id, first_name, last_name, email, authoritation: { token, exp, role_name: roles.name } });
    }
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: "unauthorize" });
  }
});
