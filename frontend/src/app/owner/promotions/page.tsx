'use client';

import { useEffect, useState } from 'react';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import PromotionForm from '@/components/owner/PromotionForm';
import { useLanguage } from '@/context/LanguageContext';

interface Promotion {
  id: number;
  title: string;
  description: string | null;
  discountPercent: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Promotion | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    fetchPromotions();
  }, []);

  async function fetchPromotions() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/promotions`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPromotions(data.promotions);
      }
    } catch (err) {
      console.error('Promotions fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const url = editItem
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/promotions/${editItem.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/promotions`;

      const res = await fetch(url, {
        method: editItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setEditItem(null);
        fetchPromotions();
      }
    } catch (err) {
      console.error('Promotion submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/promotions/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setDeleteId(null);
        fetchPromotions();
      }
    } catch (err) {
      console.error('Promotion delete error:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isActiveNow = (promo: Promotion) => {
    const now = new Date();
    return promo.isActive && new Date(promo.startDate) <= now && new Date(promo.endDate) >= now;
  };

  return (
    <div className="owner-layout">
      <OwnerSidebar />
      <main className="owner-main">
        <div className="owner-topbar">
          <h1>{t.owner_promotions}</h1>
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
          <div className="table-toolbar" style={{ background: 'transparent', padding: '0 0 24px', border: 'none' }}>
            <h2 style={{ fontSize: '1rem' }}>{t.owner_promo_list_title.replace('{count}', promotions.length.toString())}</h2>
            <button
              className="btn-primary"
              onClick={() => { setEditItem(null); setShowForm(true); }}
            >
              <span className="material-symbols-outlined">add</span>
              {t.owner_promo_add_btn}
            </button>
          </div>

          {isLoading ? (
            <div className="owner-loading">
              <div className="spinner" />
              <span>{t.common_loading}</span>
            </div>
          ) : promotions.length === 0 ? (
            <div className="data-table-wrapper">
              <div className="empty-state">
                <span className="material-symbols-outlined">campaign</span>
                <h3>{t.owner_promo_empty}</h3>
                <p>{t.owner_promo_empty_sub}</p>
              </div>
            </div>
          ) : (
            <div className="promos-grid">
              {promotions.map((promo) => (
                <div key={promo.id} className="promo-card">
                  <div className="promo-card-header">
                    <h3 className="promo-card-title">{promo.title}</h3>
                    <span className="promo-discount-badge">
                      {promo.discountPercent}% OFF
                    </span>
                  </div>

                  {promo.description && (
                    <p className="promo-card-desc">{promo.description}</p>
                  )}

                  <div className="promo-card-meta">
                    <span className="promo-dates">
                      <span className="material-symbols-outlined">schedule</span>
                      {formatDate(promo.startDate)} ～ {formatDate(promo.endDate)}
                    </span>
                    <span className={isActiveNow(promo) ? 'promo-status-active' : 'promo-status-inactive'}>
                      {isActiveNow(promo) ? t.owner_promo_status_active : t.owner_promo_status_ended}
                    </span>
                  </div>

                  <div className="promo-card-actions">
                    <button
                      className="action-btn"
                      onClick={() => { setEditItem(promo); setShowForm(true); }}
                      title={t.common_edit}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => setDeleteId(promo.id)}
                      title={t.common_delete}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <PromotionForm
          initialData={editItem ? {
            id: editItem.id,
            title: editItem.title,
            description: editItem.description || '',
            discountPercent: editItem.discountPercent,
            startDate: editItem.startDate,
            endDate: editItem.endDate,
            isActive: editItem.isActive,
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
              <h3>{t.owner_promo_delete_title}</h3>
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
