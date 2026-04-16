import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import InventoryManager from './components/InventoryManager';
import { initialData } from './data/initialData';
import { findPath, updateNode, findNode, getPrunedTree, getAllManagers, getSearchTree } from './utils/treeUtils';
import CreateNodeModal from './components/CreateNodeModal';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

function App() {
  const [treeData, setTreeData] = useState(initialData);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedBreadcrumb, setSelectedBreadcrumb] = useState([]);
  const [role, setRole] = useState('admin');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPaths, setExpandedPaths] = useState([]);
  const [activeSearch, setActiveSearch] = useState(''); // committed on Enter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null);
  const [currentView, setCurrentView] = useState('tree');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (role !== 'admin' && currentView === 'dashboard') {
      setCurrentView('tree');
    }
  }, [role, currentView]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleAddAdmin = () => {
    // Placeholder for adding admin logic
    alert('פתיחת ממשק להוספת מנהל מערכת חדש...');
  };

  const handleGoHome = () => {
    setCurrentView('tree');
  };

  const handleSearch = (query) => {
    // Just track the typed value — commit happens on Enter
    setSearchQuery(query);
    if (!query.trim()) {
      setActiveSearch('');
      setExpandedPaths([]);
    }
  };

  const handleSearchCommit = (query) => {
    const trimmed = query.trim();
    setActiveSearch(trimmed);
    if (!trimmed) {
      setExpandedPaths([]);
      return;
    }
    const paths = findPath(treeData, trimmed);
    const allExpanded = [...new Set(paths.flat())];
    setExpandedPaths(allExpanded);
  };

  const handleUpdateManagerData = (updatedManager) => {
    const newTree = updateNode(treeData, updatedManager.id, () => updatedManager);
    setTreeData(newTree);
    setSelectedManager(updatedManager);
  };

  const toggleRole = () => {
    setRole(prev => {
      const newRole = prev === 'admin' ? 'manager' : 'admin';
      // If switching to manager and none selected, select a default for demo
      if (newRole === 'manager' && !selectedManager) {
        // Simple search for the first manager in initial data
        const manager = findNode(treeData, 'manager-101');
        setSelectedManager(manager);
      }
      return newRole;
    });
  };

  const handleCreateNode = (parent) => {
    setModalTarget(parent);
    setIsModalOpen(true);
  };

  const handlePerformCreate = (data) => {
    const { name, type, isExisting, id, replace } = data;

    const newNode = {
      id: isExisting ? id : `new-${Date.now()}`,
      name,
      type,
      children: [],
      offices: [],
    };

    const newTree = updateNode(treeData, modalTarget.id, (node) => {
      // If replacing, filter out the existing manager first
      const filteredChildren = replace
        ? (node.children || []).filter(c => c.type !== 'manager')
        : (node.children || []);

      return { ...node, children: [...filteredChildren, newNode] };
    });

    setTreeData(newTree);
    setExpandedPaths(prev => [...prev, modalTarget.id]);
    setIsModalOpen(false);
  };

  const displayTree = useMemo(() => {
    // Manager mode: always show pruned path
    if (role === 'manager' && selectedManager) {
      return getPrunedTree(treeData, selectedManager.id);
    }
    // Admin mode with active search: show filtered tree
    if (role === 'admin' && activeSearch) {
      const paths = findPath(treeData, activeSearch);
      const matchingIds = new Set(paths.map(p => p[p.length - 1])); // leaf IDs of each path
      const filtered = getSearchTree(treeData, matchingIds);
      return filtered || treeData;
    }
    return treeData;
  }, [role, treeData, selectedManager, activeSearch]);

  const sidebarExpandedPaths = useMemo(() => {
    if (role === 'manager' && selectedManager) {
      const paths = findPath(treeData, selectedManager.id);
      return [...new Set(paths.flat())];
    }
    return expandedPaths;
  }, [role, selectedManager, expandedPaths, treeData]);

  // The breadcrumb is simply the path captured at click time — always one path
  const managerBreadcrumbs = selectedBreadcrumb.length > 0
    ? [selectedBreadcrumb.filter(name => name !== 'הנהלה כללית')]
    : [];

  return (
    <div className="app-container">
      <Navbar 
        onSearch={handleSearch}
        onSearchCommit={handleSearchCommit}
        role={role} 
        toggleRole={toggleRole}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        currentView={currentView}
        setView={setCurrentView}
        onGoHome={handleGoHome}
      />
      
      {currentView !== 'dashboard' || role !== 'admin' ? (
        <>
          <Sidebar 
            data={displayTree} 
            onSelectManager={(node, path) => {
              setSelectedManager(node);
              setSelectedBreadcrumb(path || []);
            }}
            selectedManagerId={selectedManager?.id}
            expandedPaths={sidebarExpandedPaths}
            isAdmin={role === 'admin'}
            onCreate={handleCreateNode}
          />

          <main className="main-content">
            <InventoryManager 
              manager={selectedManager}
              isAdmin={role === 'admin'}
              onUpdateManager={handleUpdateManagerData}
              breadcrumbs={managerBreadcrumbs}
            />
          </main>
        </>
      ) : (
        <main
          className="main-content"
          style={{ gridColumn: '1 / -1', width: '100%', padding: '40px' }}
        >
          <AdminDashboard treeData={treeData} onManageAdmins={handleAddAdmin} />
        </main>
      )}

      <CreateNodeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handlePerformCreate}
        parentNode={modalTarget}
        existingManagers={getAllManagers(treeData)}
      />
    </div>
  );
}

export default App;
