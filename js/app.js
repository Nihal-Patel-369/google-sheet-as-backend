/**
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initReviews();
    initReservationForm();
    initScrollEffects();
    initScrollReveal();
    initParticles();
    initEvents();
    initVIP();

    // Admin Shortcut (Ctrl + Shift + A)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            openAdmin();
        }
    });
});

/**
 * Initialize and render the menu
 */
async function initMenu() {
    const menuContainer = document.getElementById('menu-container');

    // Fetch data
    const menuItems = await ApiService.getMenu();

    // DEBUG: Log the menu items to see structure
    console.log('🍽️ Menu Items Data:', menuItems);
    if (menuItems && menuItems.length > 0) {
        console.log('📋 First Item Structure:', menuItems[0]);
        console.log('📋 Available Fields:', Object.keys(menuItems[0]));
    }

    // Clear loading state
    // Clear loading state
    menuContainer.innerHTML = '';

    // Render items
    if (menuItems && menuItems.length > 0) {
        menuItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item reveal-on-scroll';
            itemElement.style.transitionDelay = `${index * 100}ms`;

            // FIXED: Google Sheets has 'category' for item name and 'name' for price
            const itemName = item.category || item.Category || 'Unnamed Item';
            const itemPrice = item.name || item.Name || '';
            const itemDesc = item.description || item.Description || '';

            itemElement.innerHTML = `
                <div class="menu-item-header">
                    <h3 class="menu-item-name">${itemName}</h3>
                    <span class="menu-item-price">${itemPrice}</span>
                </div>
                <p class="menu-item-desc">${itemDesc}</p>
            `;
            menuContainer.appendChild(itemElement);
        });

        // Re-run observer for new elements
        initScrollReveal();
    } else {
        menuContainer.innerHTML = '<p class="text-center" style="grid-column: 1/-1">Menu currently unavailable.</p>';
    }
}

/**
 * Initialize Reviews Carousel
 */
async function initReviews() {
    const track = document.getElementById('reviews-track');
    const reviews = await ApiService.getReviews();

    if (reviews && reviews.length > 0) {
        track.innerHTML = '';

        // Duplicate reviews to create infinite scroll effect
        const displayReviews = [...reviews, ...reviews, ...reviews];

        displayReviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';

            // Format date
            const dateStr = new Date(review.date).toLocaleDateString();

            // Stars
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

            card.innerHTML = `
                <p class="review-text">"${review.comment}"</p>
                <div class="review-meta">
                    <span class="review-author">${review.name}</span>
                    <div class="review-stars">${stars}</div>
                    <small style="color: #666;">${dateStr}</small>
                </div>
            `;
            track.appendChild(card);
        });
    } else {
        track.innerHTML = '<div class="review-card"><p class="review-text">No reviews yet. Be the first!</p></div>';
    }
}

/**
 * Initialize Reservation Form Handling
 */
function initReservationForm() {
    const form = document.getElementById('reservation-form');
    const statusDiv = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading State
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Booking...';
        btn.disabled = true;
        statusDiv.innerText = '';

        // Collect Data
        const formData = {
            name: form.name.value,
            email: form.email.value,
            date: form.date.value,
            time: form.time.value,
            guests: form.guests.value
        };

        // Submit
        const result = await ApiService.submitReservation(formData);

        // Handle Result
        if (result.success) {
            statusDiv.innerText = 'Reservation Confirmed! We await your arrival.';
            statusDiv.style.color = 'var(--color-gold)';
            form.reset();
        } else {
            statusDiv.innerText = 'Something went wrong. Please try again.';
            statusDiv.style.color = 'red';
        }

        // Reset Button
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

/**
 * Navbar Scroll Effect
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(30, 43, 36, 0.95)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.background = 'rgba(30, 43, 36, 0.5)';
            navbar.style.padding = '2rem 0';
        }
    });
}

/**
 * Scroll Reveal Animation (Intersection Observer)
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));
}

/**
 * Floating Coffee Bean Particles
 */
function initParticles() {
    const container = document.createElement('div');
    container.id = 'particle-container';
    document.body.prepend(container);

    const particleCount = 15;
    const particles = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const bean = document.createElement('div');
        bean.classList.add('coffee-bean');

        // Random properties
        const size = Math.random() * 30 + 20; // 20-50px
        const left = Math.random() * 100; // 0-100%
        const top = Math.random() * 100; // 0-100%
        const rotation = Math.random() * 360;
        const duration = Math.random() * 20 + 10; // 10-30s float duration

        bean.style.width = `${size}px`;
        bean.style.height = `${size}px`;
        bean.style.left = `${left}%`;
        bean.style.top = `${top}%`;
        bean.style.transform = `rotate(${rotation}deg)`;

        container.appendChild(bean);

        particles.push({
            element: bean,
            speed: Math.random() * 0.5 + 0.1,
            y: top, // Store percentage
            rotation: rotation,
            rotationSpeed: Math.random() * 0.2 - 0.1
        });
    }

    // Parallax Animation Loop
    let lastScrollY = window.scrollY;

    function animate() {
        const scrollY = window.scrollY;
        const scrollDiff = scrollY - lastScrollY;

        particles.forEach(p => {
            // Move based on scroll (Parallax)
            // If scrolling down, beans move up slightly (creating depth)
            p.y -= scrollDiff * p.speed * 0.05;

            // Constant float
            p.y -= 0.02; // Always float up slowly
            p.rotation += p.rotationSpeed;

            // Wrap around
            if (p.y < -10) p.y = 110;
            if (p.y > 110) p.y = -10;

            p.element.style.top = `${p.y}%`;
            p.element.style.transform = `rotate(${p.rotation}deg)`;
        });

        lastScrollY = scrollY;
        requestAnimationFrame(animate);
    }

    animate();
}

/* =========================================
   LIGHTBOX LOGIC
   ========================================= */
function openLightbox(element) {
    const modal = document.getElementById('lightbox');
    const modalImg = document.getElementById('lightbox-img');
    const img = element.querySelector('img');

    modal.style.display = "flex";
    modalImg.src = img.src;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
}

/* =========================================
   ADMIN DASHBOARD LOGIC
   ========================================= */
function openAdmin() {
    document.getElementById('admin-modal').style.display = "block";
}

function closeAdmin() {
    document.getElementById('admin-modal').style.display = "none";
}

/**
 * Admin login with secure password verification
 */
async function adminLogin() {
    const pass = document.getElementById('admin-pass').value;

    // Validate configuration
    if (!window.APP_CONFIG || !window.APP_CONFIG.ADMIN_PASSWORD_HASH) {
        alert('❌ Configuration Error: Admin password not configured.\\nPlease check config.js');
        return;
    }

    // Check for placeholder value
    if (window.APP_CONFIG.ADMIN_PASSWORD_HASH === 'YOUR_PASSWORD_HASH_HERE') {
        alert('❌ Configuration Error: Please update the admin password hash in config.js');
        return;
    }

    try {
        // Hash the entered password using SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(pass);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Compare with stored hash
        if (hashHex === window.APP_CONFIG.ADMIN_PASSWORD_HASH) {
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            refreshReservations();
        } else {
            alert('❌ Incorrect Password');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        alert('❌ Authentication failed. Please try again.');
    }
}

async function refreshReservations() {
    const tbody = document.querySelector('#reservations-table tbody');
    tbody.innerHTML = '<tr><td colspan="4">Loading data...</td></tr>';

    const reservations = await ApiService.getReservations();

    tbody.innerHTML = '';

    if (reservations && reservations.length > 0) {
        reservations.forEach(res => {
            const row = document.createElement('tr');
            const dateStr = new Date(res.date).toLocaleDateString();
            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${res.name}</td>
                <td>${res.time}</td>
                <td>${res.guests}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4">No reservations found.</td></tr>';
    }
}

async function initEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    const events = await ApiService.getEvents();

    if (events && events.length > 0) {
        grid.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="event-image" style="background-image: url('${event.image}')"></div>
                <div class="event-content">
                    <div class="event-date">${event.date} • ${event.time}</div>
                    <h3 class="event-title">${event.name}</h3>
                    <p class="event-desc">${event.description}</p>
                    <div class="event-footer">
                        <span class="event-price">${event.price}</span>
                        <button class="btn-gold-outline" onclick="reserveEventSpot('${event.name}')">Reserve Spot</button>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        grid.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; grid-column: 1/-1;">No upcoming events. Join our society to stay updated.</p>';
    }
}

/**
 * Handle Reserve Spot button click on events
 */
function reserveEventSpot(eventName) {
    // Scroll to reservation section
    const reservationSection = document.getElementById('reservation');
    if (reservationSection) {
        reservationSection.scrollIntoView({ behavior: 'smooth' });

        // Show a message about the event
        const statusDiv = document.getElementById('form-status');
        if (statusDiv) {
            statusDiv.innerText = `Reserving spot for: ${eventName}`;
            statusDiv.style.color = 'var(--color-gold)';
        }
    }
}

function initVIP() {
    const form = document.getElementById('vip-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        const name = form.querySelector('input[type="text"]').value;
        const btn = form.querySelector('button');

        const originalText = btn.innerText;
        btn.innerText = 'Joining...';
        btn.disabled = true;

        const result = await ApiService.addSubscriber(email, name);

        if (result.status === 'success') {
            btn.innerText = 'Welcome to the Society';
            btn.style.backgroundColor = 'var(--color-gold)';
            btn.style.color = 'var(--color-bg-dark)';
            form.reset();
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 3000);
        } else {
            alert('Something went wrong. Please try again.');
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}
