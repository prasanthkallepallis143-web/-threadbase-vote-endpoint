import prisma from "./lib/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Abhinav",
    },
  });

  const posts = await prisma.post.createMany({
    data: [
      {
        title: "First Post",
        body: "This is the first post.",
      },
      {
        title: "Second Post",
        body: "This is the second post.",
      },
    ],
  });

  console.log("User created:", user);
  console.log("Posts created:", posts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });