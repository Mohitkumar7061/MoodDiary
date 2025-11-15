import React from 'react';
import { prisma } from '@/utils/db';
import { Smile, Frown, Meh, ArrowUpRight } from 'lucide-react';

interface EntryCardProps {
  id: number;
  content: string;
  createdAt: Date;
  title: string;
  updatedAt: Date;
}

const getMoodIcon = (mood: string | null | undefined) => {
  switch (mood?.toLowerCase()) {
    case 'happy':
      return <Smile className="text-green-400" />;
    case 'sad':
      return <Frown className="text-red-400" />;
    default:
      return <Meh className="text-neutral-400" />;
  }
};

const EntryCard = async ({ entry }: { entry: EntryCardProps }) => {
  const date = new Date(entry.createdAt);
  const entryid = entry.id;
  const analysis = await prisma.analysis.findUnique({
    where: {
      entryId: entryid,
    },
  });
  const sentimentScore = analysis?.sentimentScore;
  const mood = analysis?.mood;
  const color = analysis?.color;
  const title = entry.title;
  const content = entry.content;

  // Format date and time with India timezone (Asia/Kolkata)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  };
  
  const formattedDate = date.toLocaleString('en-IN', options);
  const [datePart, timePart] = formattedDate.split(',').map(item => item.trim());
  
  return (
    <div 
      className="
        group relative 
        max-w-sm h-72 
        rounded-2xl 
        overflow-hidden 
        bg-gradient-to-br from-neutral-800 to-neutral-900
        border border-neutral-700/50
        shadow-xl
        transition-all duration-300 
        hover:scale-[1.03] 
        hover:shadow-2xl
        hover:border-neutral-600/70
        cursor-pointer
      "
    >
      {/* Decorative Gradient Overlay */}
      <div 
        className="
          absolute 
          top-0 left-0 right-0 
          h-1/3 
          bg-gradient-to-r 
          from-blue-500/30 
          via-purple-500/30 
          to-pink-500/30 
          opacity-50 
          blur-2xl
        "
      />

      {/* Main Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header with Date and Mood */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-neutral-400 text-sm">
            {datePart}
          </div>
          <div className="flex items-center gap-2">
            {getMoodIcon(mood)}
            <span className="text-xs text-neutral-300 capitalize">
              {mood || 'Neutral'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="
            text-xl 
            font-bold 
            text-white 
            mb-3 
            line-clamp-2 
            group-hover:text-blue-300 
            transition-colors
          "
        >
          {title}
        </h3>

        {/* Content Preview */}
        <p 
          className="
            text-neutral-400 
            text-sm 
            mb-4 
            flex-grow 
            line-clamp-3
          "
        >
          {analysis?.summary || content}
        </p>

        {/* Footer with Sentiment and Link */}
        <div className="flex justify-between items-center mt-auto">
          {sentimentScore !== undefined && (
            <div 
              className="
                text-xs 
                px-3 py-1 
                rounded-full 
                bg-neutral-700/50 
                text-neutral-300
              "
            >
              Sentiment: {sentimentScore.toFixed(2)}
            </div>
          )}
          
          <div 
            className="
              ml-auto 
              p-2 
              rounded-full 
              bg-neutral-700/50 
              text-neutral-300 
              hover:bg-blue-500/30 
              hover:text-white 
              transition-all 
              group-hover:scale-110
            "
          >
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntryCard;