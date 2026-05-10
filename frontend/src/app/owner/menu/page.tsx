'use client';

import { useEffect, useState } from 'react';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import MenuItemForm from '@/components/owner/MenuItemForm';
import { useLanguage } from '@/context/LanguageContext';

interface MenuItem {
  id: number;
  dishNameVn: string;
  dishNameJp: string;
  ingredients: string | null;
  imageUrl: string | null;
  price: number | null;
}

export default function MenuManagement() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/menu`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setMenus(data.menus);
      }
    } catch (err) {
      console.error('Menu fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const url = editItem
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/menu/${editItem.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/menu`;

      const res = await fetch(url, {
        method: editItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setEditItem(null);
        fetchMenus();
      }
    } catch (err) {
      console.error('Menu submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/menu/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setDeleteId(null);
        fetchMenus();
      }
    } catch (err) {
      console.error('Menu delete error:', err);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '—';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <div className="owner-layout">
      <OwnerSidebar />
      <main className="owner-main">
        <div className="owner-topbar">
          <h1>{t.owner_menu}</h1>
          <div className="topbar-actions">
            <button className="topbar-btn">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button className="topbar-btn">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>

        <div className="owner-content">
          <div className="data-table-wrapper">
            <div className="table-toolbar">
              <h2>{t.owner_menu_list_title.replace('{count}', menus.length.toString())}</h2>
              <button
                className="btn-primary"
                onClick={() => { setEditItem(null); setShowForm(true); }}
              >
                <span className="material-symbols-outlined">add</span>
                {t.owner_menu_add_btn}
              </button>
            </div>

            {isLoading ? (
              <div className="owner-loading">
                <div className="spinner" />
                <span>{t.common_loading}</span>
              </div>
            ) : menus.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">restaurant_menu</span>
                <h3>{t.owner_menu_empty}</h3>
                <p>{t.owner_menu_empty_sub}</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.owner_menu_col_name}</th>
                    <th>{t.owner_menu_col_ingredients}</th>
                    <th>{t.owner_menu_col_price}</th>
                    <th style={{ width: '100px' }}>{t.owner_menu_col_actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="dish-cell">
                          <img
                            src={item.imageUrl && item.imageUrl !== 'default.png' ? item.imageUrl : 'https://placehold.co/48x48/f0ede8/8a7a74?text=🍜'}
                            alt={item.dishNameJp}
                            className="dish-image"
                          />
                          <div className="dish-names">
                            <p className="dish-name-jp">{item.dishNameJp}</p>
                            <p className="dish-name-vn">{item.dishNameVn}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#5a4a44', fontSize: '0.88rem' }}>
                        {item.ingredients || '—'}
                      </td>
                      <td>
                        <span className="dish-price">{formatPrice(item.price)}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn"
                            onClick={() => { setEditItem(item); setShowForm(true); }}
                            title={t.common_edit}
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => setDeleteId(item.id)}
                            title={t.common_delete}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <MenuItemForm
          initialData={editItem ? {
            id: editItem.id,
            dishNameVn: editItem.dishNameVn,
            dishNameJp: editItem.dishNameJp,
            ingredients: editItem.ingredients || '',
            imageUrl: editItem.imageUrl || '',
            price: editItem.price || 0,
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="confirm-dialog">
              <span className="material-symbols-outlined">warning</span>
              <h3>{t.owner_menu_delete_title}</h3>
              <p>{t.owner_menu_delete_warning}</p>
              <div className="confirm-actions">
                <button className="btn-cancel" onClick={() => setDeleteId(null)}>
                  {t.common_cancel}
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                  {t.common_delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
