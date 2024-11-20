import { sql } from "../database/database.js";

const addUser = async (email, password) => {
  // await sql`INSERT INTO users (email, password) VALUES (${email}, ${password})`;
  await sql`INSERT INTO users (email, password, admin) VALUES (${email}, ${password}, ${true})`;
};

const findUserByEmail = async (email) => {
  const rows = await sql`SELECT * FROM users WHERE email=${email}`;
  return rows;
};

export { addUser, findUserByEmail };
