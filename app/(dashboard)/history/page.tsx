import HistoryChart from "../../../components/HistoryChart";
import { getUserByClerkID } from '../../../utils/auth';
import { prisma } from '../../../utils/db';
import React from "react";

const getData = async () => {
  const user = await getUserByClerkID();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const sum = analyses.reduce((all, current) => all + current.sentimentScore, 0);
  const avg = analyses.length > 0 ? Math.round(sum / analyses.length) : 0;
  return { analyses, avg };
};

const History = async () => {
  const { avg, analyses } = await getData();

  return (
    <div className="w-full h-full p-4 bg-gradient-radial from-gray-900 via-slate-900 to-black bg-opacity-100">
      <div className="relative max-w-screen">
        <div className="text-3xl md:text-xl items-center sm:text-lg p-3 text-[#F5E8C7] font-semibold">
          {`Avg. Sentiment: ${avg}`}
        </div>
        <div className="w-full h-5/6">
          <HistoryChart data={analyses} />
        </div>
      </div>
    </div>
  );
};

export default History;