import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, Building2, User, LayoutGrid, Plus, SearchX } from 'lucide-react';

const TreeNode = ({ node, level = 0, onSelect, selectedId, expandedPaths = [], isAdmin, onCreate, currentPath = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodePath = [...currentPath, node.name];
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isManager = node.type === 'manager';
  const shouldBeOpen = expandedPaths.includes(node.id);

  useEffect(() => {
    if (shouldBeOpen) setIsOpen(true);
  }, [shouldBeOpen]);

  const toggle = (e) => {
    e.stopPropagation();
    setIsOpen(v => !v);
  };

  const handleClick = () => {
    if (isManager) {
      onSelect(node, nodePath);
    } else {
      setIsOpen(v => !v);
    }
  };

  return (
    <div className="tree-node" style={{ marginRight: level > 0 ? '12px' : '0' }}>
      <div
        className={`tree-row ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: isHovered || isSelected ? 'var(--bg-hover)' : 'transparent',
          marginBottom: '2px',
          color: isSelected ? 'var(--accent)' : 'inherit',
          borderRight: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
          userSelect: 'none',
        }}
      >
        {/* Chevron toggle */}
        <div style={{ width: '24px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {hasChildren && (
            <button onClick={toggle} style={{ color: 'var(--text-muted)' }}>
              {isOpen ? <ChevronDown size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>

        {/* Icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          {isManager ? (
            <User size={16} style={{ flexShrink: 0 }} />
          ) : level === 0 ? (
            <Building2 size={16} style={{ flexShrink: 0 }} />
          ) : (
            <LayoutGrid size={16} style={{ flexShrink: 0 }} />
          )}
          <span style={{
            fontSize: '1.02rem',
            fontWeight: isManager ? '700' : '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {node.name}
          </span>
        </div>

        {/* Inline + button: only visible on row hover */}
        {isAdmin && !isManager && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreate(node);
            }}
            title="הוסף צומת"
            style={{
              flexShrink: 0,
              marginRight: '4px',
              color: 'var(--accent)',
              padding: '4px 6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              opacity: isHovered ? 1 : 0,
              pointerEvents: isHovered ? 'auto' : 'none',
              transition: 'opacity 0.15s ease',
            }}
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {isOpen && hasChildren && (
        <div className="tree-children" style={{ borderRight: '1px solid var(--border)', marginRight: '16px' }}>
          {node.children.map((child, index) => (
            <TreeNode
              key={`${node.id}-${child.id}-${index}`}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              expandedPaths={expandedPaths}
              isAdmin={isAdmin}
              onCreate={onCreate}
              currentPath={nodePath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ data, onSelectManager, selectedManagerId, expandedPaths, isAdmin, onCreate }) => {
  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
          ניהול היררכי
        </h2>
      </div>

      <div className="tree-container">
        {data ? (
          <TreeNode
            node={data}
            onSelect={onSelectManager}
            selectedId={selectedManagerId}
            expandedPaths={expandedPaths}
            isAdmin={isAdmin}
            onCreate={onCreate}
          />
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', animation: 'fadeIn 0.3s' }}>
            <SearchX size={48} style={{ opacity: 0.15, margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontSize: '1rem', fontWeight: '700' }}>לא נמצאו תוצאות</p>
            <p style={{ fontSize: '0.85rem', marginTop: '6px', opacity: 0.8 }}>בדוק את שורת החיפוש או נסה שם אחר</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
