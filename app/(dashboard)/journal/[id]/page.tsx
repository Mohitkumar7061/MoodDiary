import Editor from "@/components/Editor";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { notFound } from "next/navigation";

const getEntry = async (id: number) => {
  const user = await getUserByClerkID();

  const entry = await prisma.journal.findUnique({
    where: {
      id: id, // Pass the number directly
      userId: user.id,
    },
  });

  return entry;
};

const EntryPage = async ({ params }: { params: { id: string } }) => {
  // 1. Parse the `id` from the URL parameter to an integer:
  const entryId = parseInt(params.id, 10);

  if (isNaN(entryId)) {
    // Handle invalid IDs (e.g., not a number)
    notFound();
  }

  // 2. Now pass the parsed `entryId` to `getEntry`:
  const entry = await getEntry(entryId);

  if (!entry) {
    // Handle entries not found (optional)
    notFound();
  }

  return (
    <div className="h-full w-full  bg-gradient-radial from-gray-900 via-slate-900 to-black bg-opacity-100   overflow-y-auto scrollbar-thin scrollbar-thumb-rounded">
      <div>
      {/* <div className="relative max-w-screen">
      <div className="absolute top-32 left-[45%] w-[55%] h-60 md:w-64 md:h-64 lg:w-60 lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 left-[32%] w-[45%] h-48  md:w-64 md:h-64 lg:w-64 lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-10 left-[20%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-100"></div>
      </div> */}
      <div >
 <Editor entry={entry} />

      </div>
       
      </div>
    </div>
  );
};

export default EntryPage;
