import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { ChevronDown, Plus, Package, Check, X } from 'lucide-react';
import ScrollableTableContainer from './ScrollableTableContainer';

const OfficeTable = ({ office, isAdmin, onEditItem, onAddItem }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', sku: '', count: 1 });
  const { setNodeRef, isOver } = useDroppable({ id: office.id });

  return (
    <div ref={setNodeRef} className="office-card" style={{
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: isOver ? '2px dashed var(--accent)' : '1px solid var(--border)',
      marginBottom: '24px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      transition: 'all 0.2s ease',
      transform: 'none',
      zIndex: isOver ? 10 : 1,
    }}>
      {/* Header */}
      <div className="office-header" style={{
        padding: '16px 24px',
        borderBottom: isOpen ? '1px solid var(--border)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-hover)',
        cursor: 'pointer',
        userSelect: 'none',
      }} onClick={() => setIsOpen(v => !v)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '10px',
            borderRadius: '12px',
            color: 'var(--accent)',
            boxShadow: 'var(--shadow)',
          }}>
            <Package size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{office.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {office.items.length} פריטים {!isOpen ? '(מכווץ)' : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            color: 'var(--text-muted)',
            transition: 'transform 0.25s ease',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(-180deg)',
          }}>
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Collapsible body */}
      {isOpen && (
        <div style={{ paddingBottom: '16px' }}>
          <ScrollableTableContainer className="office-table-wrapper" style={{ padding: '0 24px' }} maxHeight="400px">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <th style={{ padding: '16px 8px', fontWeight: '500' }}>מק&quot;ט</th>
                  <th style={{ padding: '16px 8px', fontWeight: '500' }}>שם מוצר</th>
                  <th style={{ padding: '16px 8px', fontWeight: '500' }}>כמות</th>
                  {isAdmin && <th style={{ padding: '16px 8px', fontWeight: '500', textAlign: 'left', width: '40px' }}></th>}
                </tr>
              </thead>
              <tbody>
                <SortableContext items={office.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  {office.items.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      isAdmin={isAdmin}
                      onEdit={(updated) => onEditItem(office.id, updated)}
                    />
                  ))}
                </SortableContext>

                {isAdding && (
                  <tr style={{ background: 'rgba(var(--accent-rgb), 0.05)' }}>
                    <td style={{ padding: '8px' }}>
                      <input
                        placeholder='מק"ט'
                        value={newItem.sku}
                        onChange={e => setNewItem({ ...newItem, sku: e.target.value })}
                        style={inlineInputStyle}
                      />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input
                        autoFocus
                        placeholder="שם מוצר"
                        value={newItem.name}
                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                        style={{ ...inlineInputStyle, width: '100%' }}
                      />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input
                        type="number"
                        placeholder="כמות"
                        value={newItem.count}
                        onChange={e => setNewItem({ ...newItem, count: parseInt(e.target.value) || 0 })}
                        style={{ ...inlineInputStyle, width: '60px' }}
                      />
                    </td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => {
                            if (!newItem.name || !newItem.sku) return;
                            onAddItem(office.id, { ...newItem, id: `item-${Date.now()}` });
                            setNewItem({ name: '', sku: '', count: 1 });
                            setIsAdding(false);
                          }}
                          style={{ color: 'var(--success)', padding: '4px 8px', borderRadius: '6px' }}
                          title="שמור"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => setIsAdding(false)}
                          style={{ color: 'var(--danger)', padding: '4px 8px', borderRadius: '6px' }}
                          title="ביטול"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollableTableContainer>

          {isAdmin && !isAdding && (
            <div style={{ padding: '0 24px' }}>
              <button 
                onClick={() => setIsAdding(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '16px',
                  border: '1px dashed var(--border)',
                  borderRadius: '8px',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                הוסף פריט למשרד
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const inlineInputStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid var(--border)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  fontSize: '0.85rem',
  fontFamily: 'inherit'
};

export default OfficeTable;
