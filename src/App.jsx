import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GroupsList from './components/GroupsList';
import CreateGroup from './components/CreateGroup';
import GroupDetails from './components/GroupDetails';
import Communities from './components/Communities';
import CreateCommunity from './components/CreateCommunity';
import CommunityDetails from './components/CommunityDetails';
import { GroupProvider } from './context/GroupContext';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <GroupProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
              <div className="px-4 py-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/groups" element={<GroupsList />} />
                <Route path="/groups/create" element={<CreateGroup />} />
                <Route path="/groups/:id" element={<GroupDetails />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/communities/create" element={<CreateCommunity />} />
                <Route path="/communities/:id" element={<CommunityDetails />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </GroupProvider>
  );
}

export default App;