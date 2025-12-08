import { useLanguage } from '../../context/LanguageContext';
import { kuwaitCities } from '../../data/kuwaitAreas';
import { formatPhoneNumber } from '../../utils/phoneFormatter';

export function PersonalDetails({ state, setField }) {
  const { lang, t } = useLanguage();

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setField('phone', formatted);
  };

  const handlePhonePaste = (e) => {
    setTimeout(() => {
      const formatted = formatPhoneNumber(e.target.value);
      setField('phone', formatted);
    }, 10);
  };

  return (
    <div className="form-section">
      <h3 className="section-title">{t('Contact Details', 'بيانات التواصل')}</h3>

      <div className="form-row">
        {/* First Name */}
        <div className={`field ${state.errors.firstName ? 'error' : ''}`}>
          <label htmlFor="firstName">{t('First Name', 'الاسم الأول')}</label>
          <input
            type="text"
            id="firstName"
            name="FirstName"
            placeholder={t('Enter first name', 'أدخل الاسم الأول')}
            autoComplete="given-name"
            required
            value={state.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
          />
        </div>

        {/* Second Name */}
        <div className={`field ${state.errors.secondName ? 'error' : ''}`}>
          <label htmlFor="secondName">{t('Second Name', 'اسم العائلة')}</label>
          <input
            type="text"
            id="secondName"
            name="SecondName"
            placeholder={t('Enter second name', 'أدخل اسم العائلة')}
            autoComplete="family-name"
            required
            value={state.secondName}
            onChange={(e) => setField('secondName', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        {/* Phone */}
        <div className={`field ${state.errors.phone ? 'error' : ''}`}>
          <label htmlFor="phone">{t('Contact Number', 'رقم التواصل')}</label>
          <input
            type="tel"
            id="phone"
            name="Phone"
            placeholder="+965 XXXXXXXX"
            inputMode="numeric"
            maxLength={15}
            autoComplete="tel"
            required
            value={state.phone}
            onChange={handlePhoneChange}
            onPaste={handlePhonePaste}
          />
        </div>

        {/* City */}
        <div className={`field ${state.errors.city ? 'error' : ''}`}>
          <label htmlFor="city">{t('Location (City)', 'الموقع (المدينة)')}</label>
          <div className="select-wrap">
            <select
              id="city"
              name="City"
              value={state.city}
              onChange={(e) => setField('city', e.target.value)}
            >
              <option value="">
                {t('Select City', 'اختر المدينة')}
              </option>
              {kuwaitCities.map((city) => (
                <option key={city.id} value={city.labelEn}>
                  {lang === 'ar' ? city.labelAr : city.labelEn}
                </option>
              ))}
            </select>
            <svg className="select-icon" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
