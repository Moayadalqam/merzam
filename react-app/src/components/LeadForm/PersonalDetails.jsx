import { useLanguage } from '../../context/LanguageContext';

// Country codes for dropdown
const countryCodes = [
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
  { code: '+964', country: 'Iraq', flag: '🇮🇶' },
];

// Format phone number (local part only, no country code)
function formatLocalPhone(value) {
  let digits = value.replace(/\D/g, '');
  digits = digits.substring(0, 10);

  // Format: XXXX XXXX for 8 digits
  if (digits.length <= 4) {
    return digits;
  } else if (digits.length <= 8) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  } else {
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
  }
}

export function PersonalDetails({ state, setField }) {
  const { t } = useLanguage();

  const handlePhoneChange = (e) => {
    const formatted = formatLocalPhone(e.target.value);
    setField('phone', formatted);
  };

  const handlePhonePaste = (e) => {
    setTimeout(() => {
      const formatted = formatLocalPhone(e.target.value);
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

      {/* Phone - Full Width */}
      <div className={`field ${state.errors.phone ? 'error' : ''}`}>
        <label htmlFor="phone">{t('Contact Number', 'رقم التواصل')}</label>
        <div className="phone-input-group">
          <div className="select-wrap country-code-select">
            <select
              id="countryCode"
              value={state.countryCode || '+965'}
              onChange={(e) => setField('countryCode', e.target.value)}
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <svg className="select-icon" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <input
            type="tel"
            id="phone"
            name="Phone"
            placeholder={t('Enter phone number', 'أدخل رقم الهاتف')}
            inputMode="numeric"
            maxLength={12}
            autoComplete="tel-local"
            required
            value={state.phone}
            onChange={handlePhoneChange}
            onPaste={handlePhonePaste}
            className="phone-number-input"
          />
        </div>
      </div>

      {/* City - Full Width */}
      <div className={`field ${state.errors.city ? 'error' : ''}`}>
        <label htmlFor="city">{t('Location (City)', 'الموقع (المدينة)')}</label>
        <input
          type="text"
          id="city"
          name="City"
          placeholder={t('Enter city name', 'أدخل اسم المدينة')}
          autoComplete="address-level2"
          value={state.city}
          onChange={(e) => setField('city', e.target.value)}
        />
      </div>
    </div>
  );
}
