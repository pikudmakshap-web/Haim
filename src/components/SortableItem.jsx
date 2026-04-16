import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Check, X } from 'lucide-react';

export function SortableItem({ item, isAdmin, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: item.name, sku: item.sku, count: item.count });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    position: 'relative',
    pointerEvents: isDragging ? 'none' : 'auto',
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onEdit({ ...item, ...draft, count: Number(draft.count) });
    setEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setDraft({ name: item.name, sku: item.sku, count: item.count });
    setEditing(false);
  };

  if (editing) {
    return (
      <tr ref={setNodeRef} style={style} className="sortable-item editing">
        <td style={{ padding: '8px' }}>
          <input
            value={draft.sku}
            onChange={e => setDraft(d => ({ ...d, sku: e.target.value }))}
            onClick={e => e.stopPropagation()}
            style={editInputStyle}
            placeholder='מק"ט'
          />
        </td>
        <td style={{ padding: '8px' }}>
          <input
            autoFocus
            value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
            onClick={e => e.stopPropagation()}
            style={{ ...editInputStyle, width: '100%' }}
            placeholder="שם מוצר"
          />
        </td>
        <td style={{ padding: '8px' }}>
          <input
            type="number"
            value={draft.count}
            onChange={e => setDraft(d => ({ ...d, count: e.target.value }))}
            onClick={e => e.stopPropagation()}
            style={{ ...editInputStyle, width: '70px' }}
            placeholder="כמות"
            min={0}
          />
        </td>
        <td style={{ padding: '8px', textAlign: 'left', whiteSpace: 'nowrap' }}>
          <button
            onClick={handleSave}
            style={{ color: 'var(--success)', padding: '4px 8px', borderRadius: '6px' }}
            title="שמור"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            style={{ color: 'var(--danger)', padding: '4px 8px', borderRadius: '6px' }}
            title="ביטול"
          >
            <X size={16} />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`sortable-item ${isDragging ? 'dragging' : ''}`}
    >
      <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
        {item.sku}
      </td>
      <td style={{ padding: '12px 8px', fontWeight: '500' }}>
        {item.name}
      </td>
      <td style={{ padding: '12px 8px', color: 'var(--accent)', fontWeight: '700' }}>
        {item.count}
      </td>
      {isAdmin && (
        <td style={{ padding: '12px 8px', textAlign: 'left', width: '40px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            title="ערוך"
            style={{
              color: 'var(--text-muted)',
              padding: '4px 6px',
              borderRadius: '6px',
              opacity: 0,
              transition: 'opacity 0.15s ease',
            }}
            className="edit-item-btn"
          >
            <Pencil size={14} />
          </button>
        </td>
      )}
    </tr>
  );
}

const editInputStyle = {
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid var(--accent)',
  background: 'var(--bg-secondary)',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
};
