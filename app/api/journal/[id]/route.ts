import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { analyzeEntryWithGemini } from "@/utils/ai";

interface JournalParams {
  id: string;
}

export const PATCH = async (
  request: Request,
  { params }: { params: JournalParams }
) => {
  try {
    const { content, title } = await request.json();
    const user = await getUserByClerkID();
    const entryId = parseInt(params.id, 10);
    
    // 1. Update Journal Entry
    const updatedEntry = await prisma.journal.update({
      where: {
        userId_id: {
          userId: user.id,
          id: entryId,
        },
      },
      data: {
        content,
        title,
        updatedAt: new Date(),
      },
    });

    // 2. Generate Analysis Data using Gemini
    const analysis = await analyzeEntryWithGemini(content);

    console.log("Analysis result:", analysis);

    // 3. Upsert Analysis Record (Create or Update)
    const updatedAnalysis = await prisma.analysis.upsert({
      where: {
        entryId: updatedEntry.id,
      },
      create: {
        userId: user.id,
        entryId: updatedEntry.id,
        ...analysis,
      },
      update: analysis,
    });

    return NextResponse.json({
      data: {
        ...updatedEntry,
        analysis: updatedAnalysis,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: JournalParams }
) => {
  try {
    const user = await getUserByClerkID();
    const entryId = parseInt(params.id, 10);
    await prisma.analysis.delete({
      where: { entryId },
    });

    await prisma.journal.delete({
      where: {
        userId_id: {
          userId: user.id,
          id: entryId,
        },
      },
    });

    return NextResponse.json({
      message: "Journal entry deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json({
      error: "Failed to delete journal entry",
      status: 500,
    });
  }
};
