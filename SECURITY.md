# Security Guide for Lumina Reserve

## Overview

This document outlines the security measures implemented in the Lumina Reserve application and provides guidance on secure configuration and deployment.

## Security Features

### 1. Environment Configuration

All sensitive data is stored in `js/config.js`, which is:
- ✅ Excluded from version control via `.gitignore`
- ✅ Loaded before other application scripts
- ✅ Validated on application startup

### 2. Password Security

Admin passwords are protected using:
- ✅ SHA-256 cryptographic hashing
- ✅ No plain text storage
- ✅ Secure comparison during authentication

### 3. API Security

Google Apps Script URL is:
- ✅ Stored in configuration file (not hardcoded)
- ✅ Never exposed in public repositories
- ✅ Validated before making API calls

## Initial Setup

### Step 1: Create Configuration File

1. Navigate to the `js/` directory
2. Copy `config.example.js` to `config.js`:
   ```bash
   cp js/config.example.js js/config.js
   ```

### Step 2: Configure API URL

1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. Click **Deploy** > **Manage deployments**
4. Copy the **Web App URL**
5. Open `js/config.js` and paste the URL:
   ```javascript
   API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
   ```

### Step 3: Set Admin Password

#### Option A: Use the Helper Function (Recommended)

1. Open your browser's Developer Console (F12)
2. Run this command (replace `your-secure-password` with your actual password):
   ```javascript
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-secure-password'))
     .then(h => Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join(''))
     .then(hash => console.log('Your password hash:', hash));
   ```
3. Copy the generated hash
4. Open `js/config.js` and paste it:
   ```javascript
   ADMIN_PASSWORD_HASH: 'your-generated-hash-here',
   ```

#### Option B: Use an Online SHA-256 Generator

1. Visit a trusted SHA-256 generator (e.g., https://emn178.github.io/online-tools/sha256.html)
2. Enter your password
3. Copy the hash
4. Paste it into `js/config.js`

**⚠️ IMPORTANT**: Never use the default password (`admin123`) in production!

## Deployment Checklist

Before deploying to production:

- [ ] `config.js` exists and contains valid values
- [ ] Admin password has been changed from default
- [ ] `.gitignore` is committed to repository
- [ ] `config.js` is NOT committed to repository
- [ ] Google Apps Script is deployed with proper permissions
- [ ] Application has been tested with actual configuration

## Security Best Practices

### DO ✅

- Keep `config.js` secure and private
- Use strong, unique passwords
- Regularly rotate admin credentials
- Review Google Apps Script permissions
- Monitor access logs in Google Sheets
- Use HTTPS for all deployments

### DON'T ❌

- Commit `config.js` to version control
- Share configuration files publicly
- Use weak or default passwords
- Expose API URLs in client-side code (outside config)
- Store passwords in plain text
- Reuse passwords across services

## What to Do If Credentials Are Compromised

If you suspect your credentials have been exposed:

### 1. Immediately Revoke Access

1. Open Google Apps Script
2. Go to **Deploy** > **Manage deployments**
3. Click **Archive** on the compromised deployment
4. Create a new deployment with a new URL

### 2. Change Admin Password

1. Generate a new password hash (see Step 3 above)
2. Update `config.js` with the new hash
3. Notify all administrators of the change

### 3. Review Access Logs

1. Open your Google Sheet
2. Check **File** > **Version history**
3. Review recent changes for suspicious activity

### 4. Update Configuration

1. Update `config.js` with new API URL
2. Clear browser cache
3. Test the application thoroughly

## Additional Security Considerations

### For Production Deployments

Consider implementing:

- **Backend Authentication**: Move authentication to server-side
- **Rate Limiting**: Prevent abuse of API endpoints
- **CORS Configuration**: Restrict API access to specific domains
- **Input Validation**: Sanitize all user inputs
- **SSL/TLS**: Use HTTPS for all communications
- **Session Management**: Implement proper session handling
- **Audit Logging**: Track all administrative actions

### Google Apps Script Security

Recommended settings:

1. **Execute as**: User accessing the web app
2. **Who has access**: Only yourself (or specific users)
3. **Enable**: Require authentication
4. **Review**: Regularly audit script permissions

## Troubleshooting

### Configuration Not Loading

**Symptom**: Console shows "config.js not loaded" error

**Solution**:
1. Verify `config.js` exists in `js/` directory
2. Check browser console for loading errors
3. Ensure `index.html` includes `<script src="js/config.js"></script>`

### Admin Login Fails

**Symptom**: Correct password shows "Incorrect Password"

**Solution**:
1. Verify password hash is correct
2. Check for extra spaces in password or hash
3. Regenerate hash using the helper function
4. Ensure `config.js` is loaded before `app.js`

### API Calls Fail

**Symptom**: Menu/reservations don't load

**Solution**:
1. Verify API_URL is correct in `config.js`
2. Check Google Apps Script deployment is active
3. Review CORS settings in Apps Script
4. Check browser console for specific errors

## Support

For security-related issues or questions:

1. Check this documentation first
2. Review browser console for error messages
3. Verify configuration against `config.example.js`
4. Test with debug mode enabled: `DEBUG_MODE: true` in `config.js`

---

**Last Updated**: 2025-11-25  
**Version**: 1.0
