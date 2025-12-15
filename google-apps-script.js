/**
 * Wood Location - Google Apps Script (Unified)
 * Handles both Lead Form submissions and Appointment Bookings
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Google Sheets spreadsheet (ID: 1jCP6QFngpjSxiJimYavjuvYzbFtbR8hnOE0tg5SrdjM)
 * 2. Create two sheet tabs: "Leads" and "Bookings"
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this entire script
 * 5. Click Deploy > New deployment
 * 6. Select type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click Deploy and copy the Web App URL
 * 10. Update GOOGLE_SHEET_URL in LeadForm.jsx and AppointmentBooking.jsx
 *
 * LEADS SHEET COLUMNS (Row 1 headers):
 * A: Timestamp, B: First Name, C: Second Name, D: Full Name, E: Phone, F: City,
 * G: Architecture Design, H: Interior Design, I: Scope Required, J: Visit Date,
 * K: Visit Time Slot, L: Project Priority, M: Project Value, N: Pre-Sales Status
 *
 * BOOKINGS SHEET COLUMNS (Row 1 headers):
 * A: Timestamp, B: First Name, C: Last Name, D: Full Name, E: Phone, F: Area,
 * G: Location, H: Site Contact, I: Meeting Type, J: Booking Date, K: Time Slot, L: Status
 */

// Configuration
const SHEET_ID = '1jCP6QFngpjSxiJimYavjuvYzbFtbR8hnOE0tg5SrdjM';
const LEADS_SHEET_NAME = 'Leads';
const BOOKINGS_SHEET_NAME = 'Bookings';

/**
 * Handle POST requests - routes to appropriate handler based on type
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.type === 'booking') {
      return handleBookingSubmission(data);
    } else {
      return handleLeadSubmission(data);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests - returns booked slots or API status
 */
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'bookedSlots') {
      return getBookedSlots(e.parameter.date);
    }

    // Default: return API status
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'OK',
        message: 'Wood Location API is running',
        version: '3.0',
        endpoints: {
          leads: 'POST with lead data',
          bookings: 'POST with type: "booking"',
          bookedSlots: 'GET ?action=bookedSlots&date=YYYY-MM-DD'
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle Lead Form submissions - saves to Leads sheet
 */
function handleLeadSubmission(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(LEADS_SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(LEADS_SHEET_NAME);
      sheet.getRange(1, 1, 1, 14).setValues([[
        'Timestamp', 'First Name', 'Second Name', 'Full Name', 'Phone', 'City',
        'Architecture Design', 'Interior Design', 'Scope Required',
        'Visit Date', 'Visit Time Slot', 'Project Priority', 'Project Value', 'Pre-Sales Status'
      ]]);
      sheet.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#a1622d').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kuwait',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const rowData = [
      timestamp,
      data.firstName || '',
      data.secondName || '',
      data.fullName || '',
      "'" + (data.phone || ''), // Prefix with ' to prevent formula parsing
      data.city || '',
      data.archDesign || '',
      data.interiorDesign || '',
      data.scope || '',
      data.visitDate || '',
      data.visitTimeSlot || '',
      data.projectPriority || 'Standard',
      data.projectValue || 'Medium',
      data.preSalesStatus || 'Not Contacted'
    ];

    sheet.appendRow(rowData);
    sheet.autoResizeColumns(1, 14);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Lead saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error saving lead:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle Appointment Booking submissions - saves to Bookings sheet
 */
function handleBookingSubmission(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(BOOKINGS_SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(BOOKINGS_SHEET_NAME);
    }

    // Add headers if sheet is empty (row 1 is empty)
    const firstCell = sheet.getRange(1, 1).getValue();
    if (!firstCell || firstCell === '') {
      sheet.getRange(1, 1, 1, 12).setValues([[
        'Timestamp', 'First Name', 'Last Name', 'Full Name', 'Phone', 'Area',
        'Location', 'Site Contact', 'Meeting Type', 'Booking Date', 'Time Slot', 'Status'
      ]]);
      sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#a1622d').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kuwait',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const rowData = [
      timestamp,
      data.firstName || '',
      data.lastName || '',
      data.fullName || '',
      "'" + (data.phone || ''), // Prefix with ' to prevent formula parsing
      data.area || '',
      data.location || '',
      "'" + (data.siteContactNumber || ''), // Prefix with ' to prevent formula parsing
      data.meetingType || '',
      data.date || '',
      data.timeSlot || '',
      'Pending'
    ];

    sheet.appendRow(rowData);
    sheet.autoResizeColumns(1, 12);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Booking saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error saving booking:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get booked time slots for a specific date
 */
function getBookedSlots(date) {
  try {
    if (!date) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Date parameter required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(BOOKINGS_SHEET_NAME);

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, bookedSlots: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const bookedSlots = [];

    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const bookingDate = row[9]; // Column J: Booking Date
      const timeSlot = row[10];   // Column K: Time Slot
      const status = row[11];     // Column L: Status

      // Only include if date matches and status is not cancelled
      if (bookingDate === date && status !== 'Cancelled') {
        bookedSlots.push(timeSlot);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, bookedSlots: bookedSlots }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error getting booked slots:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function for leads - run this to verify setup
 */
function testLeadSubmission() {
  const testData = {
    firstName: 'Test',
    secondName: 'User',
    fullName: 'Test User',
    phone: '+965 1234 5678',
    city: 'Kuwait City',
    archDesign: 'Required',
    interiorDesign: 'Available',
    scope: 'Customized Kitchen, Customized TV Unit',
    visitDate: '2025-01-15',
    visitTimeSlot: '10:00 AM',
    projectPriority: 'Standard',
    projectValue: 'Medium',
    preSalesStatus: 'Not Contacted'
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

/**
 * Test function for bookings - run this to verify setup
 */
function testBookingSubmission() {
  const testData = {
    type: 'booking',
    firstName: 'Test',
    lastName: 'Booking',
    fullName: 'Test Booking',
    phone: '+965 9876 5432',
    area: 'Salmiya',
    location: 'Block 5, Street 10, House 15',
    siteContactNumber: '+965 5555 1234',
    meetingType: 'Site Visit',
    date: '2025-01-20',
    timeSlot: '10:00'
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

/**
 * Test function for getting booked slots
 */
function testGetBookedSlots() {
  const mockEvent = {
    parameter: {
      action: 'bookedSlots',
      date: '2025-01-20'
    }
  };

  const result = doGet(mockEvent);
  Logger.log(result.getContent());
}

/**
 * Initialize Bookings sheet with headers - RUN THIS ONCE to set up the sheet
 */
function initializeBookingsSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(BOOKINGS_SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(BOOKINGS_SHEET_NAME);
  }

  // Clear existing content and set headers
  sheet.clear();
  sheet.getRange(1, 1, 1, 12).setValues([[
    'Timestamp', 'First Name', 'Last Name', 'Full Name', 'Phone', 'Area',
    'Location', 'Site Contact', 'Meeting Type', 'Booking Date', 'Time Slot', 'Status'
  ]]);
  sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#a1622d').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 12);

  Logger.log('Bookings sheet initialized with headers');
}
