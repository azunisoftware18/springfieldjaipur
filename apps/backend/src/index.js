import app from "./app.js";
import { envConfig } from "./config/env.config.js";
import prisma from "./db/db.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

(async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    const PORT = envConfig.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup error:", error);
    process.exit(1);
  }
})();
