import { useLanguage } from '../../context/LanguageContext';
import { projectPriorities, projectValues } from '../../data/services';

export function ProjectAssessment({ state, setField }) {
  const { lang, t } = useLanguage();

  return (
    <div className="form-section">
      <h3 className="section-title">{t('Project Assessment', 'تقييم المشروع')}</h3>

      <div className="form-row">
        {/* Project Priority */}
        <div className="field">
          <label>{t('Project Priority', 'أولوية المشروع')}</label>
          <select
            value={state.projectPriority}
            onChange={(e) => setField('projectPriority', e.target.value)}
          >
            <option value="">{t('Select priority', 'اختر الأولوية')}</option>
            {projectPriorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {lang === 'ar' ? priority.labelAr : priority.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Project Value */}
        <div className="field">
          <label>{t('Project Value', 'قيمة المشروع')}</label>
          <select
            value={state.projectValue}
            onChange={(e) => setField('projectValue', e.target.value)}
          >
            <option value="">{t('Select value', 'اختر القيمة')}</option>
            {projectValues.map((value) => (
              <option key={value.id} value={value.id}>
                {lang === 'ar' ? value.labelAr : value.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
