"use server"

import prisma from "@/lib/db"
// Assuming prisma is an instance of PrismaClient

async function fetchPromptByGenId(genId: string) {
  const prompt = await prisma.wF_Prompt.findUnique({
    where: {
      genId,
    },
  })
  return prompt
}
async function fetchPromptsByUserId(userId: string) {
  const prompts = await prisma.wF_Prompt.findMany({
    where: {
      userId,
    },
  })
  return prompts
}
async function createPrompt(content: string, userId: string, genId: string) {
  const newPrompt = await prisma.wF_Prompt.create({
    data: {
      content,
      userId,
      genId,
    },
  })
  return newPrompt
}

export { fetchPromptByGenId, fetchPromptsByUserId, createPrompt }
