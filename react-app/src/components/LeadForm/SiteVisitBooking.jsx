import { useLanguage } from '../../context/LanguageContext';
import { timeSlots } from '../../data/services';

export function SiteVisitBooking({ state, setField }) {
  const { lang, t } = useLanguage();

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-section">
      <h3 className="section-title">{t('Site Visit Booking', 'حجز زيارة الموقع')}</h3>

      <div className="form-row">
        {/* Preferred Date */}
        <div className="field">
          <label>{t('Preferred Date', 'التاريخ المفضل')}</label>
          <input
            type="date"
            value={state.visitDate}
            min={today}
            onChange={(e) => setField('visitDate', e.target.value)}
          />
        </div>

        {/* Time Slot */}
        <div className="field">
          <label>{t('Time Slot', 'الفترة الزمنية')}</label>
          <select
            value={state.visitTimeSlot}
            onChange={(e) => setField('visitTimeSlot', e.target.value)}
          >
            <option value="">{t('Select time slot', 'اختر الفترة الزمنية')}</option>
            {timeSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {lang === 'ar' ? slot.labelAr : slot.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
