'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Menu, Home, BookOpen, Clock } from 'lucide-react';

const links = [
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/history', label: 'History', icon: Clock },
];

const SidebarToggle = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-[1100] p-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[999] md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] 
          bg-white dark:bg-neutral-900 
          shadow-2xl border-r border-neutral-200 dark:border-neutral-800
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 z-[1000]
        `}
      >
        {/* Sidebar Header */}
        <div className='flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800'>
          <div className='flex items-center gap-3'>
            <Image
              src="/logo.svg"
              alt="Mood Diary Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="text-xl font-bold text-neutral-800 dark:text-white">
              Mood Diary
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            className="md:hidden text-neutral-600 dark:text-neutral-300 hover:text-red-500 transition-colors" 
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="py-4">
          <ul className="space-y-2 px-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="
                      flex items-center gap-3 
                      px-4 py-3 
                      text-neutral-600 dark:text-neutral-300
                      hover:bg-neutral-100 dark:hover:bg-neutral-800
                      rounded-lg 
                      transition-all duration-300 
                      group
                    "
                  >
                    <Icon 
                      size={20} 
                      className="
                        text-neutral-500 dark:text-neutral-400 
                        group-hover:text-blue-500 
                        transition-colors
                      " 
                    />
                    <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div 
          className="
            absolute bottom-0 left-0 right-0 
            p-6 
            border-t border-neutral-200 dark:border-neutral-800
            bg-neutral-50 dark:bg-neutral-900
          "
        >
          <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
            <div>
              Developed by <span className="font-semibold text-neutral-800 dark:text-white">Adarsh</span>
            </div>
            <p className="text-xs">
              <span className="font-bold">© </span>
              Copyright <span className="font-semibold">2024</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarToggle;