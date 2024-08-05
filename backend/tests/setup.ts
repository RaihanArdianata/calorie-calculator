import { mock } from "bun:test";
import { prisma } from "../src/bin/database";

mock.module("../src/bin/database.ts", async () => {
  // TODO: Creeate PrismaCLient Mock
  return {
    prisma
  }
});
