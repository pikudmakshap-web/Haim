import React, { useState } from 'react';
import { ArrowRight, Package, X, Check, Info, ArrowLeft } from 'lucide-react';

const MoveItemModal = ({ data, onConfirm, onCancel }) => {
  const { item, fromOffice, toOffice } = data;
  const [quantity, setQuantity] = useState(1);
  const totalAvailable = item.count;

  const handleConfirm = () => {
    const q = parseInt(quantity);
    if (isNaN(q) || q < 1 || q > totalAvailable) return;
    onConfirm(q);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-badge">
              <Package size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>העברת פריט למשרד אחר</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.name} ({item.sku})</p>
            </div>
          </div>
          <button onClick={onCancel} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Path visualization */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            background: 'var(--bg-secondary)',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '24px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ממשרד</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{fromOffice.name}</div>
            </div>

            <div style={{
              background: 'var(--accent)',
              color: 'white',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex'
            }}>
              <ArrowLeft size={20} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>אל משרד</div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--accent)' }}>{toOffice.name}</div>
            </div>
          </div>

          <div className="form-group">
            <label>כמות להעברה (מקסימום {totalAvailable})</label>
            <div style={{ position: 'relative', marginTop: '8px' }}>
              <input
                type="number"
                autoFocus
                className="modal-input"
                value={quantity}
                min="1"
                max={totalAvailable}
                onChange={(e) => setQuantity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirm();
                  if (e.key === 'Escape') onCancel();
                }}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  borderColor: (quantity > totalAvailable || quantity < 1) ? 'var(--danger)' : 'var(--border)'
                }}
              />
            </div>

            {(quantity > totalAvailable) && (
              <div style={{
                marginTop: '8px',
                color: 'var(--danger)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Info size={14} />
                <span>לא ניתן להעביר יותר מהמלאי הקיים ({totalAvailable})</span>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px'
          }}>
            <button
              className="btn-primary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={handleConfirm}
              disabled={quantity > totalAvailable || quantity < 1 || !quantity}
            >
              <Check size={18} />
              אשר העברה
            </button>
            <button
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={onCancel}
            >
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveItemModal;
