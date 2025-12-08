/**
 * Wood Location Lead Form - Google Apps Script
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Google Sheets and create a new spreadsheet
 * 2. Add these column headers in Row 1:
 *    A: Timestamp
 *    B: First Name
 *    C: Second Name
 *    D: Full Name
 *    E: Phone
 *    F: City
 *    G: Architecture Design
 *    H: Interior Design
 *    I: Scope Required
 *    J: Visit Date
 *    K: Visit Time Slot
 *    L: Project Priority (internal)
 *    M: Project Value (internal)
 *    N: Pre-Sales Status (internal)
 *
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this entire script
 * 5. Click Deploy > New deployment
 * 6. Select type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click Deploy and copy the Web App URL
 * 10. Update GOOGLE_SHEET_URL in LeadForm.jsx with the new URL
 */

// Configuration - Update this with your Sheet ID
const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Get from spreadsheet URL
const SHEET_NAME = 'Leads'; // Name of the sheet tab

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Open the spreadsheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 14).setValues([[
        'Timestamp',
        'First Name',
        'Second Name',
        'Full Name',
        'Phone',
        'City',
        'Architecture Design',
        'Interior Design',
        'Scope Required',
        'Visit Date',
        'Visit Time Slot',
        'Project Priority',
        'Project Value',
        'Pre-Sales Status'
      ]]);
      // Format header row
      sheet.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#a1622d').setFontColor('#ffffff');
      // Freeze header row
      sheet.setFrozenRows(1);
    }

    // Prepare row data
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
      data.phone || '',
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

    // Append the row
    sheet.appendRow(rowData);

    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 14);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Lead saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error and return error response
    console.error('Error saving lead:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'OK',
      message: 'Wood Location Lead Form API is running',
      version: '2.0',
      columns: [
        'Timestamp', 'First Name', 'Second Name', 'Full Name', 'Phone', 'City',
        'Architecture Design', 'Interior Design', 'Scope Required',
        'Visit Date', 'Visit Time Slot', 'Project Priority', 'Project Value', 'Pre-Sales Status'
      ]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this to verify setup
function testSetup() {
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
    visitTimeSlot: '10:00 - 12:00',
    projectPriority: 'Standard',
    projectValue: 'Medium',
    preSalesStatus: 'Not Contacted'
  };

  // Simulate the POST request
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
