import { useLanguage } from '../../context/LanguageContext';
import { projectPriorities, projectValues, preSalesStatuses } from '../../data/services';

export function ProjectAssessment({ state, setField }) {
  const { lang, t } = useLanguage();

  return (
    <div className="form-section assessment-section">
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
          <div className="radio-group horizontal">
            {projectValues.map((value) => (
              <label key={value.id} className="radio-option">
                <input
                  type="radio"
                  name="projectValue"
                  value={value.id}
                  checked={state.projectValue === value.id}
                  onChange={(e) => setField('projectValue', e.target.value)}
                />
                <span className="radio-mark"></span>
                <span className="radio-label">
                  {lang === 'ar' ? value.labelAr : value.labelEn}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-Sales Status */}
      <div className="field">
        <label>{t('Pre-Sales Status', 'حالة ما قبل البيع')}</label>
        <div className="radio-group horizontal">
          {preSalesStatuses.map((status) => (
            <label key={status.id} className="radio-option">
              <input
                type="radio"
                name="preSalesStatus"
                value={status.id}
                checked={state.preSalesStatus === status.id}
                onChange={(e) => setField('preSalesStatus', e.target.value)}
              />
              <span className="radio-mark"></span>
              <span className="radio-label">
                {lang === 'ar' ? status.labelAr : status.labelEn}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
