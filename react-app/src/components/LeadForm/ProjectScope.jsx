import { useLanguage } from '../../context/LanguageContext';
import { projectScopes } from '../../data/services';

export function ProjectScope({ value, onChange }) {
  const { lang, t } = useLanguage();

  return (
    <div className="field field-full">
      <label htmlFor="projectScope">{t('Project Scope', 'نطاق المشروع')}</label>
      <div className="select-wrap">
        <select
          id="projectScope"
          name="ProjectScope"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{t('Select project type', 'اختر نوع المشروع')}</option>
          {projectScopes.map((scope) => (
            <option key={scope.id} value={scope.id}>
              {lang === 'ar' ? scope.labelAr : scope.labelEn}
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
