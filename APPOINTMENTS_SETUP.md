# Appointments Booking System Setup

## Booking Page URL
**Live Booking Link:** `https://merzamnewbarcode.vercel.app/#book`

## WhatsApp Broadcast Message

### English:
```
Hello Visitor,
Thank you for stopping by Mirzzam Expo. It was a pleasure meeting you.

Book a site visit or an office meeting here: https://merzamnewbarcode.vercel.app/#book
```

### Arabic:
```
مرحبًا زائرنا الكريم،
شكرًا لزيارتكم لنا في معرض ميرزام Mirzzam Expo ، سعدنا بلقائكم.

لحجز زيارة للموقع أو اجتماع في المكتب، يرجى الضغط على الرابط: https://merzamnewbarcode.vercel.app/#book
```

### Combined:
```
Hello Visitor,
Thank you for stopping by Mirzzam Expo. It was a pleasure meeting you.

Book a site visit or an office meeting here: https://merzamnewbarcode.vercel.app/#book


مرحبًا زائرنا الكريم،
شكرًا لزيارتكم لنا في معرض ميرزام Mirzzam Expo ، سعدنا بلقائكم.

لحجز زيارة للموقع أو اجتماع في المكتب، يرجى الضغط على الرابط: https://merzamnewbarcode.vercel.app/#book

Woodlocation
```

---

## Google Apps Script Setup (for storing appointments)

### Step 1: Create a new Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Wood Location Appointments"
3. Add these column headers in row 1:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Phone`
   - D1: `Meeting Type`
   - E1: `Date`
   - F1: `Time`
   - G1: `Status`

### Step 2: Create the Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code and paste this:

```javascript
// Google Apps Script for Wood Location Appointments

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Add new row
    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuwait' }),
      data.name,
      data.phone,
      data.meetingType,
      data.date,
      data.timeSlot,
      'Pending'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get booked slots for a specific date
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const date = e.parameter.date;

    if (!date) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Date parameter required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const bookedSlots = [];

    // Skip header row
    for (let i = 1; i < data.length; i++) {
      if (data[i][4] === date) { // Column E is Date
        bookedSlots.push(data[i][5]); // Column F is Time
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ bookedSlots: bookedSlots }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy the Apps Script
1. Click **Deploy > New deployment**
2. Select type: **Web app**
3. Settings:
   - Description: "Appointments API"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### Step 4: Update the React Component
Replace the placeholder URL in `AppointmentBooking.jsx` (line 6) with your new URL:
```javascript
const APPOINTMENTS_SHEET_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

---

## WhatsApp Broadcast Instructions

### Option 1: WhatsApp Business (Recommended)
1. Open WhatsApp Business on your phone (+96597746458)
2. Go to **More options > New broadcast**
3. Select up to 256 contacts
4. Paste the message above
5. Send

### Option 2: WhatsApp Web
1. Go to web.whatsapp.com
2. Open each contact and paste the message
3. Or use a bulk sender tool (third-party)

### Option 3: WhatsApp API (For 120+ contacts)
For large-scale messaging, consider using the WhatsApp Business API through providers like:
- Twilio
- MessageBird
- WATI

---

## Current Features

1. **Meeting Types**: Site Visit or Office Meeting
2. **Date Selection**: Next 30 days
3. **Time Slots**: 9 AM - 6 PM (hourly)
4. **Double-booking Prevention**: Already booked slots are disabled
5. **Email Notification**: Sent to moayad@qualiasolutions.net
6. **Bilingual**: Arabic/English support
7. **Mobile-First**: Responsive design

---

## Quick Test

1. Run locally: `cd react-app && npm run dev`
2. Open: `http://localhost:5173/#book`
3. Test the booking flow
