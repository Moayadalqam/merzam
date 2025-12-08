import { useLanguage } from '../../context/LanguageContext';

export function DesignRequirements({ state, setField }) {
  const { t } = useLanguage();

  return (
    <div className="form-section">
      <h3 className="section-title">{t('Design Requirements', 'متطلبات التصميم')}</h3>

      {/* Architecture Design */}
      <div className="design-question">
        <p className="question-text">
          {t('Do you need Architecture Design?', 'هل تحتاج تصميم معماري؟')}
        </p>
        <div className="toggle-options">
          <button
            type="button"
            className={`toggle-btn ${state.archDesign === 'required' ? 'active' : ''}`}
            onClick={() => setField('archDesign', 'required')}
          >
            {t('Yes, I need it', 'نعم، أحتاجه')}
          </button>
          <button
            type="button"
            className={`toggle-btn ${state.archDesign === 'available' ? 'active' : ''}`}
            onClick={() => setField('archDesign', 'available')}
          >
            {t('No, I have it', 'لا، لدي تصميم')}
          </button>
        </div>

        {/* AutoCAD checkbox - only show if user already has design */}
        {state.archDesign === 'available' && (
          <label className="autocad-checkbox">
            <input
              type="checkbox"
              checked={state.archDesignAutocad}
              onChange={(e) => setField('archDesignAutocad', e.target.checked)}
            />
            <span className="checkbox-mark"></span>
            <span className="checkbox-label">
              {t('I have AutoCAD files', 'لدي ملفات AutoCAD')}
            </span>
          </label>
        )}
      </div>

      {/* Interior Design */}
      <div className="design-question">
        <p className="question-text">
          {t('Do you need Interior Design?', 'هل تحتاج تصميم داخلي؟')}
        </p>
        <div className="toggle-options">
          <button
            type="button"
            className={`toggle-btn ${state.interiorDesign === 'required' ? 'active' : ''}`}
            onClick={() => setField('interiorDesign', 'required')}
          >
            {t('Yes, I need it', 'نعم، أحتاجه')}
          </button>
          <button
            type="button"
            className={`toggle-btn ${state.interiorDesign === 'available' ? 'active' : ''}`}
            onClick={() => setField('interiorDesign', 'available')}
          >
            {t('No, I have it', 'لا، لدي تصميم')}
          </button>
        </div>
      </div>
    </div>
  );
}
