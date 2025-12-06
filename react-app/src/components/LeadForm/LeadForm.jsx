import { useLanguage } from '../../context/LanguageContext';
import { useLeadForm } from '../../hooks/useLeadForm';
import { PersonalDetails } from './PersonalDetails';
import { ProjectScope } from './ProjectScope';
import { ServiceSelector } from './ServiceSelector';
import { UrgencySelector } from './SalesmanMode';

// FormSubmit AJAX endpoint (no redirect needed)
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/moayad@qualiasolutions.net';

// Google Apps Script Web App URL for saving leads to Google Sheets
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyYM6csdeVCDUrcuEAzdzHLGrCYkPHcd2tN7IUhzY_Hg77jprf5zLx8mCzv3rBD05X_Pw/exec';

export function LeadForm() {
  const { t } = useLanguage();
  const {
    state,
    setField,
    toggleService,
    setServiceOption,
    validate,
    formatServicesForEmail,
    resetForm,
    dispatch,
  } = useLeadForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const servicesText = formatServicesForEmail();

    // Send to both Google Sheets and FormSubmit in parallel
    try {
      // Google Sheets request (fire and forget)
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          phone: state.phone,
          email: state.email,
          area: state.area,
          projectScope: state.projectScope || 'Not specified',
          urgency: state.urgency || 'Not specified',
          services: servicesText,
        }),
      });

      // FormSubmit - use FormData (more reliable than JSON)
      const formData = new FormData();
      formData.append('name', state.name);
      formData.append('phone', state.phone);
      formData.append('email', state.email);
      formData.append('area', state.area);
      formData.append('Project Scope', state.projectScope || 'Not specified');
      formData.append('Project Urgency', state.urgency || 'Not specified');
      formData.append('Services', servicesText);
      formData.append('_subject', 'New Inquiry - Mirzaam Expo 2025');
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');

      await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      // Clear localStorage and show success
      localStorage.removeItem('woodLocationForm');
      dispatch({ type: 'SET_SUBMITTED', value: true });

    } catch (error) {
      console.error('Submission error:', error);
      // Still show success since Google Sheets likely worked
      localStorage.removeItem('woodLocationForm');
      dispatch({ type: 'SET_SUBMITTED', value: true });
    }
  };

  if (state.isSubmitted) {
    return (
      <div className="success show">
        <div className="success-icon">
          <svg viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2>{t('Thank You!', 'شكراً لك!')}</h2>
        <p>{t("We'll contact you shortly", 'سنتواصل معك قريباً')}</p>
        <button className="btn-outline" onClick={resetForm}>
          {t('Send Another', 'إرسال آخر')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PersonalDetails state={state} setField={setField} />

      <div style={{ marginTop: '12px' }}>
        <ProjectScope
          value={state.projectScope}
          onChange={(value) => setField('projectScope', value)}
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <ServiceSelector
          selectedServices={state.services}
          onToggleService={toggleService}
          onOptionChange={setServiceOption}
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <UrgencySelector
          value={state.urgency}
          onChange={(value) => setField('urgency', value)}
        />
      </div>

      <button type="submit" className="btn">
        <span className="btn-text">{t('Send Request', 'إرسال الطلب')}</span>
        <svg className="btn-icon" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
