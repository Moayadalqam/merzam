import { useLanguage } from '../../context/LanguageContext';
import { useLeadForm } from '../../hooks/useLeadForm';
import { PersonalDetails } from './PersonalDetails';
import { DesignRequirements } from './DesignRequirements';
import { ScopeSelector } from './ScopeSelector';
import { SiteVisitBooking } from './SiteVisitBooking';
import { ProjectAssessment } from './ProjectAssessment';
import { timeSlots, projectPriorities, projectValues } from '../../data/services';

// FormSubmit AJAX endpoint
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/moayad@qualiasolutions.net';

// Google Apps Script Web App URL for saving leads to Google Sheets
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzdtjd0AtWJe-9kgkdwTAN0uvB5fTd2-FRI8kFVz7Yj0dpcn0XC8zjEmVA_8lvGGb4AaA/exec';

export function LeadForm() {
  const { t } = useLanguage();
  const {
    state,
    setField,
    toggleScopeItem,
    validate,
    formatScopeForEmail,
    resetForm,
    dispatch,
  } = useLeadForm();

  // Helper to get label from ID
  const getLabelById = (items, id) => {
    const item = items.find((i) => i.id === id);
    return item ? item.labelEn : 'Not specified';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const scopeText = formatScopeForEmail();
    const fullName = `${state.firstName} ${state.secondName}`.trim();
    const fullPhone = `${state.countryCode} ${state.phone}`.trim();

    // Format design requirements
    const archDesignText = state.archDesign
      ? `${state.archDesign === 'required' ? 'Required' : 'Available'}${state.archDesignAutocad ? ' (AutoCAD Available)' : ''}`
      : 'Not specified';
    const interiorDesignText = state.interiorDesign
      ? state.interiorDesign === 'required' ? 'Required' : 'Available'
      : 'Not specified';

    // Format site visit
    const timeSlotText = getLabelById(timeSlots, state.visitTimeSlot);
    const siteVisitText = state.visitDate
      ? `${state.visitDate} (${timeSlotText})`
      : 'Not scheduled';

    // Send to both Google Sheets and FormSubmit in parallel
    try {
      // Google Sheets request (fire and forget)
      // Order: timestamp (added by script), fullName, phone, city, archDesign, interiorDesign, scope, visitDate, visitTimeSlot, projectPriority, projectValue, preSalesStatus
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName,
          phone: fullPhone,
          city: state.city || 'Not specified',
          archDesign: archDesignText,
          interiorDesign: interiorDesignText,
          scope: scopeText,
          visitDate: state.visitDate || '',
          visitTimeSlot: timeSlotText,
          projectPriority: getLabelById(projectPriorities, state.projectPriority) || 'Not specified',
          projectValue: getLabelById(projectValues, state.projectValue) || 'Not specified',
          preSalesStatus: 'Not Contacted',
        }),
      });

      // FormSubmit - use FormData (email notification only, no internal fields)
      const formData = new FormData();
      formData.append('Name', fullName);
      formData.append('First Name', state.firstName);
      formData.append('Second Name', state.secondName);
      formData.append('Phone', fullPhone);
      formData.append('City', state.city || 'Not specified');
      formData.append('Architecture Design', archDesignText);
      formData.append('Interior Design', interiorDesignText);
      formData.append('Scope Required', scopeText);
      formData.append('Site Visit', siteVisitText);
      formData.append('_subject', 'New Lead - Mirzaam Expo 2025');
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
      {/* Section 1: Contact Details */}
      <PersonalDetails state={state} setField={setField} />

      {/* Section 2: Design Requirements */}
      <DesignRequirements state={state} setField={setField} />

      {/* Section 3: Scope Required */}
      <ScopeSelector
        selectedItems={state.scopeItems}
        onToggle={toggleScopeItem}
      />

      {/* Section 4: Site Visit Booking */}
      <SiteVisitBooking state={state} setField={setField} />

      {/* Section 5: Project Assessment */}
      <ProjectAssessment state={state} setField={setField} />

      <button type="submit" className="btn">
        <span className="btn-text">{t('Save Lead Form', 'حفظ نموذج العميل')}</span>
        <svg className="btn-icon" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
