import "dotenv/config";
import prisma from "../lib/prisma";
import { clerkClient } from "../lib/clerkClient";

async function main() {
  const clients = await prisma.client.findMany({ select: { id: true } });
  console.log(`${clients.length} хэрэглэгч олдлоо`);

  for (const client of clients) {
    try {
      await clerkClient.users.updateUser(client.id, {
        publicMetadata: { onboardingComplete: true },
      });
      console.log(`✅ ${client.id}`);
    } catch (err) {
      console.error(`❌ ${client.id}:`, err);
    }
  }

  console.log("Дууслаа");
  await prisma.$disconnect();
}

main();
