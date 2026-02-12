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
      const createdUser = await orchestrator.createUser({
        username: "mesmoCase",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/mesmoCase",
      );
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "mesmoCase",
        email: createdUser.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const createdUser = await orchestrator.createUser({
        username: "caseDiferente",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "caseDiferente",
        email: createdUser.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
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
