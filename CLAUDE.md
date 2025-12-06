# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mobile-first landing page for Wood Location's exhibition booth at Mirzaam 2025. The main app is a React (Vite) application with a smart service selector, bilingual support (AR/EN), and FormSubmit integration.

**Live URL:** https://merzamnewbarcode.vercel.app

## Architecture

### React App (`react-app/`)

The primary application built with React + Vite:

```
react-app/
├── src/
│   ├── components/
│   │   ├── LeadForm/          # Form components
│   │   │   ├── LeadForm.jsx   # Main form with native FormSubmit
│   │   │   ├── PersonalDetails.jsx
│   │   │   ├── ProjectScope.jsx
│   │   │   ├── ServiceSelector.jsx
│   │   │   ├── ServiceItem.jsx
│   │   │   └── SalesmanMode.jsx  # UrgencySelector component
│   │   ├── LanguageToggle/
│   │   └── QRGenerator/
│   ├── context/
│   │   └── LanguageContext.jsx  # AR/EN with RTL support
│   ├── hooks/
│   │   └── useLeadForm.js      # Form state, validation, localStorage
│   ├── data/
│   │   ├── services.js         # 8 service categories with options
│   │   └── kuwaitAreas.js      # 5 governorates, 18 areas
│   ├── App.jsx                 # Hash-based routing (form / QR)
│   └── index.css               # All styles, CSS variables
└── public/
    └── logo.png
```

### Legacy Static Site (root)

Original HTML/CSS/JS site (deprecated, kept for reference):
- `index.html`, `qrcode.html`, `styles.css`, `script.js`

## Key Features

- **Smart Service Selector:** 8 categories (wardrobes, bedrooms, TV units, etc.) with nested sub-options in accordion UI
- **Bilingual:** AR/EN toggle with automatic RTL support
- **Project Urgency:** User-facing dropdown (Urgent, Soon, Planning, Just Exploring)
- **Project Scope:** Full Project, Renovation, Specific Unit, Doors Only
- **Kuwait Areas:** Grouped by governorate in dropdown
- **Form Persistence:** Auto-saves to localStorage, clears on submit

## Form Submission

Uses native form submission to FormSubmit.co (not fetch/AJAX):

1. Form validates fields via `useLeadForm.validate()`
2. Hidden fields carry: `_subject`, `_template`, `_next`, `_captcha`, services, scope, urgency
3. `formRef.current.submit()` triggers native POST
4. FormSubmit.co emails data and redirects to `?submitted=true`
5. App detects `submitted` param and shows success state

**Endpoint:** `https://formsubmit.co/moayad@qualiasolutions.net`

## Development

```bash
cd react-app
npm install
npm run dev     # http://localhost:5173
npm run build   # Output to dist/
```

## Brand Colors

In `react-app/src/index.css`:
```css
:root {
  --gold: #a1622d;       /* Primary brand color */
  --bg: #0a0a0a;         /* Background */
  --card: #141414;       /* Card background */
  --cream: #f8f5f0;      /* Light text */
  --text-muted: #888;
  --border: #2a2a2a;
}
```

## Deployment

Vercel auto-deploys on push to `main` branch.

**Config (`vercel.json`):**
```json
{
  "buildCommand": "cd react-app && npm install && npm run build",
  "outputDirectory": "react-app/dist",
  "framework": "vite"
}
```

**Manual deploy:**
```bash
vercel --prod
```

## Repository

- **GitHub:** https://github.com/Moayadalqam/merzam
- **Vercel Project:** merzamnewbarcode
