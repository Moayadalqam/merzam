# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile-first lead form for Wood Location's Mirzaam 2025 exhibition booth. React 19 + Vite with bilingual AR/EN support.

**Live:** https://merzamnewbarcode.vercel.app

## Development

```bash
cd react-app
npm install
npm run dev      # http://localhost:5173
npm run build    # Output to dist/
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## Architecture

```
react-app/src/
├── App.jsx                    # Hash routing, loading screen
├── main.jsx                   # React entry point
├── context/LanguageContext.jsx # AR/EN with RTL, t(en, ar) helper
├── hooks/useLeadForm.js       # useReducer state, localStorage persistence
├── utils/phoneFormatter.js    # Phone number formatting utility
├── data/
│   ├── services.js            # Scope items, time slots, priorities, design options
│   └── kuwaitAreas.js         # Kuwait city list
└── components/
    ├── LeadForm/
    │   ├── LeadForm.jsx       # Main form (orchestrates sub-components)
    │   ├── PersonalDetails.jsx   # Name, phone, city
    │   ├── DesignRequirements.jsx # Arch/interior design needs
    │   ├── ScopeSelector.jsx     # Checkbox grid for work items
    │   ├── SiteVisitBooking.jsx  # Date/time slot selection
    │   └── ProjectAssessment.jsx # Priority/value dropdowns
    ├── AppointmentBooking/    # Standalone booking system (via #book)
    ├── LanguageToggle/        # AR/EN switcher
    ├── LoadingScreen/         # Initial loading animation
    └── QRGenerator/           # QR code generation (via #qr)
```

### Hash Routes

App.jsx uses `window.location.hash` for client-side routing:

| Route | Component | Description |
|-------|-----------|-------------|
| `#` or empty | LeadForm | Main lead capture form |
| `#qr` | QRGenerator | QR code generator for booth |
| `#book` or `#appointments` | AppointmentBooking | Site visit/office meeting booking |

### Translation Pattern

All text uses the `t(en, ar)` helper from `useLanguage()`:
```jsx
const { t } = useLanguage();
<label>{t('First Name', 'الاسم الأول')}</label>
```

### Dual Form Submission

`LeadForm.jsx` submits to both endpoints in parallel:
1. **Google Sheets** - `no-cors` fire-and-forget POST to Apps Script
2. **FormSubmit.co** - AJAX POST for email notification

Required fields: firstName, secondName, phone. Validation in `useLeadForm.js`.

### Form State

Managed by `useReducer` in `useLeadForm.js`. Auto-saves to localStorage key `woodLocationForm`.

```js
{
  firstName, secondName, countryCode, phone, city,
  archDesign, archDesignAutocad, interiorDesign,
  scopeItems: { [itemId]: boolean },
  visitDate, visitTimeSlot,
  projectPriority, projectValue,
  isSubmitting, isSubmitted, errors
}
```

### Adding New Form Fields

1. Add to `initialState` object in `useLeadForm.js`
2. Add to `dataToSave` in the auto-save useEffect in `useLeadForm.js`
3. Create/update component in `components/LeadForm/`
4. Add to submission payload in `LeadForm.jsx` (both Google Sheets + FormSubmit)
5. Update Google Apps Script (`google-apps-script.js`) to accept new column

### Adding New Scope Items

Add to `scopeItems` array in `data/services.js` with `{ id, labelEn, labelAr }`.

### Appointments System

Standalone booking at `#book`. Features: Site visit / office meeting types, 30-day date range, 9 AM - 5 PM hourly slots, double-booking prevention.

### Google Apps Script

`google-apps-script.js` in root contains the backend code for Google Sheets integration. Deploy this as a Google Apps Script web app to receive form submissions.

## Brand Colors

```css
--gold: #a1622d;       /* Primary accent */
--bg: #0a0a0a;         /* Background */
--card: #141414;       /* Cards */
--cream: #f8f5f0;      /* Light text */
```

## Deployment

Vercel auto-deploys from `main`. Manual: `vercel --prod`

## Legacy Files

Root HTML/CSS/JS files (`index.html`, `styles.css`, `script.js`) are deprecated - use React app only.
