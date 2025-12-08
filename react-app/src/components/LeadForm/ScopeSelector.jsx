import { useLanguage } from '../../context/LanguageContext';
import { scopeItems } from '../../data/services';

export function ScopeSelector({ selectedItems, onToggle }) {
  const { lang, t } = useLanguage();

  return (
    <div className="form-section">
      <h3 className="section-title">{t('Scope Required', 'النطاق المطلوب')}</h3>

      <div className="scope-grid">
        {scopeItems.map((item) => (
          <label key={item.id} className="scope-item">
            <input
              type="checkbox"
              checked={!!selectedItems[item.id]}
              onChange={() => onToggle(item.id)}
            />
            <span className="checkbox-mark"></span>
            <span className="scope-label">
              {lang === 'ar' ? item.labelAr : item.labelEn}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
