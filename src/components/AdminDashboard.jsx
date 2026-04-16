import React, { useMemo, useState } from 'react';
import { 
  Users, 
  Package, 
  MapPin, 
  Search, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  LayoutGrid,
  BarChart3
} from 'lucide-react';
import { getManagers } from '../utils/treeUtils';

const AdminDashboard = ({ treeData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSku, setExpandedSku] = useState(null);

  // 1. Aggregate Statistics & Inventory
  const { stats, globalInventory } = useMemo(() => {
    const allManagers = getManagers(treeData);
    const inventoryMap = {};
    let totalItemsCount = 0;
    let totalOfficesCount = 0;

    allManagers.forEach(manager => {
      totalOfficesCount += manager.offices?.length || 0;
      
      manager.offices?.forEach(office => {
        office.items?.forEach(item => {
          totalItemsCount += item.count;
          
          if (!inventoryMap[item.sku]) {
            inventoryMap[item.sku] = {
              sku: item.sku,
              name: item.name,
              totalCount: 0,
              holdingManagers: [] // { name, count }
            };
          }
          
          inventoryMap[item.sku].totalCount += item.count;
          
          // Track which manager holds this item
          const existingMan = inventoryMap[item.sku].holdingManagers.find(m => m.name === manager.name);
          if (existingMan) {
            existingMan.count += item.count;
          } else {
            inventoryMap[item.sku].holdingManagers.push({ name: manager.name, count: item.count });
          }
        });
      });
    });

    return {
      stats: {
        totalManagers: allManagers.length,
        totalOffices: totalOfficesCount,
        totalItems: totalItemsCount,
        uniqueProducts: Object.keys(inventoryMap).length
      },
      globalInventory: Object.values(inventoryMap).sort((a, b) => b.totalCount - a.totalCount)
    };
  }, [treeData]);

  // 2. Filter Inventory
  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return globalInventory;
    const lowerQuery = searchQuery.toLowerCase();
    return globalInventory.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.sku.toLowerCase().includes(lowerQuery)
    );
  }, [globalInventory, searchQuery]);

  return (
    <div className="dashboard-page animate-fade">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>לוח בקרת מלאי</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '4px' }}>
          מבט גלובלי וריכוז נתונים מכלל מנהלי המלאי והמשרדים בארגון
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '24px',
        marginBottom: '48px'
      }}>
        <StatCard 
          icon={<Users size={28} />} 
          label="סה&quot;כ מנהלים" 
          value={stats.totalManagers} 
          color="#3b82f6" 
        />
        <StatCard 
          icon={<MapPin size={28} />} 
          label="סה&quot;כ משרדים/חדרים" 
          value={stats.totalOffices} 
          color="#10b981" 
        />
        <StatCard 
          icon={<Package size={28} />} 
          label="סה&quot;כ פריטים במלאי" 
          value={stats.totalItems} 
          color="#f59e0b" 
        />
        <StatCard 
          icon={<BarChart3 size={28} />} 
          label="מוצרים ייחודיים" 
          value={stats.uniqueProducts} 
          color="#8b5cf6" 
        />
      </div>

      {/* Main Inventory Section */}
      <div className="dashboard-table-container">
        <div className="admin-search-container">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', fontWeight: '800' }}>
            <LayoutGrid size={22} color="var(--accent)" />
            ריכוז מלאי גלובלי
          </h2>
          
          <div style={{ position: 'relative', width: '320px' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text" 
              placeholder="חפש לפי מק&quot;ט או שם פריט..."
              className="modal-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '44px', background: 'var(--bg-secondary)', marginTop: 0 }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <th style={{ padding: '16px 24px' }}>מק&quot;ט</th>
                <th style={{ padding: '16px 24px' }}>שם מוצר</th>
                <th style={{ padding: '16px 24px', textAlign: 'center' }}>כמות כוללת</th>
                <th style={{ padding: '16px 24px', width: '100px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? filteredInventory.map((item) => (
                <React.Fragment key={item.sku}>
                  <tr 
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => setExpandedSku(expandedSku === item.sku ? null : item.sku)}
                    className="hover-row"
                  >
                    <td style={{ padding: '20px 24px', fontFamily: 'monospace', fontWeight: '600', color: 'var(--text-secondary)' }}>{item.sku}</td>
                    <td style={{ padding: '20px 24px', fontWeight: '700', fontSize: '1rem' }}>{item.name}</td>
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      <span style={{ 
                        background: 'rgba(var(--accent-rgb), 0.12)', 
                        color: 'var(--accent)', 
                        padding: '8px 18px', 
                        borderRadius: '12px', 
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        minWidth: '60px',
                        display: 'inline-block'
                      }}>
                        {item.totalCount}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '0.8rem' }}>פרטים</span>
                        {expandedSku === item.sku ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </td>
                  </tr>
                  {expandedSku === item.sku && (
                    <tr style={{ background: 'rgba(var(--accent-rgb), 0.02)' }}>
                      <td colSpan="4" style={{ padding: '0 32px 32px' }}>
                        <div className="expanded-details animate-fade">
                          <h4 style={{ marginBottom: '20px', fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={16} color="var(--accent)" />
                            התפלגות מלאי בין מנהלים:
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                            {item.holdingManagers.map((man, idx) => (
                              <div key={idx} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '12px 20px', 
                                background: 'var(--bg-surface)', 
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                              }}>
                                <span style={{ fontWeight: '600' }}>{man.name}</span>
                                <span style={{ color: 'var(--accent)', fontWeight: '900', fontSize: '1.1rem' }}>{man.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                    <p>לא נמצאו מוצרים התואמים את החיפוש</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div style={{ 
      background: `${color}15`, 
      color: color, 
      padding: '18px', 
      borderRadius: '20px',
      display: 'flex',
      boxShadow: `0 8px 16px ${color}10`
    }}>
      {icon}
    </div>
    <div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{value}</div>
    </div>
  </div>
);

export default AdminDashboard;
