import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './AppointmentBooking.css';

// Google Apps Script Web App URL for appointments
const APPOINTMENTS_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwAppointments/exec';

// FormSubmit for email confirmation
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/moayad@qualiasolutions.net';

// Available time slots
const timeSlots = [
  { id: '09:00', labelEn: '9:00 AM', labelAr: '9:00 صباحاً' },
  { id: '10:00', labelEn: '10:00 AM', labelAr: '10:00 صباحاً' },
  { id: '11:00', labelEn: '11:00 AM', labelAr: '11:00 صباحاً' },
  { id: '12:00', labelEn: '12:00 PM', labelAr: '12:00 ظهراً' },
  { id: '13:00', labelEn: '1:00 PM', labelAr: '1:00 مساءً' },
  { id: '14:00', labelEn: '2:00 PM', labelAr: '2:00 مساءً' },
  { id: '15:00', labelEn: '3:00 PM', labelAr: '3:00 مساءً' },
  { id: '16:00', labelEn: '4:00 PM', labelAr: '4:00 مساءً' },
  { id: '17:00', labelEn: '5:00 PM', labelAr: '5:00 مساءً' },
  { id: '18:00', labelEn: '6:00 PM', labelAr: '6:00 مساءً' },
];

// Meeting types
const meetingTypes = [
  { id: 'site-visit', labelEn: 'Site Visit', labelAr: 'زيارة موقع' },
  { id: 'office-meeting', labelEn: 'Office Meeting', labelAr: 'اجتماع في المكتب' },
];

export function AppointmentBooking() {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    countryCode: '+965',
    meetingType: '',
    date: '',
    timeSlot: '',
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Get date 30 days from now
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Fetch booked slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchBookedSlots(formData.date);
    }
  }, [formData.date]);

  const fetchBookedSlots = async (date) => {
    try {
      // For now, we'll use localStorage to track booked slots
      // In production, this would fetch from Google Sheets
      const stored = localStorage.getItem('woodLocationAppointments');
      if (stored) {
        const appointments = JSON.parse(stored);
        const slotsForDate = appointments
          .filter(apt => apt.date === date)
          .map(apt => apt.timeSlot);
        setBookedSlots(slotsForDate);
      } else {
        setBookedSlots([]);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

  const setField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('Name is required', 'الاسم مطلوب');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('Phone is required', 'رقم الهاتف مطلوب');
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('Invalid phone number', 'رقم هاتف غير صالح');
    }

    if (!formData.meetingType) {
      newErrors.meetingType = t('Please select meeting type', 'يرجى اختيار نوع الاجتماع');
    }

    if (!formData.date) {
      newErrors.date = t('Please select a date', 'يرجى اختيار تاريخ');
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = t('Please select a time', 'يرجى اختيار وقت');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Check if slot is still available
    if (bookedSlots.includes(formData.timeSlot)) {
      setErrors({ timeSlot: t('This time slot is no longer available', 'هذا الوقت لم يعد متاحاً') });
      return;
    }

    setIsLoading(true);

    const fullPhone = `${formData.countryCode} ${formData.phone}`.trim();
    const meetingTypeLabel = meetingTypes.find(m => m.id === formData.meetingType)?.labelEn || formData.meetingType;
    const timeSlotLabel = timeSlots.find(s => s.id === formData.timeSlot)?.labelEn || formData.timeSlot;

    try {
      // Store locally (simulating database)
      const stored = localStorage.getItem('woodLocationAppointments');
      const appointments = stored ? JSON.parse(stored) : [];
      appointments.push({
        name: formData.name,
        phone: fullPhone,
        meetingType: formData.meetingType,
        date: formData.date,
        timeSlot: formData.timeSlot,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('woodLocationAppointments', JSON.stringify(appointments));

      // Send to Google Sheets (fire and forget)
      fetch(APPOINTMENTS_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: fullPhone,
          meetingType: meetingTypeLabel,
          date: formData.date,
          timeSlot: timeSlotLabel,
        }),
      });

      // Send email confirmation via FormSubmit
      const emailFormData = new FormData();
      emailFormData.append('Name', formData.name);
      emailFormData.append('Phone', fullPhone);
      emailFormData.append('Meeting Type', meetingTypeLabel);
      emailFormData.append('Date', formData.date);
      emailFormData.append('Time', timeSlotLabel);
      emailFormData.append('_subject', `New Appointment Booking - ${formData.name}`);
      emailFormData.append('_captcha', 'false');
      emailFormData.append('_template', 'table');

      await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        body: emailFormData,
        headers: { 'Accept': 'application/json' },
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      // Still show success since localStorage worked
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      countryCode: '+965',
      meetingType: '',
      date: '',
      timeSlot: '',
    });
    setIsSubmitted(false);
    setErrors({});
    setBookedSlots([]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', options);
  };

  if (isSubmitted) {
    const timeSlotLabel = timeSlots.find(s => s.id === formData.timeSlot);
    const meetingTypeLabel = meetingTypes.find(m => m.id === formData.meetingType);

    return (
      <div className="booking-success">
        <div className="success-icon">
          <svg viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2>{t('Appointment Confirmed!', 'تم تأكيد الموعد!')}</h2>
        <div className="booking-details">
          <div className="detail-item">
            <span className="detail-label">{t('Date', 'التاريخ')}</span>
            <span className="detail-value">{formatDate(formData.date)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('Time', 'الوقت')}</span>
            <span className="detail-value">
              {lang === 'ar' ? timeSlotLabel?.labelAr : timeSlotLabel?.labelEn}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('Type', 'النوع')}</span>
            <span className="detail-value">
              {lang === 'ar' ? meetingTypeLabel?.labelAr : meetingTypeLabel?.labelEn}
            </span>
          </div>
        </div>
        <p className="success-message">
          {t('We will contact you shortly to confirm.', 'سنتواصل معك قريباً للتأكيد.')}
        </p>
        <button className="btn-outline" onClick={resetForm}>
          {t('Book Another', 'حجز آخر')}
        </button>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      {/* Meeting Type Selection */}
      <div className="form-section">
        <h3 className="section-title">{t('Meeting Type', 'نوع الاجتماع')}</h3>
        <div className="meeting-type-grid">
          {meetingTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`meeting-type-btn ${formData.meetingType === type.id ? 'active' : ''}`}
              onClick={() => setField('meetingType', type.id)}
            >
              <span className="type-icon">
                {type.id === 'site-visit' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </span>
              <span className="type-label">
                {lang === 'ar' ? type.labelAr : type.labelEn}
              </span>
            </button>
          ))}
        </div>
        {errors.meetingType && <span className="error-text">{errors.meetingType}</span>}
      </div>

      {/* Personal Details */}
      <div className="form-section">
        <h3 className="section-title">{t('Your Details', 'بياناتك')}</h3>

        <div className={`field ${errors.name ? 'error' : ''}`}>
          <label>{t('Full Name', 'الاسم الكامل')} *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder={t('Enter your name', 'أدخل اسمك')}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className={`field ${errors.phone ? 'error' : ''}`}>
          <label>{t('Phone Number', 'رقم الهاتف')} *</label>
          <div className="phone-input-group">
            <div className="country-code-select">
              <select
                value={formData.countryCode}
                onChange={(e) => setField('countryCode', e.target.value)}
              >
                <option value="+965">+965</option>
                <option value="+966">+966</option>
                <option value="+971">+971</option>
                <option value="+973">+973</option>
                <option value="+974">+974</option>
                <option value="+968">+968</option>
              </select>
            </div>
            <div className="phone-number-input">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setField('phone', e.target.value.replace(/\D/g, ''))}
                placeholder={t('Phone number', 'رقم الهاتف')}
              />
            </div>
          </div>
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="form-section">
        <h3 className="section-title">{t('Select Date & Time', 'اختر التاريخ والوقت')}</h3>

        <div className={`field ${errors.date ? 'error' : ''}`}>
          <label>{t('Preferred Date', 'التاريخ المفضل')} *</label>
          <input
            type="date"
            value={formData.date}
            min={today}
            max={maxDateStr}
            onChange={(e) => setField('date', e.target.value)}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        {formData.date && (
          <div className={`field ${errors.timeSlot ? 'error' : ''}`}>
            <label>{t('Available Times', 'الأوقات المتاحة')} *</label>
            <div className="time-slots-grid">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    className={`time-slot-btn ${formData.timeSlot === slot.id ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                    onClick={() => !isBooked && setField('timeSlot', slot.id)}
                    disabled={isBooked}
                  >
                    {lang === 'ar' ? slot.labelAr : slot.labelEn}
                    {isBooked && <span className="booked-label">{t('Booked', 'محجوز')}</span>}
                  </button>
                );
              })}
            </div>
            {errors.timeSlot && <span className="error-text">{errors.timeSlot}</span>}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className={`btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
        <span className="btn-text">{t('Confirm Booking', 'تأكيد الحجز')}</span>
        <svg className="btn-icon" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span className="spinner"></span>
      </button>
    </form>
  );
}
