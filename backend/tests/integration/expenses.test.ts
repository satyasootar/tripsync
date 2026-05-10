import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { getTestServer } from "../helpers/test-app";
import { clearDatabase, getAuthContext } from "../helpers/test-utils";

describe("Expenses Module", () => {
  let server: any;
  let baseUrl: string;
  let token: string;
  let userId: string;
  let tripId: string;
  let expenseId: string;

  beforeAll(async () => {
    const testApp = getTestServer();
    server = testApp.server;
    baseUrl = testApp.baseUrl;
    await clearDatabase();
    const context = await getAuthContext(baseUrl);
    token = context.token;
    userId = context.user.id;

    // Create a trip
    const tripRes = await fetch(`${baseUrl}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Expense Trip",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        destination: "Money City",
      }),
    });
    const tripData = await tripRes.json();
    tripId = tripData.data.id;
  }, 30000);

  afterAll(() => {
    server.close();
  });

  it("should create an expense", async () => {
    const response = await fetch(`${baseUrl}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        tripId,
        amount: 100.50,
        currency: "USD",
        description: "Dinner",
        date: new Date().toISOString(),
        paidById: userId,
        splitType: "EQUAL",
        participants: [
          { userId, amount: 100.50 }
        ]
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.amount.toString()).toBe("100.5"); // Prisma Decimal might return string or float
    expenseId = data.data.id;
  });

  it("should get all expenses for a trip", async () => {
    const response = await fetch(`${baseUrl}/expenses/trip/${tripId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.data.length).toBe(1);
  });
});
