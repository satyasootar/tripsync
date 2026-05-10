import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { getTestServer } from "../helpers/test-app";
import { clearDatabase, getAuthToken } from "../helpers/test-utils";

describe("Days & Activities Module", () => {
  let server: any;
  let baseUrl: string;
  let token: string;
  let tripId: string;
  let dayId: string;

  beforeAll(async () => {
    const testApp = getTestServer();
    server = testApp.server;
    baseUrl = testApp.baseUrl;
    await clearDatabase();
    token = await getAuthToken(baseUrl);

    // Create a trip first
    const tripRes = await fetch(`${baseUrl}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Test Trip",
        startDate: new Date("2024-01-01").toISOString(),
        endDate: new Date("2024-01-10").toISOString(),
        destination: "Test City",
      }),
    });
    const tripData = await tripRes.json();
    tripId = tripData.data.id;
  }, 30000);

  afterAll(() => {
    server.close();
  });

  describe("Days", () => {
    it("should get all days for a trip", async () => {
      const response = await fetch(`${baseUrl}/days/trip/${tripId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should create a day", async () => {
      const response = await fetch(`${baseUrl}/days/trip/${tripId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: new Date("2024-01-01T00:00:00Z").toISOString(),
          position: 1,
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      dayId = data.data.id;
    });
  });

  describe("Activities", () => {
    let activityId: string;

    it("should create an activity", async () => {
      const response = await fetch(`${baseUrl}/activities/day/${dayId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Visit Eiffel Tower",
          startTime: new Date("2024-01-01T10:00:00Z").toISOString(),
          endTime: new Date("2024-01-01T12:00:00Z").toISOString(),
          location: "Paris",
          position: 1,
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      activityId = data.data.id;
    });

    it("should get activities for a day", async () => {
      const response = await fetch(`${baseUrl}/activities/day/${dayId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.status !== 200) {
        const text = await response.text();
        console.log("Get activities error response:", text);
      }
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should update an activity", async () => {
      const response = await fetch(`${baseUrl}/activities/${activityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "Updated Activity" }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.data.title).toBe("Updated Activity");
    });
  });
});
