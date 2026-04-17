import React, { useState } from 'react';
import { X, UserPlus, Trash2, Mail, Users, Shield } from 'lucide-react';
import ScrollableTableContainer from './ScrollableTableContainer';

const ManageAdminsModal = ({ isOpen, onClose, systemAdmins, onAddAdmin, onRemoveAdmin }) => {
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Admin' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAdmin.name.trim() || !newAdmin.email.trim()) return;
    
    onAddAdmin({
      id: `admin-${Date.now()}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role
    });
    
    setNewAdmin({ name: '', email: '', role: 'Admin' });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-badge">
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>ניהול מנהלי מערכת</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                צפייה, הוספה או הסרה של מנהלים בעלי הרשאות גישה למערכת
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Admin List Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} />
              מנהלים קיימים
            </h3>
            
            <ScrollableTableContainer maxHeight="300px" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>שם מלא</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>אימייל</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>הרשאה</th>
                    <th style={{ padding: '12px 16px', width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {systemAdmins.map((admin) => (
                    <tr key={admin.id} style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '500' }}>{admin.name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{admin.email}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        <span style={{ 
                          background: 'rgba(var(--accent-rgb), 0.1)', 
                          color: 'var(--accent)', 
                          padding: '4px 8px', 
                          borderRadius: 'var(--radius-sm)', 
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {admin.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button 
                          onClick={() => onRemoveAdmin(admin.id)}
                          style={{ color: 'var(--danger)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                          title="הסר מנהל"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {systemAdmins.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        אין מנהלי מערכת מוגדרים
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollableTableContainer>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 -24px 24px' }} />

          {/* Add New Admin Section */}
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={16} />
            הוספת מנהל חדש
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>שם מלא</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  value={newAdmin.name}
                  onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                  placeholder="לדוג': דוד לוי"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>כתובת אימייל</label>
                <input 
                  type="email" 
                  className="modal-input" 
                  value={newAdmin.email}
                  onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                  placeholder="david@example.com"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                סגירה
              </button>
              <button type="submit" className="btn-primary">
                הוסף מנהל
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageAdminsModal;
