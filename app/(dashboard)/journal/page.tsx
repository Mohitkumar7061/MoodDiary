import { prisma } from "@/utils/db";
import { getUserByClerkID } from "@/utils/auth";
import { currentUser } from "@clerk/nextjs/server";
import { Poppins } from "next/font/google";
import NewEntryCard from "../../../components/NewEntryCard";
import EntryCard from "../../../components/EntryCard";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const getEntries = async () => {
  const user = await getUserByClerkID();
  const entries = await prisma.journal.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return entries;
};

const inter = Poppins({
  weight: "300",
  subsets: ["latin"],
});

const getGreeting = () => {
  const currentHour = parseInt(
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hourCycle: "h23", 
    }),
    10
  );

  console.log(currentHour);
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

const JournalPage = async () => {
  const entries = await getEntries();
  const user = await currentUser();
  const name = user?.firstName;
  const greeting = getGreeting();

  return (
    <div className="p-6 md:p-10 h-full bg-gradient-radial from-gray-900 via-slate-900 to-black bg-opacity-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl text-[#F5E8C7] font-semibold">
          {greeting}, {name}
        </h2>
        <div className="relative">
          <div className="absolute w-10 h-10 rounded-full bg-[#9EC8B9] top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <UserButton />
          </div>
        </div>
      </div>
      {/* <div className="relative max-w-screen">
      <div className="absolute top-26 left-[42%] w-[60%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-36 left-[29%] w-[45%] h-48  md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-6 left-[12%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 scroll-smooth p-3 gap-6 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
