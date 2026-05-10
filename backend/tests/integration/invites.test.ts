import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { getTestServer } from "../helpers/test-app";
import { clearDatabase, getAuthToken } from "../helpers/test-utils";

describe("Invites Module", () => {
  let server: any;
  let baseUrl: string;
  let token: string;
  let tripId: string;

  beforeAll(async () => {
    const testApp = getTestServer();
    server = testApp.server;
    baseUrl = testApp.baseUrl;
    await clearDatabase();
    token = await getAuthToken(baseUrl);

    const tripRes = await fetch(`${baseUrl}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Invite Trip",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        destination: "Invite City",
      }),
    });
    const tripData = await tripRes.json();
    tripId = tripData.data.id;
  }, 30000);

  afterAll(() => {
    server.close();
  });

  it("should create an invite", async () => {
    const response = await fetch(`${baseUrl}/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        tripId,
        email: "friend@example.com",
        role: "EDITOR",
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.data.email).toBe("friend@example.com");
  });

  it("should get all invites for a trip", async () => {
    const response = await fetch(`${baseUrl}/invites/trip/${tripId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.data.length).toBe(1);
  });
});
