'use client';

import { useEffect, useState } from 'react';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import MenuItemForm from '@/components/owner/MenuItemForm';

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

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/owner/menu', {
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
        ? `http://localhost:3001/api/owner/menu/${editItem.id}`
        : 'http://localhost:3001/api/owner/menu';

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
      const res = await fetch(`http://localhost:3001/api/owner/menu/${deleteId}`, {
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
          <h1>メニュー管理</h1>
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
              <h2>メニュー一覧（{menus.length}品）</h2>
              <button
                className="btn-primary"
                onClick={() => { setEditItem(null); setShowForm(true); }}
              >
                <span className="material-symbols-outlined">add</span>
                新しいメニューを追加
              </button>
            </div>

            {isLoading ? (
              <div className="owner-loading">
                <div className="spinner" />
                <span>読み込み中...</span>
              </div>
            ) : menus.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">restaurant_menu</span>
                <h3>メニューがまだありません</h3>
                <p>「新しいメニューを追加」ボタンから最初のメニューを作成しましょう</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>料理名</th>
                    <th>原材料</th>
                    <th>価格</th>
                    <th style={{ width: '100px' }}>操作</th>
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
                            title="編集"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => setDeleteId(item.id)}
                            title="削除"
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
              <h3>メニューを削除しますか？</h3>
              <p>この操作は取り消せません。</p>
              <div className="confirm-actions">
                <button className="btn-cancel" onClick={() => setDeleteId(null)}>
                  キャンセル
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                  削除する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
