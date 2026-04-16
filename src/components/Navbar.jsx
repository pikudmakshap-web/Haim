import React, { useState, useRef, useEffect } from 'react';
import { Search, Package, Settings, Moon, Sun, UserPlus, LayoutDashboard, Database } from 'lucide-react';

const Navbar = ({ onSearch, onSearchCommit, role, toggleRole, darkMode, toggleDarkMode, onAddAdmin, currentView, setView }) => {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          background: 'var(--accent)', 
          padding: '8px', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Package size={24} color="white" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          StockTree
        </h1>
      </div>

      {role === 'admin' && (
        <div style={{ 
          flex: 1, 
          maxWidth: '600px', 
          margin: '0 40px',
          position: 'relative' 
        }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              right: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} 
          />
          <input 
            type="text" 
            placeholder="חיפוש מהיר... (Enter לאישור)"
            style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 48px 12px 16px',
              color: 'var(--text-primary)'
            }}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchCommit(e.target.value);
              if (e.key === 'Escape') { e.target.value = ''; onSearch(''); onSearchCommit(''); }
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Dashboard/Tree Toggle — Admin Only */}
        {role === 'admin' && (
          <button
            onClick={() => setView(currentView === 'tree' ? 'dashboard' : 'tree')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '8px',
              background: 'rgba(var(--accent-rgb), 0.1)',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              fontSize: '0.85rem', fontWeight: '700',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {currentView === 'tree' ? (
              <>
                <LayoutDashboard size={18} />
                <span>לוח בקרה גלובלי</span>
              </>
            ) : (
              <>
                <Database size={18} />
                <span>חזרה למלאי</span>
              </>
            )}
          </button>
        )}

        {/* Role Toggle */}
        <button 
          onClick={toggleRole}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: role === 'admin' ? 'var(--danger)' : 'var(--success)',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {role === 'admin' ? 'מצב מנהל (Admin)' : 'מצב אחראי מלאי'}
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="nav-icon-btn"
          title={darkMode ? 'מצב יום' : 'מצב לילה'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Settings Dropdown */}
        <div style={{ position: 'relative' }} ref={settingsRef}>
          <button 
            className={`nav-icon-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={20} />
          </button>
          
          {showSettings && (
            <div className="dropdown-menu">
              <div className="dropdown-header">הגדרות מערכת</div>
              <button className="dropdown-item" onClick={() => { onAddAdmin(); setShowSettings(false); }}>
                <UserPlus size={16} />
                <span>הוסף מנהל מערכת חדש</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
