import { prisma } from "../src/database/db";

const userSeeds = [
  {
    id: "38f22651-704f-40c0-beb6-a386ab043912",
    first_name: "Khairul",
    last_name: "Ikhwan",
    email: "wan@mail.com",
    password: "$2b$12$ziZAfhtJqxULBPVaeFFP0.z2x6rsQP0pA7D4kkBXwcZUS63SJGUl2",
    role: "CUSTOMER",
    refresh_token: null,
  },
  {
    id: "de129c53-fa58-4be2-bb18-69e4b6c45232",
    first_name: "Ahmad",
    last_name: "Haziq",
    email: "haziq@mail.com",
    password: "$2b$12$ziZAfhtJqxULBPVaeFFP0.z2x6rsQP0pA7D4kkBXwcZUS63SJGUl2",
    role: "SELLER",
    refresh_token: null,
  },
  {
    id: "rw249c53-fa58-4be2-ar17-69e4b6c54321",
    first_name: "Ahmad",
    last_name: "Messi",
    email: "messi@mail.com",
    password: "$2b$12$ziZAfhtJqxULBPVaeFFP0.z2x6rsQP0pA7D4kkBXwcZUS63SJGUl2",
    role: "SELLER",
    refresh_token: null,
  },
];

const cafeSeeds = [
  {
    id: "1",
    name: "Makcik Fav",
    description: "Jual ayam penyet terbaik di kypj.",
    image: "example.jpg",
    block: "A",
    lot: "03",
    is_open: true,
    seller_id: "de129c53-fa58-4be2-bb18-69e4b6c45232",
  },
  {
    id: "2",
    name: "Ali Baba",
    description: "Mamak yang selalu takde air.",
    image: "example.jpg",
    block: "B",
    lot: "01",
    is_open: true,
    seller_id: "rw249c53-fa58-4be2-ar17-69e4b6c54321",
  },
];

const categorySeeds = [
  {
    id: "1",
    name: "Nasi",
  },
  {
    id: "2",
    name: "Air",
  },
  {
    id: "3",
    name: "Roti",
  },
];

const itemSeeds = [
  {
    id: "1",
    name: "Nasi Putih",
    description: "this is nasi putih",
    price: 1.5,
    image: "example.jpg",
    is_available: true,
    cafe_id: "1",
    category_id: "1",
  },
  {
    id: "2",
    name: "The o ais",
    description: null,
    price: 2,
    image: "example.jpg",
    is_available: true,
    cafe_id: "1",
    category_id: "2",
  },
  {
    id: "3",
    name: "Nasi Kandarrr",
    description: "Surrr",
    price: 7,
    image: "example.jpg",
    is_available: true,
    cafe_id: "2",
    category_id: "1",
  },
  {
    id: "4",
    name: "Roti Canai",
    description: null,
    price: 2,
    image: "example.jpg",
    is_available: true,
    cafe_id: "2",
    category_id: "3",
  },
];

const seed = async (users: any, cafes: any, categories: any, items: any) => {
  console.log("Creating users...");
  for (let i = 0; i < users.length; i++) {
    await prisma.users.upsert({
      where: { id: users[i].id },
      update: users[i],
      create: users[i],
    });
  }

  console.log("Creating cafes...");
  for (let i = 0; i < cafes.length; i++) {
    await prisma.cafes.upsert({
      where: { id: cafes[i].id },
      update: cafes[i],
      create: cafes[i],
    });
  }

  console.log("Creating categories...");
  for (let i = 0; i < categories.length; i++) {
    await prisma.category.upsert({
      where: { id: categories[i].id },
      update: categories[i],
      create: categories[i],
    });
  }

  console.log("Creating items...");
  for (let i = 0; i < items.length; i++) {
    await prisma.items.upsert({
      where: { id: items[i].id },
      update: items[i],
      create: items[i],
    });
  }
};

seed(userSeeds, cafeSeeds, categorySeeds, itemSeeds)
  .then(() => {
    console.log(
      "Created/Updated users, cafes, categories, and items successfully",
    );
  })
  .catch((error) => {
    console.error("Error: ", error);
  })
  .finally(() => {
    prisma.$disconnect();
    console.log("Disconnected Prisma Client, exiting.");
  });
