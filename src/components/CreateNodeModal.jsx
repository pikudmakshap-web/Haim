import React, { useState } from 'react';
import { X, UserPlus, RefreshCw, MapPin, User } from 'lucide-react';

/*
  Parent node states:
    A) Has a manager child   → "Replace Manager" mode only
    B) Has unit children     → "Add Location" mode only (already committed to being a branch)
    C) No children           → choice: "Add Location" or "Add Manager"
*/

const CreateNodeModal = ({ isOpen, onClose, onCreate, parentNode, existingManagers = [] }) => {
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState('unit');
  const [useExisting, setUseExisting] = useState(false);
  const [existingId, setExistingId] = useState('');

  if (!isOpen || !parentNode) return null;

  const children = parentNode.children || [];
  const hasManagerChild = children.some(c => c.type === 'manager');
  const hasUnitChildren = children.some(c => c.type === 'unit');
  const isEmpty = children.length === 0;

  const handleClose = () => {
    setName('');
    setSelectedType('unit');
    setUseExisting(false);
    setExistingId('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (hasManagerChild) {
      // Replace manager
      if (useExisting) {
        if (!existingId) { alert('נא לבחור מנהל קיים.'); return; }
        const manager = existingManagers.find(m => m.id === existingId);
        if (!manager) return;
        onCreate({ name: manager.name, id: manager.id, type: 'manager', isExisting: true, replace: true });
      } else {
        if (!name.trim()) { alert('נא להזין שם.'); return; }
        onCreate({ name: name.trim(), type: 'manager', isExisting: false, replace: true });
      }
      return handleClose();
    }

    // Add unit or manager
    if (selectedType === 'manager' && useExisting) {
      if (!existingId) { alert('נא לבחור מנהל קיים.'); return; }
      const manager = existingManagers.find(m => m.id === existingId);
      if (!manager) return;
      onCreate({ name: manager.name, id: manager.id, type: 'manager', isExisting: true, replace: false });
    } else {
      if (!name.trim()) { alert('נא להזין שם.'); return; }
      onCreate({ name: name.trim(), type: selectedType, isExisting: false, replace: false });
    }

    handleClose();
  };

  /* ─── MODE A: Replace Manager ─── */
  if (hasManagerChild) {
    const current = children.find(c => c.type === 'manager');
    return (
      <div className="modal-backdrop" onClick={handleClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="icon-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                <RefreshCw size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>החלפת אחראי מלאי</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  כרגע: <strong>{current?.name}</strong> — תחת: <strong>{parentNode.name}</strong>
                </p>
              </div>
            </div>
            <button onClick={handleClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {existingManagers.length > 0 && (
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={useExisting} onChange={e => setUseExisting(e.target.checked)}
                    style={{ width: '16px', height: '16px' }} />
                  <span>בחר אחראי קיים מהמערכת</span>
                </label>
              </div>
            )}

            {useExisting ? (
              <div className="form-group">
                <label>בחר אחראי מלאי</label>
                <select value={existingId} onChange={e => setExistingId(e.target.value)} className="modal-input">
                  <option value="">בחר מנהל...</option>
                  {existingManagers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label>שם האחראי החדש</label>
                <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="שם פרטי ומשפחה" className="modal-input" />
              </div>
            )}

            <p style={{ fontSize: '0.8rem', color: '#ef4444', background: 'rgba(239,68,68,0.07)',
              padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
              ⚠️ האחראי הנוכחי ייוסר ממדור זה
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, background: '#ef4444' }}>
                ✓ החלף אחראי
              </button>
              <button type="button" onClick={handleClose} className="btn-secondary">ביטול</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ─── MODE B: Add Location (already has unit children) ─── */
  /* ─── MODE C: Choice — Location or Manager (empty parent) ─── */
  const isManagerSelected = isEmpty && selectedType === 'manager';

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-badge">
              {isManagerSelected ? <User size={20} /> : <MapPin size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                {isManagerSelected ? 'הוספת אחראי מלאי' : 'הוספת מיקום חדש'}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                תחת: <strong>{parentNode.name}</strong>
              </p>
            </div>
          </div>
          <button onClick={handleClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Type toggle — only when parent is empty (free choice) */}
          {isEmpty && (
            <div className="form-group">
              <label>מה ברצונך להוסיף?</label>
              <div className="type-toggle" style={{ marginTop: '12px' }}>
                <button type="button"
                  className={selectedType === 'unit' ? 'active' : ''}
                  onClick={() => { setSelectedType('unit'); setUseExisting(false); }}>
                  <MapPin size={16} />
                  <span>מיקום / מדור</span>
                </button>
                <button type="button"
                  className={selectedType === 'manager' ? 'active' : ''}
                  onClick={() => setSelectedType('manager')}>
                  <User size={16} />
                  <span>אחראי מלאי</span>
                </button>
              </div>
            </div>
          )}

          {/* Existing manager checkbox — only for manager type */}
          {isManagerSelected && existingManagers.length > 0 && (
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={useExisting} onChange={e => setUseExisting(e.target.checked)}
                  style={{ width: '16px', height: '16px' }} />
                <span>בחר אחראי קיים מהמערכת</span>
              </label>
            </div>
          )}

          {/* Name input or existing dropdown */}
          {isManagerSelected && useExisting ? (
            <div className="form-group">
              <label>בחר אחראי מלאי</label>
              <select value={existingId} onChange={e => setExistingId(e.target.value)} className="modal-input">
                <option value="">בחר מנהל...</option>
                {existingManagers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>{isManagerSelected ? 'שם האחראי' : 'שם המיקום / המדור'}</label>
              <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder={isManagerSelected ? 'שם פרטי ומשפחה' : 'למשל: מדור לוגיסטיקה'}
                className="modal-input" />
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              ✓ {isManagerSelected ? 'צור אחראי' : 'צור מיקום'}
            </button>
            <button type="button" onClick={handleClose} className="btn-secondary">ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNodeModal;
