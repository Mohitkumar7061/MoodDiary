import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { analyzeEntryWithGemini } from "@/utils/ai";

export const POST = async () => {
  const user = await getUserByClerkID();
  const entry = await prisma.journal.create({
    data: {
      userId: user.id,
      content: "Write about your day!",
      title: "Entry Title",
    },
  });

  // Use the Gemini API to analyze the entry content
  const analysis = await analyzeEntryWithGemini(entry.content);

  await prisma.analysis.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      entry: {
        connect: {
          id: entry.id,
        },
      },
      ...analysis,
    },
  });

  revalidatePath("/journal");

  return NextResponse.json({ data: entry });
};