# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mobile-first lead form for Wood Location's exhibition booth at Mirzaam 2025. React (Vite) app with bilingual AR/EN support and dual form submission (FormSubmit + Google Sheets).

**Live URL:** https://merzamnewbarcode.vercel.app

## Development Commands

```bash
cd react-app
npm install
npm run dev      # http://localhost:5173
npm run build    # Output to dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Architecture

### React App (`react-app/src/`)

- **App.jsx** - Hash-based routing (`#qr` for QR generator, empty for form), loading screen state
- **context/LanguageContext.jsx** - AR/EN toggle with RTL support. Uses `t(en, ar)` helper for translations
- **hooks/useLeadForm.js** - Form state via `useReducer`, localStorage persistence, validation
- **data/services.js** - Scope items (18 checkboxes), time slots, priorities, values, statuses
- **data/kuwaitAreas.js** - Flat alphabetical list of Kuwait cities

### Form Sections

1. **Contact Details** - First name, second name, phone, city (no email)
2. **Design Requirements** - Architecture design (Required/Available + AutoCAD checkbox), Interior design
3. **Scope Required** - 18 simple checkboxes for customized items
4. **Site Visit Booking** - Date picker + time slot dropdown
5. **Project Assessment** - Priority, Value, Pre-Sales Status

### Form Components (`components/LeadForm/`)

- `PersonalDetails.jsx` - Contact info fields
- `DesignRequirements.jsx` - Architecture/Interior design radio groups
- `ScopeSelector.jsx` - Grid of scope item checkboxes
- `SiteVisitBooking.jsx` - Date and time slot fields
- `ProjectAssessment.jsx` - Priority, value, status fields
- `LeadForm.jsx` - Main form orchestrating all sections

### Form State Structure

```js
{
  firstName: '', secondName: '', phone: '', city: '',
  archDesign: '', archDesignAutocad: false, interiorDesign: '',
  scopeItems: { [itemId]: boolean },
  visitDate: '', visitTimeSlot: '',
  projectPriority: '', projectValue: '', preSalesStatus: ''
}
```

### Form Submission Flow

Dual AJAX submission (in `LeadForm.jsx`):
1. Validates firstName, secondName, phone (required)
2. Sends to Google Sheets (fire-and-forget, `no-cors` mode)
3. Sends to FormSubmit.co AJAX endpoint (uses FormData)
4. On success, clears localStorage and shows success state

**Endpoints:**
- FormSubmit: `https://formsubmit.co/ajax/moayad@qualiasolutions.net`
- Google Sheets: Apps Script Web App URL in `LeadForm.jsx:14`

### Legacy Site (root)

Deprecated HTML/CSS/JS files kept for reference: `index.html`, `styles.css`, `script.js`

## Brand Colors

```css
--gold: #a1622d;       /* Primary accent */
--bg: #0a0a0a;         /* Background */
--card: #141414;       /* Card background */
--cream: #f8f5f0;      /* Light text */
```

## Deployment

Vercel auto-deploys from `main` branch. Manual: `vercel --prod`
