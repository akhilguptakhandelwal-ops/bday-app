import React, { useState, useEffect } from 'react';
import { Home, Users, Upload, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BirthdayList from './components/BirthdayList';
import ImportTool from './components/ImportTool';
import TemplateManager from './components/TemplateManager';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'list': return <BirthdayList />;
      case 'import': return <ImportTool />;
      case 'settings': return <TemplateManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Bday Wishes</h1>
        <p>Never miss a celebration</p>
      </header>

      <main className="container">
        {renderView()}
      </main>

      <nav className="nav-bar">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={24} />
          <span>Home</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <Users size={24} />
          <span>People</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          <Upload size={24} />
          <span>Import</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={24} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
