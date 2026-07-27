import { hash } from "bcryptjs";
import { prisma } from "../src/client.js";

const adminPasswordHash = await hash("admin", 12);

try {
  await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {},
    create: {
      username: "admin",
      passwordHash: adminPasswordHash,
      displayName: "Admin",
    },
  });
} finally {
  await prisma.$disconnect();
}
