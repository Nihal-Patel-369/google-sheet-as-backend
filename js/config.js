/**
 * Configuration for Lumina Reserve
 * 
 * ⚠️ WARNING: This file contains sensitive information!
 * DO NOT commit this file to version control
 * DO NOT share this file publicly
 */

window.APP_CONFIG = {
    /**
     * Google Apps Script Web App URL
     */
    API_URL: 'https://script.google.com/macros/s/AKfycbx20edlU1Tm6UrQ6JLUIDb3-D16KyIhsMYfkQYeM4SZ7Wms3evHseMYWe2W9ANO0T7y/exec',

    /**
     * Admin Password Hash (SHA-256)
     * Current password: admin123
     * 
     * ⚠️ IMPORTANT: Change this password for production!
     * To generate a new hash, see instructions in config.example.js
     */
    ADMIN_PASSWORD_HASH: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',

    /**
     * Application Settings
     */
    APP_NAME: 'Lumina Reserve',
    DEBUG_MODE: false,
};
