import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="relative text-white min-h-screen font-sans antialiased selection:bg-[#BAFF39] selection:text-black grainy-bg overflow-x-hidden bg-transparent">
      <Header />
      <main className="relative z-10 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
