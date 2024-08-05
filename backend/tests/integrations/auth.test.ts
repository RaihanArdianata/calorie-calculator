import { describe, test, expect, beforeAll, afterEach, beforeEach } from "bun:test";
import app from "../../src";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status";
import { objectToForm } from "../util";
import { createFakeRegister, createFakeUserData } from "../fixtures/users.fixture";
import { prisma } from "../../src/bin/database";
import { create } from "../../src/services/users.service";

describe("Authorization Route /auth", () => {
  beforeAll(async () => {
    await prisma.users.deleteMany({
      where: {
        roles: {
          name: "USER"
        }
      }
    });
  });
  const userOne = createFakeUserData();
  beforeEach(async () => {
    const role = await prisma.roles.findUnique({ where: { name: "USER" }});
    await create({ ...userOne, role_id: role!.id });
  });
  afterEach(async () => {
    await prisma.users.delete({ where: { email: userOne.email } });
  });
  describe("POST /login", () => {
    test("should response 200 (OK) and login succesfully", async () => {
      const body = objectToForm({
        username: userOne.email,
        password: userOne.password
      });
      const response = await app.request("/api/auth/login", {
        method: "POST",
        body
      });
      expect(response.status).toEqual(OK);
    });

    test("should response 400 (BAD_REQUEST) if username or password didn't provided", async () => {
      const body = new FormData();
      const response = await app.request("/api/auth/login", {
        method: "POST",
        body
      });
      expect(response.status).toEqual(BAD_REQUEST);
    });

    test("should response 401 (UNAUTHORIZED) if user didn't exist", async () => {
      const body = objectToForm({
        username: "imNotExist",
        password: "imNotReallyExist123@"
      })
      const response = await app.request("/api/auth/login", {
        method: "POST",
        body
      });
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });

  describe("POST /register", () => {
    test("should response 200 (OK) and registering the user", async () => {
      const body = createFakeRegister();
      const response = await app.request("/api/auth/register", {
        method: "POST",
        body: objectToForm(body)
      });
      expect(response.status).toEqual(OK);
      const data = await response.json();
      await prisma.users.delete({ where: { id: data.result.id }});
    });
    test("should response 401 (UNAUTHORIZED) if email already taken", async () => {
      const body = createFakeRegister();
      body.email = userOne.email;
      const response = await app.request("/api/auth/register", {
        method: "POST",
        body: objectToForm(body)
      });
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });
});
