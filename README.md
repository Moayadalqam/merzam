# Wood Location | معرض مرزام 2025

A premium, mobile-first landing page for Wood Location's exhibition booth at Mirzaam 2025.

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Add Your Email

1. Go to [formsubmit.co](https://formsubmit.co) → Create free account
2. Click **"+ New Form"** → Enter your email
3. Copy your Form ID (e.g., `xyzabcde`)
4. Open `index.html`, find line 47, replace `moayad@qualiasolutions.net`:

```html
<form id="contactForm" action="https://formsubmit.co/your-email@example.com" method="POST">
```

### Step 2: Deploy

**Option A - Netlify (Easiest):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag & drop this folder
3. Get your URL instantly!

**Option B - Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Import folder → Deploy

### Step 3: Generate QR Code

1. Open your deployed site
2. Click the "QR Code" tab
3. Your URL is automatically detected
4. Click "Generate QR Code"
5. Download & print for exhibition

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📱 **Mobile-First** | Optimized for QR code scanning |
| 🇰🇼 **Kuwait Cities** | All 6 governorates with areas |
| ✅ **Smart Validation** | Real-time error feedback |
| 🎨 **Premium Design** | Wood & gold aesthetic with Instagram logo |
| 🌐 **Arabic RTL** | Full right-to-left support |
| 📧 **Email Delivery** | Instant form to email |
| ♿ **Accessible** | Keyboard & screen reader friendly |
| 🔄 **Tab Navigation** | Switch between form and QR code generator |
| 💾 **Form Persistence** | Auto-saves form data to browser |
| 📊 **Progress Indicators** | Visual feedback for all actions |
| 📲 **Touch Optimized** | Enhanced mobile interactions |
| 🎯 **QR Code Integration** | Built-in QR code generator |

---

## 📁 Files

```
index.html   → Main page with form and QR generator
styles.css   → Styling with animations and responsive design
script.js    → Form logic, QR generation, and interactions
test.html    → Test page for verifying functionality
README.md    → This file
```

---

## 🎨 Customize

**Change colors** in `styles.css`:
```css
:root {
    --gold: #c9a227;      /* Main accent */
    --bg-dark: #1a1412;   /* Background */
}
```

**Change logo** - Update the `src` attribute of the `.logo-image` in `index.html`.

---

## 📧 What You'll Receive

Each submission emails you:
- Name (الاسم)
- Phone (+965 XXXX XXXX)
- Email
- Area (المنطقة)
- Request (الطلب)

---

## 🔧 Advanced Features

### Form Data Persistence
- Form data is automatically saved to browser storage
- Data is restored when you revisit the page
- Data is cleared after successful submission

### QR Code Generator
- Built-in QR code generator using QRCode.js
- Automatically detects your deployed URL
- Customizable QR code with brand colors
- One-click download functionality

### Progress Indicators
- Visual progress bar for all async operations
- Loading states for buttons and forms
- Success/error notifications
- Smooth animations and transitions

### Mobile Optimization
- Touch-friendly button sizes (minimum 48px)
- Optimized for iOS Safari (prevents zoom)
- Responsive design for all screen sizes
- Haptic feedback on supported devices

---

## 🧪 Testing

Open `test.html` in your browser to:
- Verify all functionality is working
- Run automated tests
- Get a manual testing checklist

---

**Built for Mirzaam 2025 🪵**
