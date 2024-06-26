"use server"

import prisma from "@/lib/db"
// Assuming prisma is an instance of PrismaClient

// Function to get all entries from the 'Generated' table
async function getAllGenerated() {
  return await prisma.wF_Generated.findMany()
}

// Function to create a new entry in the 'Generated' table
async function createGenerated(input: any) {
  return await prisma.wF_Generated.create({
    data: input,
  })
}

// Function to update an entry in the 'Generated' table
async function updateGenerated(input: any) {
  const { id, ...data } = input
  return await prisma.wF_Generated.update({
    where: { id },
    data,
  })
}

// Function to delete an entry from the 'Generated' table
async function deleteGenerated(id: string) {
  return await prisma.wF_Generated.delete({
    where: { id },
  })
}
async function getAllGeneratedByUserId(userId: string) {
  return await prisma.wF_Generated.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc", // Sorts by createdAt date, earliest first
    },
  })
}
async function getAllGeneratedByUserIdType(userId: string, type: string) {
  return await prisma.wF_Generated.findMany({
    where: {
      userId: userId,
      type: type,
    },
    orderBy: {
      createdAt: "desc", // Sorts by createdAt date, earliest first
    },
  })
}

async function getStudiosByUserId(userId: string) {
  const studios = await prisma.wF_StudioId.findMany({
    where: {
      userId: userId,
    },
  })
  return studios
}

export {
  getAllGenerated,
  getAllGeneratedByUserId,
  updateGenerated,
  createGenerated,
  deleteGenerated,
  getAllGeneratedByUserIdType,
  getStudiosByUserId,
}
