'use client';

import { useState, useEffect } from 'react';

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
          <h2>{initialData ? 'プロモーション編集' : '新しいプロモーションを作成'}</h2>
          <button onClick={onCancel} className="modal-close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-group">
            <label>タイトル<span className="required">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="サンセットディナー特別プラン"
              required
            />
          </div>

          <div className="form-group">
            <label>説明</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="キャンペーンの詳細を入力..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>割引率（%）<span className="required">*</span></label>
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
              <label>ステータス</label>
              <select
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                className="form-select"
              >
                <option value="active">有効</option>
                <option value="inactive">無効</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>開始日<span className="required">*</span></label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>終了日<span className="required">*</span></label>
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
              キャンセル
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? '保存中...' : (initialData ? '更新する' : '作成する')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
