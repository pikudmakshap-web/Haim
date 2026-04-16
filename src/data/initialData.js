export const initialData = {
  id: 'root',
  name: 'הנהלה כללית',
  type: 'unit',
  children: [
    {
      id: 'branch-north',
      name: 'מחוז צפון',
      type: 'unit',
      children: [
        {
          id: 'section-logistics',
          name: 'מדור לוגיסטיקה',
          type: 'unit',
          children: [
            {
              id: 'manager-101',
              name: 'משה כהן',
              type: 'manager',
              offices: [
                {
                  id: 'office-101',
                  name: 'משרד קבלה 101',
                  items: [
                    { id: 'item-1', name: 'מסך "Dell UltraSharp 27', sku: 'SKU-9022#', count: 2 },
                    { id: 'item-2', name: 'מקלדת מכנית Logitech MX', sku: 'SKU-1104#', count: 4 },
                    { id: 'item-3', name: 'נייר מדפסת A4 (חבילה)', sku: 'SKU-5541#', count: 15 },
                    { id: 'item-101', name: 'טלפון IP Cisco', sku: 'SKU-8811#', count: 3 },
                    { id: 'item-102', name: 'מגרסת נייר משרדית', sku: 'SKU-4400#', count: 1 },
                    { id: 'item-new-1', name: 'כיסא ארגונומי Herman Miller', sku: 'SKU-HM-01#', count: 2 },
                    { id: 'item-new-3', name: 'מחשב נייד MacBook Pro M3', sku: 'SKU-MBP-01#', count: 1 },
                  ]
                },
                {
                  id: 'office-102',
                  name: 'חדר ישיבות קטן',
                  items: [
                    { id: 'item-103', name: 'לוח מחיק זכוכית', sku: 'SKU-2211#', count: 1 },
                    { id: 'item-104', name: 'מצלמת ועידה Logitech', sku: 'SKU-9922#', count: 1 },
                    { id: 'item-105', name: 'סט כבלים HDMI/USB-C', sku: 'SKU-3322#', count: 5 },
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'section-it',
          name: 'מדור מערכות מידע',
          type: 'unit',
          children: [
            {
              id: 'manager-103',
              name: 'דניאל מזרחי',
              type: 'manager',
              offices: [
                {
                  id: 'office-301',
                  name: 'מעבדת תיקונים',
                  items: [
                    { id: 'item-8', name: 'תחנת עבודה Precision 3660', sku: 'SKU-1234#', count: 3 },
                    { id: 'item-9', name: 'כרטיס רשת סיב אופטי', sku: 'SKU-8822#', count: 10 },
                    { id: 'item-301', name: 'מלחם מקצועי Weller', sku: 'SKU-7711#', count: 2 },
                    { id: 'item-302', name: 'מולטימטר דיגיטלי', sku: 'SKU-5566#', count: 4 },
                    { id: 'item-new-2', name: 'מחשב נייד MacBook Pro M3', sku: 'SKU-MBP-01#', count: 1 },
                  ]
                },
                {
                  id: 'office-302',
                  name: 'מחסן שרתים',
                  items: [
                    { id: 'item-303', name: 'שרת PowerEdge R750', sku: 'SKU-SER-01#', count: 1 },
                    { id: 'item-304', name: 'אל-פסק (UPS) 3000VA', sku: 'SKU-UPS-02#', count: 2 },
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'branch-south',
      name: 'מחוז דרום',
      type: 'unit',
      children: [
        {
          id: 'section-hr',
          name: 'מדור משאבי אנוש',
          type: 'unit',
          children: [
            {
              id: 'manager-101', // SHARED MANAGER (Moshe Cohen)
              name: 'משה כהן',
              type: 'manager',
              offices: [
                {
                  id: 'office-401',
                  name: 'משרד גיוס מרכזי',
                  items: [
                    { id: 'item-10', name: 'טאבלט iPad Pro 12.9', sku: 'SKU-1122#', count: 5 },
                    { id: 'item-11', name: 'אוזניות ביטול רעשים', sku: 'SKU-9900#', count: 8 },
                    { id: 'item-401', name: 'מעמדים לטאבלט', sku: 'SKU-7788#', count: 5 },
                  ]
                },
                {
                  id: 'office-402',
                  name: 'ארכיון כוח אדם',
                  items: [
                    { id: 'item-402', name: 'ארון תיוק מתכת 4 מגירות', sku: 'SKU-ARC-01#', count: 4 },
                    { id: 'item-403', name: 'סורק מסמכים מהיר Fujitsu', sku: 'SKU-SCN-02#', count: 1 },
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
