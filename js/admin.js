// Admin Panel JavaScript
// Handles authentication, reservations display, and event management

let isAuthenticated = false;

// Authentication Functions
function handleLogin() {
    const password = document.getElementById('admin-password').value;
    const loginError = document.getElementById('login-error');

    // Hash the password and compare
    hashPassword(password).then(hashedPassword => {
        if (hashedPassword === window.APP_CONFIG.ADMIN_PASSWORD_HASH) {
            isAuthenticated = true;
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'block';
            loadDashboard();
        } else {
            loginError.textContent = 'Invalid password';
            loginError.style.display = 'block';
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        }
    });
}

function handleLogout() {
    isAuthenticated = false;
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('admin-password').value = '';
}

// Hash password function (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Dashboard Loading
function loadDashboard() {
    refreshReservations();
    loadEvents();
    updateStatistics();
}

// Reservations Management
async function refreshReservations() {
    if (!isAuthenticated) return;

    const tbody = document.getElementById('reservations-tbody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">Loading...</td></tr>';

    try {
        const reservations = await API.getReservations();

        if (reservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No reservations yet</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        reservations.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.date || 'N/A'}</td>
                <td>${reservation.time || 'N/A'}</td>
                <td>${reservation.name || 'N/A'}</td>
                <td>${reservation.email || 'N/A'}</td>
                <td>${reservation.phone || 'N/A'}</td>
                <td>${reservation.guests || 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });

        updateStatistics();
    } catch (error) {
        console.error('Error loading reservations:', error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #dc3545;">Error loading reservations</td></tr>';
    }
}

// Event Management
async function loadEvents() {
    if (!isAuthenticated) return;

    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-muted);">Loading...</p>';

    try {
        const events = await API.getEventsWithMock();

        if (events.length === 0) {
            eventsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No events created yet</p>';
            return;
        }

        eventsList.innerHTML = '';
        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-item';
            eventDiv.innerHTML = `
                <div class="event-info">
                    <h3>${event.title || event.name}</h3>
                    <p><i class="fas fa-calendar"></i> ${event.date} | <i class="fas fa-rupee-sign"></i>${event.price}</p>
                    <p style="margin-top: 0.5rem;">${event.description}</p>
                </div>
                <button onclick="deleteEvent('${event.id}')" class="btn-delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
            `;
            eventsList.appendChild(eventDiv);
        });

        updateStatistics();
    } catch (error) {
        console.error('Error loading events:', error);
        eventsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: #dc3545;">Error loading events</p>';
    }
}

async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        await API.deleteEvent(eventId);
        showNotification('Event deleted successfully', 'success');
        loadEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
        showNotification('Error deleting event', 'error');
    }
}

// Statistics
async function updateStatistics() {
    try {
        const reservations = await API.getReservations();
        const events = await API.getEventsWithMock();

        document.getElementById('total-reservations').textContent = reservations.length;
        document.getElementById('total-events').textContent = events.length;

        // Count today's reservations
        const today = new Date().toISOString().split('T')[0];
        const todayReservations = reservations.filter(r => r.date === today);
        document.getElementById('today-reservations').textContent = todayReservations.length;
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

// Notification System
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Event Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const createEventForm = document.getElementById('create-event-form');

    if (createEventForm) {
        createEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(createEventForm);
            const eventData = {
                id: Date.now().toString(), // Simple ID generation
                title: formData.get('title'),
                date: formData.get('date'),
                description: formData.get('description'),
                price: formData.get('price'),
                image: formData.get('image') || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069'
            };

            try {
                await API.createEvent(eventData);
                showNotification('Event created successfully!', 'success');
                createEventForm.reset();
                loadEvents();
            } catch (error) {
                console.error('Error creating event:', error);
                showNotification('Error creating event', 'error');
            }
        });
    }

    // Handle Enter key on login
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
});
