import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Makkah & Madinah background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Makkah - left half */}
        <div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Madinah - right half */}
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* App content */}
      <div className="relative z-10 flex w-full h-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-6">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}