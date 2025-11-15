'use client';

import { createNewEntry } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const NewEntryCard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    setIsLoading(true);
    try {
      const data = await createNewEntry();
      if (data && data.id) {
        router.push(`/journal/${data.id}`);
      } else {
        console.error('Data does not contain id:', data);
        alert('Failed to create new entry. Please try again.');
      }
    } catch (error) {
      console.error('Error creating new entry:', error);
      alert('Failed to create new entry. Please try again.');
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <>
    {isLoading && (
       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
       <div className="bg-white rounded-lg p-8 shadow-md">
       <Loader2 className="mr-2 h-20 w-20 animate-spin" /> 
       </div>
     </div>
    )}
    <div
      className="cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg
      border border-[#E2DFD0]/30 shadow-lg hover:shadow-2xl transition-all duration-300
      hover:bg-gradient-to-b transform hover:scale-105 flex items-center justify-center"
      onClick={handleOnClick}
    >
      <div className="px-6 py-8 sm:p-10 flex gap-5 justify-between items-center">
        <span className="text-2xl md:text-xl font-semibold text-zinc-950">New Entry</span>
        <Image src="/plus-icon.svg" alt="plus-img" width={50} height={50} />
      </div>
    </div>
    </>
  );
};

export default NewEntryCard;
