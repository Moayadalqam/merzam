import { useLanguage } from '../../context/LanguageContext';
import { kuwaitAreas } from '../../data/kuwaitAreas';
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
    <div className="form-grid">
      {/* Name */}
      <div className={`field ${state.errors.name ? 'error' : ''}`}>
        <label htmlFor="name">{t('Full Name', 'الاسم الكامل')}</label>
        <input
          type="text"
          id="name"
          name="Name"
          placeholder={t('Your name', 'اسمك')}
          autoComplete="name"
          required
          value={state.name}
          onChange={(e) => setField('name', e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className={`field ${state.errors.phone ? 'error' : ''}`}>
        <label htmlFor="phone">{t('Phone Number', 'رقم الهاتف')}</label>
        <input
          type="tel"
          id="phone"
          name="Phone"
          placeholder="5XX XXX XXXX"
          inputMode="numeric"
          maxLength={15}
          autoComplete="tel"
          required
          value={state.phone}
          onChange={handlePhoneChange}
          onPaste={handlePhonePaste}
        />
      </div>

      {/* Email */}
      <div className={`field ${state.errors.email ? 'error' : ''}`}>
        <label htmlFor="email">{t('Email', 'البريد الإلكتروني')}</label>
        <input
          type="email"
          id="email"
          name="Email"
          placeholder="your@email.com"
          autoComplete="email"
          required
          value={state.email}
          onChange={(e) => setField('email', e.target.value)}
        />
      </div>

      {/* Area */}
      <div className={`field ${state.errors.area ? 'error' : ''}`}>
        <label htmlFor="area">{t('Area', 'المنطقة')}</label>
        <div className="select-wrap">
          <select
            id="area"
            name="Area"
            required
            value={state.area}
            onChange={(e) => setField('area', e.target.value)}
          >
            <option value="" disabled>
              {t('Select area', 'اختر المنطقة')}
            </option>
            {kuwaitAreas.map((governorate) => (
              <optgroup
                key={governorate.id}
                label={lang === 'ar' ? governorate.labelAr : governorate.labelEn}
              >
                {governorate.areas.map((area) => (
                  <option key={area.id} value={area.labelEn}>
                    {lang === 'ar' ? area.labelAr : area.labelEn}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <svg className="select-icon" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
