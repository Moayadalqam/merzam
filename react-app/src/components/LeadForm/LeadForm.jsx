import { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useLeadForm } from '../../hooks/useLeadForm';
import { PersonalDetails } from './PersonalDetails';
import { ProjectScope } from './ProjectScope';
import { ServiceSelector } from './ServiceSelector';
import { UrgencySelector } from './SalesmanMode';

const FORMSUBMIT_URL = 'https://formsubmit.co/moayad@qualiasolutions.net';
const REDIRECT_URL = 'https://woodlocation.com/?submitted=true';

// Google Apps Script Web App URL for saving leads to Google Sheets
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyYM6csdeVCDUrcuEAzdzHLGrCYkPHcd2tN7IUhzY_Hg77jprf5zLx8mCzv3rBD05X_Pw/exec';

export function LeadForm() {
  const { t } = useLanguage();
  const formRef = useRef(null);
  const {
    state,
    setField,
    toggleService,
    setServiceOption,
    validate,
    formatServicesForEmail,
    resetForm,
  } = useLeadForm();

  // Send data to Google Sheets (runs in background, doesn't block form)
  const sendToGoogleSheets = async () => {
    try {
      const payload = {
        name: state.name,
        phone: state.phone,
        email: state.email,
        area: state.area,
        projectScope: state.projectScope || 'Not specified',
        urgency: state.urgency || 'Not specified',
        services: formatServicesForEmail(),
      };

      // Send to Google Sheets (fire and forget - don't wait for response)
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Silently fail - FormSubmit is the primary method
      console.error('Google Sheets error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Send to Google Sheets (background, non-blocking)
    sendToGoogleSheets();

    // Clear localStorage before submitting
    localStorage.removeItem('woodLocationForm');
    // Submit the form natively to FormSubmit
    formRef.current?.submit();
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
    <form
      ref={formRef}
      action={FORMSUBMIT_URL}
      method="POST"
      onSubmit={handleSubmit}
    >
      {/* FormSubmit hidden fields */}
      <input type="hidden" name="_subject" value="New Inquiry - Mirzaam Expo 2025" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={REDIRECT_URL} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="Project Scope" value={state.projectScope || 'Not specified'} />
      <input type="hidden" name="Project Urgency" value={state.urgency || 'Not specified'} />
      <input type="hidden" name="Services" value={formatServicesForEmail()} />

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
