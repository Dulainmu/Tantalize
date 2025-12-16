
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple Header */}
      <header className="p-4 flex items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        <h1 className="text-lg font-bold tracking-widest text-blue-500">TANTALIZE <span className="text-white">SCAN</span></h1>
      </header>
      
      {/* Content Area */}
      <main className="pt-16"> 
        {children}
      </main>
    </div>
  );
}
