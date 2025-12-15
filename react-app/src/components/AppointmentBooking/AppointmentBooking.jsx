import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { kuwaitCities } from '../../data/kuwaitAreas';
import './AppointmentBooking.css';

// Google Apps Script Web App URL (same as LeadForm - unified endpoint)
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzdtjd0AtWJe-9kgkdwTAN0uvB5fTd2-FRI8kFVz7Yj0dpcn0XC8zjEmVA_8lvGGb4AaA/exec';

// FormSubmit for email confirmation
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/moayad@qualiasolutions.net';

// Available time slots (9 AM - 5 PM)
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
];

// Meeting types
const meetingTypes = [
  { id: 'site-visit', labelEn: 'Site Visit', labelAr: 'زيارة موقع' },
  { id: 'office-meeting', labelEn: 'Office Meeting', labelAr: 'اجتماع في المكتب' },
];

export function AppointmentBooking() {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+965',
    area: '',
    locationOption: 'manual', // 'manual' or 'maps'
    googleMapsLink: '',
    block: '',
    streetName: '',
    houseNumber: '',
    siteContactNumber: '',
    siteContactCountryCode: '+965',
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
      // Fetch booked slots from Google Sheets
      const response = await fetch(`${GOOGLE_SHEET_URL}?action=bookedSlots&date=${date}`);
      const result = await response.json();

      if (result.success && result.bookedSlots) {
        setBookedSlots(result.bookedSlots);
      } else {
        // Fallback to localStorage if API fails
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
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      // Fallback to localStorage on network error
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('First name is required', 'الاسم الأول مطلوب');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('Last name is required', 'الاسم الأخير مطلوب');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('Phone is required', 'رقم الهاتف مطلوب');
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('Invalid phone number', 'رقم هاتف غير صالح');
    }

    if (!formData.area) {
      newErrors.area = t('Please select an area', 'يرجى اختيار المنطقة');
    }

    // Validate location based on selected option
    if (formData.locationOption === 'maps') {
      if (!formData.googleMapsLink.trim()) {
        newErrors.googleMapsLink = t('Google Maps link is required', 'رابط خرائط جوجل مطلوب');
      } else if (!formData.googleMapsLink.includes('google.com/maps') && !formData.googleMapsLink.includes('goo.gl/maps')) {
        newErrors.googleMapsLink = t('Please enter a valid Google Maps link', 'يرجى إدخال رابط خرائط جوجل صحيح');
      }
    } else {
      if (!formData.block.trim()) {
        newErrors.block = t('Block is required', 'رقم القطعة مطلوب');
      }
      if (!formData.streetName.trim()) {
        newErrors.streetName = t('Street name is required', 'اسم الشارع مطلوب');
      }
      if (!formData.houseNumber.trim()) {
        newErrors.houseNumber = t('House number is required', 'رقم المنزل مطلوب');
      }
    }

    if (!formData.siteContactNumber.trim()) {
      newErrors.siteContactNumber = t('Site contact number is required', 'رقم التواصل مطلوب');
    } else if (!/^\d{7,15}$/.test(formData.siteContactNumber.replace(/\s/g, ''))) {
      newErrors.siteContactNumber = t('Invalid phone number', 'رقم هاتف غير صالح');
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

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const fullPhone = `${formData.countryCode} ${formData.phone}`.trim();
    const siteContactFull = `${formData.siteContactCountryCode} ${formData.siteContactNumber}`.trim();
    const meetingTypeLabel = meetingTypes.find(m => m.id === formData.meetingType)?.labelEn || formData.meetingType;
    const timeSlotLabel = timeSlots.find(s => s.id === formData.timeSlot)?.labelEn || formData.timeSlot;
    const areaLabel = kuwaitCities.find(c => c.id === formData.area)?.labelEn || formData.area;

    // Build location string
    let locationString = '';
    if (formData.locationOption === 'maps') {
      locationString = formData.googleMapsLink;
    } else {
      locationString = `Block ${formData.block}, ${formData.streetName}, House ${formData.houseNumber}`;
    }

    try {
      // Store locally (simulating database)
      const stored = localStorage.getItem('woodLocationAppointments');
      const appointments = stored ? JSON.parse(stored) : [];
      appointments.push({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: fullPhone,
        area: formData.area,
        location: locationString,
        siteContactNumber: siteContactFull,
        meetingType: formData.meetingType,
        date: formData.date,
        timeSlot: formData.timeSlot,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('woodLocationAppointments', JSON.stringify(appointments));

      // Send to Google Sheets (fire and forget)
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking', // Route to booking handler
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: fullName,
          phone: fullPhone,
          area: areaLabel,
          location: locationString,
          siteContactNumber: siteContactFull,
          meetingType: meetingTypeLabel,
          date: formData.date,
          timeSlot: formData.timeSlot, // Send the ID (e.g., '10:00') for slot matching
        }),
      });

      // Send email confirmation via FormSubmit
      const emailFormData = new FormData();
      emailFormData.append('First Name', formData.firstName);
      emailFormData.append('Last Name', formData.lastName);
      emailFormData.append('Phone', fullPhone);
      emailFormData.append('Area', areaLabel);
      emailFormData.append('Location', locationString);
      emailFormData.append('Site Contact', siteContactFull);
      emailFormData.append('Meeting Type', meetingTypeLabel);
      emailFormData.append('Date', formData.date);
      emailFormData.append('Time', timeSlotLabel);
      emailFormData.append('_subject', `New Appointment Booking - ${fullName}`);
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
      firstName: '',
      lastName: '',
      phone: '',
      countryCode: '+965',
      area: '',
      locationOption: 'manual',
      googleMapsLink: '',
      block: '',
      streetName: '',
      houseNumber: '',
      siteContactNumber: '',
      siteContactCountryCode: '+965',
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

        <div className="field-row">
          <div className={`field ${errors.firstName ? 'error' : ''}`}>
            <label>{t('First Name', 'الاسم الأول')} *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              placeholder={t('First name', 'الاسم الأول')}
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className={`field ${errors.lastName ? 'error' : ''}`}>
            <label>{t('Last Name', 'الاسم الأخير')} *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              placeholder={t('Last name', 'الاسم الأخير')}
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>
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

        <div className={`field ${errors.area ? 'error' : ''}`}>
          <label>{t('Area', 'المنطقة')} *</label>
          <select
            value={formData.area}
            onChange={(e) => setField('area', e.target.value)}
            className="area-select"
          >
            <option value="">{t('Select area', 'اختر المنطقة')}</option>
            {kuwaitCities.map((city) => (
              <option key={city.id} value={city.id}>
                {lang === 'ar' ? city.labelAr : city.labelEn}
              </option>
            ))}
          </select>
          {errors.area && <span className="error-text">{errors.area}</span>}
        </div>
      </div>

      {/* Location Details */}
      <div className="form-section">
        <h3 className="section-title">{t('Location Details', 'تفاصيل الموقع')}</h3>

        <div className="location-options">
          <button
            type="button"
            className={`location-option-btn ${formData.locationOption === 'maps' ? 'active' : ''}`}
            onClick={() => setField('locationOption', 'maps')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{t('Google Maps Link', 'رابط خرائط جوجل')}</span>
          </button>
          <button
            type="button"
            className={`location-option-btn ${formData.locationOption === 'manual' ? 'active' : ''}`}
            onClick={() => setField('locationOption', 'manual')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>{t('Enter Manually', 'إدخال يدوي')}</span>
          </button>
        </div>

        {formData.locationOption === 'maps' ? (
          <div className={`field ${errors.googleMapsLink ? 'error' : ''}`}>
            <label>{t('Google Maps Link', 'رابط خرائط جوجل')} *</label>
            <input
              type="url"
              value={formData.googleMapsLink}
              onChange={(e) => setField('googleMapsLink', e.target.value)}
              placeholder={t('Paste Google Maps link here', 'الصق رابط خرائط جوجل هنا')}
            />
            {errors.googleMapsLink && <span className="error-text">{errors.googleMapsLink}</span>}
          </div>
        ) : (
          <>
            <div className={`field ${errors.block ? 'error' : ''}`}>
              <label>{t('Block', 'القطعة')} *</label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) => setField('block', e.target.value)}
                placeholder={t('Block number', 'رقم القطعة')}
              />
              {errors.block && <span className="error-text">{errors.block}</span>}
            </div>

            <div className={`field ${errors.streetName ? 'error' : ''}`}>
              <label>{t('Street Name', 'اسم الشارع')} *</label>
              <input
                type="text"
                value={formData.streetName}
                onChange={(e) => setField('streetName', e.target.value)}
                placeholder={t('Street name', 'اسم الشارع')}
              />
              {errors.streetName && <span className="error-text">{errors.streetName}</span>}
            </div>

            <div className={`field ${errors.houseNumber ? 'error' : ''}`}>
              <label>{t('House Number', 'رقم المنزل')} *</label>
              <input
                type="text"
                value={formData.houseNumber}
                onChange={(e) => setField('houseNumber', e.target.value)}
                placeholder={t('House number', 'رقم المنزل')}
              />
              {errors.houseNumber && <span className="error-text">{errors.houseNumber}</span>}
            </div>
          </>
        )}

        <div className={`field ${errors.siteContactNumber ? 'error' : ''}`}>
          <label>{t('Site Contact Number', 'رقم التواصل للموقع')} *</label>
          <div className="phone-input-group">
            <div className="country-code-select">
              <select
                value={formData.siteContactCountryCode}
                onChange={(e) => setField('siteContactCountryCode', e.target.value)}
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
                value={formData.siteContactNumber}
                onChange={(e) => setField('siteContactNumber', e.target.value.replace(/\D/g, ''))}
                placeholder={t('Contact number for site', 'رقم التواصل للموقع')}
              />
            </div>
          </div>
          {errors.siteContactNumber && <span className="error-text">{errors.siteContactNumber}</span>}
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
