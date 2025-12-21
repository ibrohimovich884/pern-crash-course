import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  // SSL qismi Neon uchun majburiy:
  ssl: {
    rejectUnauthorized: false, 
  },
});

/**
 * Neon'dagi `sql` ga o‘xshash API
 */
pool.query("SELECT 1")
  .then(() => console.log("Postgres ulanish OK"))
  .catch(err => {
    console.error("Postgres ulanish XATO");
    console.error(err.message);
  });

export const sql = async (strings, ...values) => {
  const text = strings.reduce(
    (acc, str, i) => acc + str + (values[i] !== undefined ? `$${i + 1}` : ""),
    ""
  );

  const result = await pool.query(text, values);
  return result.rows;
};

export { pool };