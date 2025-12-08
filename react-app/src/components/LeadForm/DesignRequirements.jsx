import { useLanguage } from '../../context/LanguageContext';
import { designOptions } from '../../data/services';

export function DesignRequirements({ state, setField }) {
  const { lang, t } = useLanguage();

  return (
    <div className="form-section">
      <h3 className="section-title">{t('Design Requirements', 'متطلبات التصميم')}</h3>

      {/* Architecture Design */}
      <div className="field">
        <label>{t('Architecture Design', 'التصميم المعماري')}</label>
        <div className="radio-group">
          {designOptions.map((option) => (
            <label key={option.id} className="radio-option">
              <input
                type="radio"
                name="archDesign"
                value={option.id}
                checked={state.archDesign === option.id}
                onChange={(e) => setField('archDesign', e.target.value)}
              />
              <span className="radio-mark"></span>
              <span className="radio-label">
                {lang === 'ar' ? option.labelAr : option.labelEn}
              </span>
            </label>
          ))}
        </div>

        {/* AutoCAD checkbox - only show if "available" is selected */}
        {state.archDesign === 'available' && (
          <label className="checkbox-option autocad-option">
            <input
              type="checkbox"
              checked={state.archDesignAutocad}
              onChange={(e) => setField('archDesignAutocad', e.target.checked)}
            />
            <span className="checkbox-mark"></span>
            <span className="checkbox-label">
              {t('AutoCAD File Available?', 'ملف AutoCAD متوفر؟')}
            </span>
          </label>
        )}
      </div>

      {/* Interior Design */}
      <div className="field">
        <label>{t('Interior Design', 'التصميم الداخلي')}</label>
        <div className="radio-group">
          {designOptions.map((option) => (
            <label key={option.id} className="radio-option">
              <input
                type="radio"
                name="interiorDesign"
                value={option.id}
                checked={state.interiorDesign === option.id}
                onChange={(e) => setField('interiorDesign', e.target.value)}
              />
              <span className="radio-mark"></span>
              <span className="radio-label">
                {lang === 'ar' ? option.labelAr : option.labelEn}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
