/**
 * API Service for communicating with Google Sheets Backend
 * 
 * SECURITY: Configuration is loaded from config.js
 * Make sure config.js exists and contains valid APP_CONFIG
 */

// Validate configuration
if (typeof window.APP_CONFIG === 'undefined') {
    console.error('❌ CONFIGURATION ERROR: config.js not loaded!');
    console.error('Please ensure config.js exists in the js/ directory');
    console.error('See config.example.js for template');
}

const CONFIG = {
    get API_URL() {
        if (!window.APP_CONFIG || !window.APP_CONFIG.API_URL) {
            console.warn('⚠️ API_URL not configured. Using mock data.');
            return null;
        }
        if (window.APP_CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            console.warn('⚠️ API_URL not configured properly. Please update config.js');
            return null;
        }
        return window.APP_CONFIG.API_URL;
    },

    get DEBUG_MODE() {
        return window.APP_CONFIG?.DEBUG_MODE || false;
    }
};

const ApiService = {
    /**
     * Fetch menu items
     */
    getMenu: async () => {
        return ApiService._fetch('getMenu', ApiService.getMockMenu);
    },

    /**
     * Fetch reviews
     */
    getReviews: async () => {
        return ApiService._fetch('getReviews', ApiService.getMockReviews);
    },

    /**
     * Fetch reservations (Admin)
     */
    getReservations: async () => {
        return ApiService._fetch('getReservations', () => []);
    },

    /**
     * Fetch events
     */
    getEvents: async () => {
        return ApiService._fetch('getEvents', ApiService.getMockEvents);
    },

    /**
     * Helper to handle fetch with fallback
     */
    _fetch: async (action, mockFallback) => {
        if (!CONFIG.API_URL) {
            console.warn('⚠️ API URL not configured. Returning mock data.');
            return mockFallback();
        }

        try {
            if (CONFIG.DEBUG_MODE) {
                console.log(`🔄 Fetching: ${action}`);
            }

            const response = await fetch(`${CONFIG.API_URL}?action=${action}`);
            const result = await response.json();

            // Unwrap the Google Apps Script response structure
            if (result.status === 'success' && result.data) {
                if (CONFIG.DEBUG_MODE) {
                    console.log(`✅ Success: ${action}`, result.data);
                }
                return result.data;
            } else {
                console.warn(`⚠️ API returned status: ${result.status}`, result);
                return mockFallback();
            }
        } catch (error) {
            console.error(`❌ Error fetching ${action}:`, error);
            return mockFallback();
        }
    },

    /**
     * Submit a reservation
     */
    submitReservation: async (formData) => {
        if (!CONFIG.API_URL) {
            if (CONFIG.DEBUG_MODE) {
                console.log('📝 Mock Reservation Submitted:', formData);
            }
            return { success: true, message: 'Reservation simulated (No API URL configured)' };
        }

        try {
            if (CONFIG.DEBUG_MODE) {
                console.log('📤 Submitting reservation:', formData);
            }

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'createReservation', data: formData })
            });
            const result = await response.json();

            if (CONFIG.DEBUG_MODE) {
                console.log('📥 Reservation response:', result);
            }

            return { success: result.status === 'success', ...result };
        } catch (error) {
            console.error('❌ Reservation API Error:', error);
            return { success: false, message: 'Failed to submit reservation' };
        }
    },

    /**
     * Add a subscriber to the mailing list
     */
    addSubscriber: async (email, name) => {
        if (!CONFIG.API_URL) {
            if (CONFIG.DEBUG_MODE) {
                console.log('📧 Mock Subscription:', { email, name });
            }
            return { status: 'success', message: 'Welcome to the Reserve Society (Mock)' };
        }

        try {
            if (CONFIG.DEBUG_MODE) {
                console.log('📤 Adding subscriber:', { email, name });
            }

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'addSubscriber', data: { email, name } })
            });
            const result = await response.json();

            if (CONFIG.DEBUG_MODE) {
                console.log('📥 Subscriber response:', result);
            }

            return result;
        } catch (error) {
            console.error('❌ Subscriber API Error:', error);
            return { status: 'error', message: 'Failed to subscribe' };
        }
    },

    /**
     * Mock Data
     */
    getMockMenu: () => [
        { category: 'Signature Brews', name: 'Velvet Truffle Latte', price: '$8.50', description: 'Espresso infused with black truffle oil and dark chocolate.', image: 'media/latte.jpg' },
        { category: 'Signature Brews', name: 'Gold Leaf Cappuccino', price: '$9.00', description: 'Classic cappuccino topped with edible 24k gold leaf.', image: 'media/cappuccicno.jpg' },
        { category: 'Main Course', name: 'Truffle Pasta', price: '$16.50', description: 'Handmade pasta with creamy truffle sauce.', image: 'media/pasta.jpg' },
        { category: 'Main Course', name: 'Gourmet Ravioli', price: '$18.00', description: 'Stuffed ravioli with ricotta and spinach in sage butter.', image: 'media/ravioli.jpg' },
        { category: 'Quick Bites', name: 'Mexican Burrito', price: '$12.00', description: 'Loaded burrito with beans, rice, and fresh salsa.', image: 'media/burrito wrap.jpg' },
        { category: 'Starters', name: 'Cheesy French Fries', price: '$8.00', description: 'Crispy fries topped with melted cheddar and herbs.', image: 'media/French dries with cheese.jpg' },
        { category: 'Soups', name: 'Chef\'s Special Soup', price: '$9.00', description: 'Daily special soup made with fresh seasonal ingredients.', image: 'media/Soup.jpg' }
    ],

    getMockReviews: () => [
        { name: 'Eleanor V.', rating: 5, comment: 'An absolute sanctuary. The truffle latte is life-changing.', date: '2023-10-15' },
        { name: 'James B.', rating: 5, comment: 'The atmosphere is unmatched. Perfect for a quiet afternoon.', date: '2023-10-12' },
        { name: 'Sophia L.', rating: 4, comment: 'Exquisite pastries, though a bit pricey. Worth it for the vibe.', date: '2023-10-10' }
    ],

    getMockEvents: () => [
        { id: '1', name: 'Masterclass: The Art of Pour-Over', date: '2023-11-15', time: '18:00', description: 'Learn the secrets of the perfect pour-over from our head barista.', price: '$45', image: 'https://via.placeholder.com/300x200', title: 'Masterclass: The Art of Pour-Over' },
        { id: '2', name: 'Exclusive Cupping: Ethiopian Origins', date: '2023-11-22', time: '19:00', description: 'Taste rare single-origin beans from the highlands of Ethiopia.', price: '$60', image: 'https://via.placeholder.com/300x200', title: 'Exclusive Cupping: Ethiopian Origins' }
    ],

    /**
     * Create a new event (Admin)
     */
    createEvent: async (eventData) => {
        if (!CONFIG.API_URL) {
            if (CONFIG.DEBUG_MODE) {
                console.log('📝 Mock Event Created:', eventData);
            }
            // Store in localStorage for demo purposes
            const events = JSON.parse(localStorage.getItem('mockEvents') || '[]');
            events.push(eventData);
            localStorage.setItem('mockEvents', JSON.stringify(events));
            return { success: true, message: 'Event created (Mock)' };
        }

        try {
            if (CONFIG.DEBUG_MODE) {
                console.log('📤 Creating event:', eventData);
            }

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'createEvent', data: eventData })
            });
            const result = await response.json();

            if (CONFIG.DEBUG_MODE) {
                console.log('📥 Event creation response:', result);
            }

            return { success: result.status === 'success', ...result };
        } catch (error) {
            console.error('❌ Event Creation API Error:', error);
            return { success: false, message: 'Failed to create event' };
        }
    },

    /**
     * Delete an event (Admin)
     */
    deleteEvent: async (eventId) => {
        if (!CONFIG.API_URL) {
            if (CONFIG.DEBUG_MODE) {
                console.log('🗑️ Mock Event Deleted:', eventId);
            }
            // Remove from localStorage for demo purposes
            const events = JSON.parse(localStorage.getItem('mockEvents') || '[]');
            const filtered = events.filter(e => e.id !== eventId);
            localStorage.setItem('mockEvents', JSON.stringify(filtered));
            return { success: true, message: 'Event deleted (Mock)' };
        }

        try {
            if (CONFIG.DEBUG_MODE) {
                console.log('📤 Deleting event:', eventId);
            }

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'deleteEvent', data: { id: eventId } })
            });
            const result = await response.json();

            if (CONFIG.DEBUG_MODE) {
                console.log('📥 Event deletion response:', result);
            }

            return { success: result.status === 'success', ...result };
        } catch (error) {
            console.error('❌ Event Deletion API Error:', error);
            return { success: false, message: 'Failed to delete event' };
        }
    },

    /**
     * Get events with localStorage fallback for mock data
     */
    getEventsWithMock: async () => {
        if (!CONFIG.API_URL) {
            const storedEvents = JSON.parse(localStorage.getItem('mockEvents') || '[]');
            const defaultEvents = ApiService.getMockEvents();
            return [...storedEvents, ...defaultEvents];
        }
        return ApiService._fetch('getEvents', ApiService.getMockEvents);
    }
};

// Expose API globally
window.API = ApiService;
