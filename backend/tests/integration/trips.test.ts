import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { getTestServer } from "../helpers/test-app";
import { clearDatabase, getAuthToken } from "../helpers/test-utils";

describe("Trips Module", () => {
  let server: any;
  let baseUrl: string;
  let token: string;

  beforeAll(async () => {
    const testApp = getTestServer();
    server = testApp.server;
    baseUrl = testApp.baseUrl;
    await clearDatabase();
    token = await getAuthToken(baseUrl);
  }, 30000);

  afterAll(() => {
    server.close();
  });

  let createdTripId: string;

  it("should create a new trip", async () => {
    const tripData = {
      title: "Summer Vacation",
      description: "Exploring Europe",
      startDate: new Date("2024-07-01").toISOString(),
      endDate: new Date("2024-07-15").toISOString(),
      destination: "Paris, France",
    };

    const response = await fetch(`${baseUrl}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    });

    const data = await response.json();
    console.log("Trip creation response:", JSON.stringify(data, null, 2));
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe(tripData.title);
    createdTripId = data.data.id;
    console.log("Created Trip ID:", createdTripId);
  });

  it("should get all trips for the user", async () => {
    const response = await fetch(`${baseUrl}/trips`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBe(1);
    expect(data.data[0].id).toBe(createdTripId);
  });

  it("should get a single trip by ID", async () => {
    const response = await fetch(`${baseUrl}/trips/${createdTripId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(createdTripId);
  });

  it("should update a trip", async () => {
    const updateData = {
      title: "Updated Trip Title",
    };

    const response = await fetch(`${baseUrl}/trips/${createdTripId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe(updateData.title);
  });
});
