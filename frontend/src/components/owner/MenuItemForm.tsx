'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface MenuItemData {
  id?: number;
  dishNameVn: string;
  dishNameJp: string;
  ingredients: string;
  imageUrl: string;
  price: number;
}

interface MenuItemFormProps {
  initialData?: MenuItemData;
  onSubmit: (data: Omit<MenuItemData, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function MenuItemForm({ initialData, onSubmit, onCancel, isSubmitting }: MenuItemFormProps) {
  const [formData, setFormData] = useState<Omit<MenuItemData, 'id'>>({
    dishNameVn: '',
    dishNameJp: '',
    ingredients: '',
    imageUrl: '',
    price: 0,
  });
  const { t } = useLanguage();

  useEffect(() => {
    if (initialData) {
      setFormData({
        dishNameVn: initialData.dishNameVn,
        dishNameJp: initialData.dishNameJp,
        ingredients: initialData.ingredients || '',
        imageUrl: initialData.imageUrl || '',
        price: initialData.price || 0,
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
          <h2>{initialData ? t.menu_form_edit_title : t.menu_form_add_title}</h2>
          <button onClick={onCancel} className="modal-close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-row">
            <div className="form-group">
              <label>{t.menu_form_name_vn}<span className="required">*</span></label>
              <input
                type="text"
                value={formData.dishNameVn}
                onChange={(e) => setFormData({ ...formData, dishNameVn: e.target.value })}
                placeholder="Phở Bò"
                required
              />
            </div>
            <div className="form-group">
              <label>{t.menu_form_name_jp}<span className="required">*</span></label>
              <input
                type="text"
                value={formData.dishNameJp}
                onChange={(e) => setFormData({ ...formData, dishNameJp: e.target.value })}
                placeholder={t.menu_placeholder_name}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t.menu_form_ingredients}</label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder={t.menu_placeholder_ingredients}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.menu_form_price}</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="85000"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>{t.menu_form_image_url}</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {formData.imageUrl && formData.imageUrl !== 'default.png' && (
            <div className="form-preview">
              <img src={formData.imageUrl} alt="Preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              {t.common_cancel}
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? t.menu_form_btn_saving : (initialData ? t.menu_form_btn_update : t.menu_form_btn_add)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
