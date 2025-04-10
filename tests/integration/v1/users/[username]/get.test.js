import orchestrator from "../../../../orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "mesmoCase",
          email: "mesmoCase@gmail.com",
          password: "123456",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/mesmoCase",
      );
      expect(response2.status).toBe(200);
      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "mesmoCase",
        email: "mesmoCase@gmail.com",
        password: "123456",
        createdAt: responseBody.createdAt,
        updatedAt: responseBody.updatedAt,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.createdAt)).not.toBeNaN();
      expect(Date.parse(responseBody.updatedAt)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "caseDiferente",
          email: "caseDiferente@gmail.com",
          password: "123456",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );
      expect(response2.status).toBe(200);
      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "caseDiferente",
        email: "caseDiferente@gmail.com",
        password: "123456",
        createdAt: responseBody.createdAt,
        updatedAt: responseBody.updatedAt,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.createdAt)).not.toBeNaN();
      expect(Date.parse(responseBody.updatedAt)).not.toBeNaN();
    });

    test("With noexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/usuarioNaoExistente",
      );
      expect(response.status).toBe(404);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username está digitado corretamente",
        statusCode: 404,
      });
    });
  });
});
