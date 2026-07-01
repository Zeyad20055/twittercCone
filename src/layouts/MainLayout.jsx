// ============================================================
// MAIN LAYOUT - الـ layout الرئيسي مع Sidebar و Navbar
// ============================================================

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="lg:ml-64 xl:ml-72">
        {/* Top padding for mobile top bar */}
        <div className="lg:hidden h-14" />

        {/* Content Area */}
        <div className="max-w-2xl mx-auto border-x border-twitter-border min-h-screen">
          <Outlet />
        </div>

        {/* Bottom padding for mobile bottom nav */}
        <div className="lg:hidden h-16" />
      </main>
    </div>
  );
};

export default MainLayout;
