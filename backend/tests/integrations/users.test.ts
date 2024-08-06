import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { createFakeUserData } from "../fixtures/users.fixture";
import { prisma } from "../../src/bin/database";
import { generateToken } from "../../src/utils/jwt";
import app from "../../src";
import { OK, UNAUTHORIZED } from "http-status";
import { objectToForm } from "../util";

describe("Users Route /users", () => {
  const users = new Array(10).fill(0).map(_ => createFakeUserData());
  let usersData = [] as { id: string; email: string; }[];
  let token: string;
  let userToken: string;
  beforeAll(async () => {
    const role = await prisma.roles.findUnique({ where: { name: "USER" } });
    usersData = await prisma.users.createManyAndReturn({
      skipDuplicates: true,
      data: users.map(x => ({ ...x, role_id: role!.id })),
      select: { id: true, email: true }
    });
    const admin = await prisma.users.findFirst({ where: { roles: { name: "ADMINISTRATOR" } }, select: { id: true, email: true } });
    token = (await generateToken({ email: admin!.email, id: admin!.id })).token;
    userToken = (await generateToken({ email: usersData[0].email, id: usersData[0].id })).token;

  });
  afterAll(async () => {
    await prisma.users.deleteMany({ where: { id: { in: usersData.map(x => x.id) } } });
  });
  describe("GET", () => {
    test("should response 200 (OK) and succesfully retrieve users list", async () => {
      const response = await app.request("/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      expect(response.status).toEqual(OK);
    });
  });
  describe("DELETE", () => {
    test("should response 200 (OK) and succesfully delete user", async () => {
      const response = await app.request("/api/users", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: objectToForm({ id: usersData[1].id })
      });
      expect(response.status).toEqual(OK);
      const user = await prisma.users.findFirst({ where: { id: usersData[1].id } });
      expect(user).toBeNil();
    });

    test("should response 401 (UNAUTHORIZED) when token i'snt admin token", async () => {
      const response = await app.request("/api/users", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });
  describe("POST", () => {
    test("should response 200 (OK) and succesfully create user", async () => {
      const role = await prisma.roles.findUnique({ where: { name: "USER" } });
      const user = createFakeUserData();
      const response = await app.request("/api/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: objectToForm({ ...user, role_id: role!.id }),
      });
      expect(response.status).toEqual(OK);
      const body = await response.json();
      usersData.push({ email: body.data.email, id: body.data.id });
      const data = await prisma.users.findFirst({ where: { id: body.data.id } });
      expect(data).toBeDefined();
    });

    test("should response 401 (UNAUTHORIZED) when token i'snt admin token", async () => {
      const response = await app.request("/api/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });
});
