import { prisma } from "../database/db";

async function find(id: string) {
  return await prisma.users.findUnique({
    where: { id: id },
    select: {
      first_name: true,
      last_name: true,
      email: true,
    },
  });
}

async function findByEmail(email: string) {
  return await prisma.users.findUnique({
    where: { email: email },
  });
}

async function findByRefreshToken(refreshToken: string) {
  return await prisma.users.findUnique({
    where: { refresh_token: refreshToken },
  });
}

async function save(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: "CUSTOMER" | "SELLER",
) {
  return prisma.users.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: role,
    },
  });
}

async function updateRefreshToken(id: string, refreshToken: string | null) {
  return prisma.users.update({
    where: { id: id },
    data: {
      refresh_token: refreshToken,
    },
  });
}

async function update(
  id: string,
  firstName: string,
  lastName: string,
  email: string,
) {
  return prisma.users.update({
    where: { id: id },
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
    },
    select: {
      first_name: true,
      last_name: true,
      email: true,
    },
  });
}

async function findPasswordByUserId(id: string) {
  return prisma.users.findUnique({
    where: { id: id },
    select: { password: true },
  });
}

async function updatePassword(id: string, newPassword: string) {
  return prisma.users.update({
    where: { id: id },
    data: {
      password: newPassword,
    },
    select: {
      first_name: true,
      last_name: true,
      email: true,
    },
  });
}

export default {
  find,
  findByEmail,
  findByRefreshToken,
  save,
  updateRefreshToken,
  update,
  findPasswordByUserId,
  updatePassword,
};
