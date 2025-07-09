import React, { useState } from 'react';
import Sidebar from './Sidebar';
import OfflineAlert from './OfflineAlert';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button 
          className="sidebar-toggle md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <OfflineAlert />
        <div className="container">
          {children}
        </div>
      </main>
      {sidebarOpen && (
        <div 
          className="overlay md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;