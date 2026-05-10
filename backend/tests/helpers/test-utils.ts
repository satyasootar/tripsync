import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prisma from "@/config/database";

// In a real project, we would use something like this for unit tests
// export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

export const clearDatabase = async () => {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tablesToTruncate = tablenames
    .map(t => t.tablename)
    .filter(name => name !== "_prisma_migrations")
    .map(name => `"${name}"`)
    .join(", ");

  if (tablesToTruncate) {
    try {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE ${tablesToTruncate} CASCADE;`
      );
    } catch (error) {
      console.log("Error clearing database:", error);
    }
  }
};

export const getAuthToken = async (baseUrl: string, userData = {
  email: "test@example.com",
  password: "Password123!",
  firstName: "Test",
  lastName: "User"
}) => {
  // Try to register first (ignore error if exists)
  await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userData.email, password: userData.password }),
  });

  const data = await response.json();
  return data.data.tokens.accessToken;
};

export const getAuthContext = async (baseUrl: string, userData = {
  email: `test-${Date.now()}@example.com`,
  password: "Password123!",
  firstName: "Test",
  lastName: "User"
}) => {
  await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userData.email, password: userData.password }),
  });

  const data = await response.json();
  return {
    token: data.data.tokens.accessToken,
    user: data.data.user
  };
};
