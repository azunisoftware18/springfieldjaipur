import "dotenv/config";   // ← This must be the FIRST line
import prisma from "../src/db/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding started...");

  const adminEmail = "admin@example.com";

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await prisma.user.create({
      data: {
        fullName: "Super Admin",
        email: adminEmail,
        phone: "9999999999",
        role: "ADMIN",
        password: hashedPassword,
      },
    });

    console.log("✅ Admin created successfully:", admin.email);
  } catch (error) {
    console.error("❌ Error during seeding:", error.message);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });