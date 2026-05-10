import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { getTestServer } from "../helpers/test-app";
import { clearDatabase, getAuthToken } from "../helpers/test-utils";

describe("Checklists Module", () => {
  let server: any;
  let baseUrl: string;
  let token: string;
  let tripId: string;
  let checklistId: string;

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
        title: "Checklist Trip",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        destination: "List City",
      }),
    });
    const tripData = await tripRes.json();
    tripId = tripData.data.id;
  }, 30000);

  afterAll(() => {
    server.close();
  });

  it("should create a checklist", async () => {
    const response = await fetch(`${baseUrl}/checklists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        tripId,
        title: "Packing List",
        type: "PACKING",
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    checklistId = data.data.id;
  });

  it("should add an item to checklist", async () => {
    const response = await fetch(`${baseUrl}/checklists/${checklistId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: "Passport",
        position: 1,
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.data.content).toBe("Passport");
  });

  it("should get all checklists for a trip", async () => {
    const response = await fetch(`${baseUrl}/checklists/trip/${tripId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
