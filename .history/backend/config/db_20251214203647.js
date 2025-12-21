import { neon } from "@neondatabase/serverless";

// Test uchun connection stringni to‘g‘ridan-to‘g‘ri yozamiz
const sql = neon(
  "postgresql://neondb_owner:npg_apMhxi0UEsg6@ep-broad-frog-a4len88u-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
);

const run = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("DB ulandi ✅", result[0]);
  } catch (err) {
    console.error("DB ulanmadı ❌", err);
  }
};

run();
