/**
 * Configuration Template for Lumina Reserve
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to 'config.js' in the same directory
 * 2. Replace the placeholder values with your actual credentials
 * 3. NEVER commit config.js to version control
 * 
 * SECURITY NOTE:
 * The config.js file is excluded from git via .gitignore
 * This template (config.example.js) is safe to commit
 */

window.APP_CONFIG = {
    /**
     * Google Apps Script Web App URL
     * 
     * How to get this:
     * 1. Open your Google Sheet
     * 2. Go to Extensions > Apps Script
     * 3. Click Deploy > Manage deployments
     * 4. Copy the Web App URL
     * 
     * Example: 'https://script.google.com/macros/s/AKfycbx.../exec'
     */
    API_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',

    /**
     * Admin Password Hash (SHA-256)
     * 
     * To generate a password hash:
     * 1. Open browser console (F12)
     * 2. Run: await crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
     *         .then(h => Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join(''))
     * 3. Copy the resulting hash and paste it below
     * 
     * Example hash for 'admin123':
     * '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
     * 
     * IMPORTANT: Change the default password for production!
     */
    ADMIN_PASSWORD_HASH: 'YOUR_PASSWORD_HASH_HERE',

    /**
     * Application Settings
     */
    APP_NAME: 'Mr Cafe',
    DEBUG_MODE: false, // Set to true to enable console logging
};
