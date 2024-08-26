import database from "infra/database";
import orchestrator from "../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With uniqu eand valid data", async () => {
      await database.query({
        text: "INSERT INTO users(username, email, password) VALUES ($1, $2, $3)",
        values: ["pedro", "pedro@pedro.com", "123456"],
      });
      await database.query({
        text: "INSERT INTO users(username, email, password) VALUES ($1, $2, $3)",
        values: ["pedro2", "Pedro@pedro.com", "123456"],
      });
      const user = await database.query({
        text: "SELECT * FROM users",
      });
      console.log(user.rows);

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });

      expect(response.status).toBe(201);
    });
  });
});
