import { useLanguage } from '../../context/LanguageContext';
import { urgencyLevels } from '../../data/services';

export function UrgencySelector({ value, onChange }) {
  const { lang, t } = useLanguage();

  return (
    <div className="field">
      <label htmlFor="urgency">{t('Project Urgency', 'مدى استعجال المشروع')}</label>
      <div className="select-wrap">
        <select
          id="urgency"
          name="Urgency"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{t('When do you need this?', 'متى تحتاج هذا؟')}</option>
          {urgencyLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {lang === 'ar' ? level.labelAr : level.labelEn}
            </option>
          ))}
        </select>
        <svg className="select-icon" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
