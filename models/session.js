import database from "infra/database";
import crypto from "crypto";

const EXPIRATION_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30; // 30 days

async function findOneValidByToken(sessionToken) {
  const sessionFound = await runSelectQuery(sessionToken);
  return sessionFound;

  async function runSelectQuery(sessionToken) {
    const result = await database.query({
      text: `SELECT * 
              FROM sessions 
              WHERE token = $1 
              AND expires_at > NOW()
              LIMIT 1
              ;`,
      values: [sessionToken],
    });
    return result.rows[0];
  }
}

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex"); // 48 * 2 =  96 characters
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const newSession = await database.query({
      text: `INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *`,
      values: [token, userId, expiresAt],
    });
    return newSession.rows[0];
  }
}

const session = { create, EXPIRATION_IN_MILLISECONDS, findOneValidByToken };

export default session;
