# Lumina Reserve - Setup Guide

## Quick Start

### 1. Configuration Setup

Create your configuration file:

```bash
# Copy the example configuration
cp js/config.example.js js/config.js
```

### 2. Configure Google Apps Script URL

1. Open your Google Sheet
2. Navigate to **Extensions** > **Apps Script**
3. Click **Deploy** > **Manage deployments**
4. Copy your **Web App URL**
5. Edit `js/config.js` and update the `API_URL`

### 3. Set Admin Password

Generate a password hash in your browser console (F12):

```javascript
crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
  .then(h => Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join(''))
  .then(hash => console.log(hash));
```

Copy the hash and update `ADMIN_PASSWORD_HASH` in `js/config.js`.

### 4. Open the Application

Open `index.html` in your browser. The application should now connect to your Google Sheet backend.

## Admin Access

- Press **Ctrl + Shift + A** to open the admin panel
- Enter your password (the one you hashed in step 3)
- View and manage reservations

## Features

- ✅ Menu management via Google Sheets
- ✅ Reservation system
- ✅ Customer reviews
- ✅ Event listings
- ✅ VIP subscription
- ✅ Admin dashboard
- ✅ Secure configuration

## Security

All sensitive data is stored in `js/config.js`, which is:
- Excluded from git via `.gitignore`
- Never committed to version control
- Required for application to function

See [SECURITY.md](SECURITY.md) for detailed security information.

## Troubleshooting

### Menu Not Loading

- Check that `config.js` exists and contains valid `API_URL`
- Verify Google Apps Script deployment is active
- Check browser console for errors

### Admin Login Fails

- Verify password hash is correct
- Ensure no extra spaces in hash
- Regenerate hash if needed

### API Errors

- Enable debug mode: Set `DEBUG_MODE: true` in `config.js`
- Check browser console for detailed error messages
- Verify Google Sheet has required tabs (Menu, Reviews, Reservations, Events)

## File Structure

```
├── index.html              # Main application
├── design_preview.html     # Design preview
├── css/
│   └── style.css          # Styles
├── js/
│   ├── config.js          # Configuration (DO NOT COMMIT)
│   ├── config.example.js  # Configuration template
│   ├── api.js            # API service
│   └── app.js            # Application logic
├── backend/
│   └── code.gs           # Google Apps Script
├── .gitignore            # Git ignore rules
├── SECURITY.md           # Security documentation
└── README.md             # This file
```

## Development

To enable debug logging, set in `js/config.js`:

```javascript
DEBUG_MODE: true
```

This will show detailed API call information in the browser console.

---

**Need Help?** Check [SECURITY.md](SECURITY.md) for detailed setup and troubleshooting.
