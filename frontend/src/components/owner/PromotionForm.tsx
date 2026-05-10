'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface PromotionData {
  id?: number;
  title: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface PromotionFormProps {
  initialData?: PromotionData;
  onSubmit: (data: Omit<PromotionData, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function PromotionForm({ initialData, onSubmit, onCancel, isSubmitting }: PromotionFormProps) {
  const [formData, setFormData] = useState<Omit<PromotionData, 'id'>>({
    title: '',
    description: '',
    discountPercent: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
  });
  const { t } = useLanguage();

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        discountPercent: initialData.discountPercent,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? t.promo_form_edit_title : t.promo_form_add_title}</h2>
          <button onClick={onCancel} className="modal-close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-group">
            <label>{t.promo_form_title_label}<span className="required">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t.promo_placeholder_title}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.promo_form_desc_label}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t.promo_placeholder_desc}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.promo_form_discount_label}<span className="required">*</span></label>
              <input
                type="number"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) || 0 })}
                min="1"
                max="100"
                required
              />
            </div>
            <div className="form-group">
              <label>{t.promo_form_status_label}</label>
              <select
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                className="form-select"
              >
                <option value="active">{t.promo_form_status_active}</option>
                <option value="inactive">{t.promo_form_status_inactive}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.promo_form_start_date}<span className="required">*</span></label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t.promo_form_end_date}<span className="required">*</span></label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              {t.common_cancel}
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? t.menu_form_btn_saving : (initialData ? t.menu_form_btn_update : t.promo_form_btn_add)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
