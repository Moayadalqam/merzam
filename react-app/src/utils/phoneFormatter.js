/**
 * Format phone number as XXX XXX XXXX
 * @param {string} value - Raw phone input
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(value) {
  // Strip all non-numeric characters
  let digits = value.replace(/\D/g, '');

  // Limit to 12 digits
  digits = digits.substring(0, 12);

  // Format: XXX XXX XXXX
  let formatted = '';
  for (let i = 0; i < digits.length; i++) {
    if (i === 3 || i === 6) {
      formatted += ' ';
    }
    formatted += digits[i];
  }

  return formatted;
}

/**
 * Validate phone number has minimum digits
 * @param {string} phone - Phone number to validate
 * @param {number} minDigits - Minimum required digits
 * @returns {boolean} Whether phone is valid
 */
export function isValidPhone(phone, minDigits = 6) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= minDigits;
}
