import { sql } from "./config/db.js";

async function testDB() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("DB ulandi ✅", result[0]);
  } catch (err) {
    console.error("DB ulanmadı ❌", err);
  }
}

testDB();
