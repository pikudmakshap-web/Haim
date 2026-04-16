import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { closestCorners } from '@dnd-kit/core';
import OfficeTable from './OfficeTable';
import MoveItemModal from './MoveItemModal';
import { ChevronRight, FileOutput, Filter, PlusCircle, Search, LayoutGrid, CheckCircle2 } from 'lucide-react';

const InventoryManager = ({ manager, isAdmin, onUpdateManager, breadcrumbs = [], onLogActivity }) => {
  const [activeId, setActiveId] = React.useState(null);
  const [addingOffice, setAddingOffice] = React.useState(false);
  const [newOfficeName, setNewOfficeName] = React.useState('');
  const [showSortOptions, setShowSortOptions] = React.useState(false);
  const [officeSearchQuery, setOfficeSearchQuery] = React.useState('');
  const [moveModalData, setMoveModalData] = React.useState(null);
  const [notification, setNotification] = React.useState(null);
  
  const sortRef = React.useRef(null);

  // Aggregated totals calculation
  const aggregatedTotals = React.useMemo(() => {
    const totals = {};
    if (!manager?.offices) return [];
    
    manager.offices.forEach(office => {
      office.items?.forEach(item => {
        if (!totals[item.sku]) {
          totals[item.sku] = { ...item, count: 0 };
        }
        totals[item.sku].count += item.count;
      });
    });
    return Object.values(totals).sort((a, b) => a.name.localeCompare(b.name, 'he'));
  }, [manager?.offices]);

  // Close sort dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging a bit to avoid accidental clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!manager) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '40px', 
          borderRadius: '50%',
          marginBottom: '24px'
        }}>
          <Filter size={64} opacity={0.2} />
        </div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>אנא בחר יחידה או אחראי</h2>
        <p>כדי לצפות במלאי, בחר אדם או יחידה מהעץ הימני</p>
      </div>
    );
  }
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    // We no longer update state during drag over to allow for quantity modal on drop
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceOffice = manager.offices.find(o => o.items.some(i => i.id === activeId));
    let destOffice = manager.offices.find(o => o.id === overId) || 
                       manager.offices.find(o => o.items.some(i => i.id === overId));

    if (!sourceOffice || !destOffice || sourceOffice.id === destOffice.id) {
      return;
    }

    const activeItem = sourceOffice.items.find(i => i.id === activeId);
    if (!activeItem) return;

    // Trigger confirmation modal instead of moving immediately
    setMoveModalData({
      item: activeItem,
      fromOffice: sourceOffice,
      toOffice: destOffice
    });
  };

  const handleConfirmMove = (quantity) => {
    const { item: activeItem, fromOffice, toOffice } = moveModalData;
    
    const newOffices = manager.offices.map(office => {
      // 1. Remove/Subtract from source
      if (office.id === fromOffice.id) {
        if (activeItem.count === quantity) {
          return { ...office, items: office.items.filter(i => i.id !== activeItem.id) };
        } else {
          return { 
            ...office, 
            items: office.items.map(i => i.id === activeItem.id ? { ...i, count: i.count - quantity } : i) 
          };
        }
      }
      
      // 2. Add/Merge to destination
      if (office.id === toOffice.id) {
        const existingItem = office.items.find(i => i.sku === activeItem.sku);
        if (existingItem) {
          return {
            ...office,
            items: office.items.map(i => i.sku === activeItem.sku ? { ...i, count: i.count + quantity } : i)
          };
        } else {
          return { ...office, items: [...office.items, { ...activeItem, count: quantity }] };
        }
      }
      
      return office;
    });
    onUpdateManager({ ...manager, offices: newOffices });
    
    // Log the move activity
    if (onLogActivity) {
      onLogActivity('MOVE', `העביר ${quantity} יחידות של "${activeItem.name}" ממשרד "${fromOffice.name}" ל-"${toOffice.name}"`);
    }

    setMoveModalData(null);
    setNotification('ההעברה בוצעה בהצלחה!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditItem = (officeId, updatedItem) => {
    const newOffices = manager.offices.map(office => {
      if (office.id !== officeId) return office;
      return {
        ...office,
        items: office.items.map(i => i.id === updatedItem.id ? updatedItem : i)
      };
    });
    onUpdateManager({ ...manager, offices: newOffices });
    if (onLogActivity) onLogActivity('EDIT', `ערך את הפריט "${updatedItem.name}"`);
  };

  const handleAddItem = (officeId, newItem) => {
    if (!manager?.offices) return;
    const newOffices = manager.offices.map(office => {
      if (office.id !== officeId) return office;
      return {
        ...office,
        items: [...office.items, newItem]
      };
    });
    onUpdateManager({ ...manager, offices: newOffices });
    if (onLogActivity) onLogActivity('ADD', `הוסיף פריט חדש "${newItem.name}" (${newItem.count} יח')`);
  };

  const handleExport = () => {
    const rows = [
      ['משרד', 'מק"ט', 'שם מוצר', 'כמות']
    ];

    manager.offices.forEach(office => {
      office.items.forEach(item => {
        rows.push([office.name, item.sku, item.name, item.count]);
      });
    });

    const csvContent = "\uFEFF" + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_${manager.name}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (criteria) => {
    const sortedOffices = manager.offices.map(office => {
      const items = [...office.items].sort((a, b) => {
        if (criteria === 'name') return a.name.localeCompare(b.name, 'he');
        if (criteria === 'sku') return a.sku.localeCompare(b.sku);
        if (criteria === 'count') return b.count - a.count; // High to low
        return 0;
      });
      return { ...office, items };
    });
    onUpdateManager({ ...manager, offices: sortedOffices });
    setShowSortOptions(false);
  };

  return (
    <div className="animate-fade">
      {/* Header Info */}
      <div style={{ marginBottom: '32px' }}>
        {/* Dynamic breadcrumb — shows all locations for shared managers */}
        <div style={{ marginBottom: '8px' }}>
          {breadcrumbs.length > 0 ? breadcrumbs.map((path, pathIdx) => (
            <div
              key={pathIdx}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '0.85rem', color: 'var(--text-muted)',
                marginBottom: pathIdx < breadcrumbs.length - 1 ? '4px' : '0',
              }}
            >
              {path.map((label, i) => (
                <React.Fragment key={label + i}>
                  {i > 0 && <ChevronRight size={13} />}
                  <span style={i === path.length - 1 ? { color: 'var(--accent)', fontWeight: '600' } : {}}>
                    {label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )) : null}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ minWidth: '240px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>ניהול מלאי: {manager.name}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>צפייה ועריכת פריטי מלאי לפי משרדים</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Office Search */}
            <div style={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  color: 'var(--text-muted)'
                }} 
              />
              <input 
                type="text"
                placeholder="חיפוש משרד..."
                value={officeSearchQuery}
                onChange={(e) => setOfficeSearchQuery(e.target.value)}
                style={{
                  padding: '10px 36px 10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  width: '200px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>

            <div style={{ position: 'relative' }} ref={sortRef}>
              <button 
                className="btn-secondary"
                onClick={() => setShowSortOptions(!showSortOptions)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', cursor: 'pointer'
                }}
              >
                <Filter size={18} />
                מיון
              </button>

              {showSortOptions && (
                <div
                  className="dropdown-menu"
                  style={{ top: 'calc(100% + 8px)', left: 'auto', right: 0, width: '220px' }}
                >
                  <div className="dropdown-header">מיין לפי</div>
                  <button className="dropdown-item" onClick={() => handleSort('name')}>שם מוצר (א-ת)</button>
                  <button className="dropdown-item" onClick={() => handleSort('sku')}>מק"ט</button>
                  <button className="dropdown-item" onClick={() => handleSort('count')}>כמות (מהגבוה לנמוך)</button>
                </div>
              )}
            </div>

            <button 
              className="btn-secondary"
              onClick={handleExport}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              <FileOutput size={18} />
              ייצוא דוח
            </button>
          </div>
        </div>
      </div>

      {/* Totals Summary Table — READ ONLY */}
      <div style={{ 
        marginBottom: '40px',
        background: 'var(--bg-hover)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        padding: '24px',
        boxShadow: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <LayoutGrid size={22} color="var(--accent)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>ריכוז מלאי כולל - {manager.name}</h2>
          <span style={{ 
            fontSize: '0.75rem', 
            background: 'rgba(var(--accent-rgb), 0.1)', 
            color: 'var(--accent)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '700'
          }}>
            לקריאה בלבד
          </span>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 8px', fontWeight: '500' }}>מק&quot;ט</th>
              <th style={{ padding: '12px 8px', fontWeight: '500' }}>שם מוצר</th>
              <th style={{ padding: '12px 8px', fontWeight: '500' }}>סה&quot;כ כמות</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedTotals.length > 0 ? aggregatedTotals.map((item) => (
              <tr key={item.sku} style={{ borderBottom: '1px solid var(--border)', opacity: 0.9 }}>
                <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.sku}</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>{item.name}</td>
                <td style={{ padding: '12px 8px', color: 'var(--accent)', fontWeight: '800', fontSize: '1.1rem' }}>
                  {item.count}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  אין פריטים במלאי
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="offices-grid">
          {(manager?.offices || [])
            .filter(office => 
              office.name.toLowerCase().includes(officeSearchQuery.toLowerCase())
            )
            .map(office => (
              <OfficeTable
                key={office.id}
                office={office}
                isAdmin={isAdmin}
                onEditItem={handleEditItem}
                onAddItem={handleAddItem}
              />
            ))
          }
        </div>
        
        {/* Add new office — available to all roles */}
        {addingOffice ? (
          <div style={{
            width: '100%', padding: '24px',
            border: '2px solid var(--accent)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            display: 'flex', gap: '12px', alignItems: 'center',
          }}>
            <input
              autoFocus
              type="text"
              value={newOfficeName}
              onChange={e => setNewOfficeName(e.target.value)}
              placeholder="שם המשרד החדש (למשל: חדר ישיבות ב')"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (!newOfficeName.trim()) return;
                  const newName = newOfficeName.trim();
                  onUpdateManager({
                    ...manager,
                    offices: [...manager.offices, {
                      id: `office-${Date.now()}`,
                      name: newName,
                      items: []
                    }]
                  });
                  if (onLogActivity) onLogActivity('ADD_OFFICE', `יצר משרד/חדר חדש: "${newName}"`);
                  setNewOfficeName('');
                  setAddingOffice(false);
                }
                if (e.key === 'Escape') { setAddingOffice(false); setNewOfficeName(''); }
              }}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'var(--bg-secondary)',
                fontFamily: 'inherit', fontSize: '1rem',
              }}
            />
            <button
              className="btn-primary"
              style={{ padding: '12px 20px' }}
              onClick={() => {
                if (!newOfficeName.trim()) return;
                const newName = newOfficeName.trim();
                onUpdateManager({
                  ...manager,
                  offices: [...manager.offices, {
                    id: `office-${Date.now()}`,
                    name: newName,
                    items: []
                  }]
                });
                if (onLogActivity) onLogActivity('ADD_OFFICE', `יצר משרד/חדר חדש: "${newName}"`);
                setNewOfficeName('');
                setAddingOffice(false);
              }}
            >הוסף</button>
            <button className="btn-secondary" style={{ padding: '12px 16px' }}
              onClick={() => { setAddingOffice(false); setNewOfficeName(''); }}>
              ביטול
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingOffice(true)}
            style={{
              width: '100%', padding: '32px',
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '10px',
              transition: 'all 0.2s ease', cursor: 'pointer',
            }}
            className="add-office-btn"
          >
            <PlusCircle size={28} opacity={0.4} />
            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>הוסף משרד או חדר חדש</span>
          </button>
        )}

        <DragOverlay>
          {activeId ? (
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '8px',
              padding: '0',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--accent)',
              overflow: 'hidden',
              minWidth: '400px',
              opacity: 0.9
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <tbody>
                  <tr style={{ background: 'var(--bg-surface)' }}>
                    <td style={{ padding: '12px 24px', fontWeight: '600' }}>
                      {manager.offices.flatMap(o => o.items).find(i => i.id === activeId)?.name || 'פריט'}
                    </td>
                    <td style={{ padding: '12px 24px', color: 'var(--text-muted)' }}>
                      {manager.offices.flatMap(o => o.items).find(i => i.id === activeId)?.sku || ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {moveModalData && (
        <MoveItemModal 
          data={moveModalData}
          onConfirm={handleConfirmMove}
          onCancel={() => setMoveModalData(null)}
        />
      )}

      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '32px',
          background: 'var(--success)',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          animation: 'slideUp 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          fontWeight: '600',
          fontSize: '0.95rem'
        }}>
          <CheckCircle2 size={20} />
          {notification}
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
