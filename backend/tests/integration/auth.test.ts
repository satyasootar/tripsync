import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { getTestServer } from "../helpers/test-app";
import { clearDatabase } from "../helpers/test-utils";

describe("Auth Module", () => {
  let server: any;
  let baseUrl: string;

  beforeAll(async () => {
    const testApp = getTestServer();
    server = testApp.server;
    baseUrl = testApp.baseUrl;
    await clearDatabase();
  }, 30000);

  afterAll(() => {
    server.close();
  });

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: "Password123!",
    firstName: "Test",
    lastName: "User",
  };

  it("should register a new user", async () => {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe(testUser.email);
    expect(data.data.user.password).toBeUndefined();
  });

  it("should login with correct credentials", async () => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.tokens.accessToken).toBeDefined();
    expect(data.data.user.email).toBe(testUser.email);
  });

  it("should not login with wrong password", async () => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: "wrong-password",
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });
});
