'use client';
import { useState, useRef, useEffect } from 'react';
import { updateEntry, deleteEntry } from '../utils/api';
import { Loader2, Trash2, Save, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface JournalEntry {
  id: number;
  content: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const Editor = ({ entry }: { entry: JournalEntry }) => {
  const [value, setValue] = useState(entry.content);
  const [titleValue, setTitleValue] = useState(entry.title);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const router = useRouter();

  // Track last saved values
  const lastSavedContent = useRef(entry.content);
  const lastSavedTitle = useRef(entry.title);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced autosave effect
  useEffect(() => {
    // Only autosave if content or title changed
    if (
      value !== lastSavedContent.current ||
      titleValue !== lastSavedTitle.current
    ) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        setIsLoading(true);
        setSaveError(null);
        try {
          await updateEntry(entry.id, value, titleValue);
          lastSavedContent.current = value;
          lastSavedTitle.current = titleValue;
        } catch (error) {
          setSaveError('Failed to autosave. Please try again.');
          console.error('Autosave failed:', error);
        } finally {
          setIsLoading(false);
        }
      }, 1000); // 1 second debounce
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, titleValue, entry.id]);

  const handleManualSave = async () => {
    setIsLoading(true);
    setSaveError(null);
    try {
      await updateEntry(entry.id, value, titleValue);
      lastSavedContent.current = value;
      lastSavedTitle.current = titleValue;
      router.push('/journal');
    } catch (error) {
      setSaveError('Failed to save manually. Please try again.');
      console.error('Manual save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setSaveError(null);

    try {
      setShowConfirm(false);
      await deleteEntry(entry.id);
      router.push('/journal');
    } catch (error) {
      setSaveError('Failed to delete entry. Please try again.');
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
    }
  };

  const date = entry.createdAt;
  const formattedDate = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Deletion Overlay */}
      <AnimatePresence>
        {isDeleting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gray-800 rounded-2xl p-8 shadow-2xl text-center"
            >
              <Loader2 className="mx-auto mb-4 h-16 w-16 text-blue-500 animate-spin" />
              <p className="text-lg text-gray-300">Deleting entry...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center mb-4">
                <AlertTriangle className="mr-3 text-yellow-500 h-8 w-8" />
                <h2 className="text-xl font-semibold text-white">Confirm Deletion</h2>
              </div>
              <p className="text-gray-300 mb-6">Are you absolutely sure you want to delete this journal entry? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor Container */}
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-400">Journal Entry</p>
            <h1 className="text-2xl font-bold text-gray-100">{formattedDate}</h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={handleDeleteClick}
              disabled={isLoading}
              className="group flex items-center px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Delete
            </button>
            <button 
              onClick={handleManualSave}
              disabled={isLoading}
              className="group flex items-center px-4 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              )}
              Save
            </button>
          </div>
        </div>

        {/* Error Message */}
        {saveError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600/20 border-l-4 border-red-500 p-4 mb-6 text-red-300"
          >
            {saveError}
          </motion.div>
        )}

        {/* Title Input */}
        <input
          type="text"
          placeholder="Entry Title"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          className="w-full text-3xl font-bold bg-transparent border-b border-gray-700 focus:border-blue-500 outline-none mb-6 pb-2 text-white placeholder-gray-500 transition-colors"
        />

        {/* Content Textarea */}
        <textarea
          placeholder="Write your thoughts here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full min-h-[500px] bg-gray-800/50 rounded-xl p-6 text-lg outline-none resize-none border border-gray-700 focus:border-blue-500 transition-colors text-gray-100 placeholder-gray-500"
        />
      </div>
    </div>
  );
};

export default Editor;