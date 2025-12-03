"use client";

import '../../styles/globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname() || '/';

  return (
  <div className="fixed top-[15px] left-1/2 transform -translate-x-1/2 z-20 w-1/2 h-12 px-6 bg-white bg-opacity-50 border border-[#D9D9D9] rounded-xl drop-shadow-md flex items-center justify-center gap-20">
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width={80} height={40} className="h-10 w-auto" priority />
      </Link>

      <Link href="/" className="">
        {pathname === '/' ? (
          <div className="h-10 rounded-3xl flex items-center justify-center bg-gradient-to-b from-[#8B5CF6] to-[#513690] drop-shadow-md">
            <h1 className="px-5 text-white text-l font-bold truncate">Home</h1>
          </div>
        ) : (
          <div className="w-1/5 h-10 flex items-center justify-center">
            <span className="text-[#9AA3B5] text-l font-normal">Home</span>
          </div>
        )}
      </Link>

      <Link href="/timer" className={pathname === '/timer' ? 'hidden' : ''}>
        {pathname === '/timer' ? (
          <div className="h-10 rounded-3xl flex items-center justify-center bg-gradient-to-b from-[#8B5CF6] to-[#513690] drop-shadow-md">
            <h1 className="px-5 text-white text-l font-bold truncate">Timer</h1>
          </div>
        ) : (
          <div className="w-1/5 h-10 flex items-center justify-center">
              <span className="text-[#9AA3B5] text-l font-normal">Timer</span>
          </div>
        )}
      </Link>

      <Link href="/tasks" className={pathname === '/tasks' ? 'hidden' : ''}>
        {pathname === '/tasks' ? (
          <div className="h-10 rounded-3xl flex items-center justify-center bg-gradient-to-b from-[#8B5CF6] to-[#513690] drop-shadow-md">
            <h1 className="px-5 text-white text-l font-bold truncate">Tasks</h1>
          </div>
        ) : (
          <div className="w-1/5 h-10 flex items-center justify-center">
              <span className="text-[#9AA3B5] text-l font-normal">Tasks</span>
          </div>
        )}
      </Link>
    </div>
  );
}

