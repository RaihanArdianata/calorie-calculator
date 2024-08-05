import { faker } from "@faker-js/faker";
import { registerSchemaType } from "../../src/utils/validator/auth.validator";
import { CreateSchemaType } from "../../src/utils/validator/users.validator";

const password = "examplePassword@123";

export const createFakeRegister = (): registerSchemaType => {
  return {
    phone: faker.phone.number(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password,
  }
}

export const createFakeUserData = (): Omit<CreateSchemaType, "role_id"> => {
  return {
    password,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    phone: faker.phone.number(),
  }
}
