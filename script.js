document.addEventListener('DOMContentLoaded', () => {
    
    /* --- Dark Mode Toggle --- */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');

    // Move toggle to be visible on mobile (insert before hamburger)
    if (themeToggle && navbar && hamburger) {
        const parentLi = themeToggle.parentElement;
        navbar.insertBefore(themeToggle, hamburger);
        if (parentLi && parentLi.tagName === 'LI') {
            parentLi.remove();
        }
    }
    
    // Check for saved user preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    /* --- Mobile Navigation --- */
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    /* --- Form Validation & Submission --- */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop actual submission
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                alert('Please fill in all fields.');
                return;
            }

            if (!email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }

            // Open default email client with pre-filled message
            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            window.location.href = `mailto:andreisantossaldivar@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            contactForm.reset();
        });
    }

    /* --- Map Initialization (Leaflet.js) --- */
    // Coordinates from your original map.js: 16.38411475, 120.59481175 (Baguio)
    var mapElement = document.getElementById('map');
    if (mapElement) {
        var mymap = L.map('map').setView([16.38411475, 120.59481175], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mymap);

        var marker = L.marker([16.38411475, 120.59481175]).addTo(mymap);
        marker.bindPopup("<b>Hello!</b><br>I am based in Baguio City.").openPopup();
    }

    /* --- Dynamic Content: Experience Timeline --- */
    // This requires a container with id="experience-timeline" in your HTML
    const experiences = [
        {
            role: 'OJT Aircraft Mechanic',
            company: 'Aviation Integrity',
            period: 'Jan 2023 - July 2023',
            description: 'Performed maintenance tasks, safety wiring, and secured aircraft fasteners. Gained hands-on experience with sheet metal and tool handling.'
        },
        {
            role: 'Research Lead & Developer',
            company: 'Senior High School Project',
            period: '2019 - 2020',
            description: 'Lead researcher for "MEEKRAI", an Android-based attendance monitoring system using Java and SQL.'
        }
    ];

    const timelineContainer = document.getElementById('experience-timeline');
    if (timelineContainer) {
        experiences.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <h3>${exp.role} <span class="role">@ ${exp.company}</span></h3>
                <p class="period" style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">${exp.period}</p>
                <p>${exp.description}</p>
            `;
            timelineContainer.appendChild(item);
        });
    }

    /* --- Scroll Animations --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Select elements to animate (including dynamically added ones)
    const animatedElements = document.querySelectorAll('.section-title, .card, .timeline-item, .gallery-item, .hero-buttons');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    /* --- Hero Background Animation (Canvas) --- */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;
        let particleColor = 'rgba(30, 64, 175, 0.5)'; // Default fallback

        // Set canvas size taking into account device pixel ratio for 4k sharpness
        function setCanvasSize() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(dpr, dpr);
        }

        class Particle {
            constructor() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.directionX = (Math.random() * 0.4) - 0.2; // Slow, subtle movement
                this.directionY = (Math.random() * 0.4) - 0.2;
                this.size = (Math.random() * 3) + 1;
            }
            update() {
                this.x += this.directionX;
                this.y += this.directionY;
                
                // Bounce off edges
                if (this.x > window.innerWidth || this.x < 0) this.directionX *= -1;
                if (this.y > window.innerHeight || this.y < 0) this.directionY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = particleColor;
                ctx.globalAlpha = 0.08; // Very subtle transparency for clean look
                ctx.fill();
            }
        }

        function init() {
            particlesArray = [];
            // Calculate number of particles based on screen area
            let numberOfParticles = (window.innerWidth * window.innerHeight) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            
            // Update color dynamically based on CSS variable (for dark mode support)
            const style = getComputedStyle(document.body);
            particleColor = style.getPropertyValue('--accent').trim();

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
        }

        window.addEventListener('resize', () => {
            setCanvasSize();
            init();
        });

        setCanvasSize();
        init();
        animate();
    }

    /* --- Carousel Logic --- */
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        let currentSlideIndex = 0;

        const updateSlidePosition = () => {
            track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        };

        const nextSlide = () => {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateSlidePosition();
        };

        const prevSlide = () => {
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            updateSlidePosition();
        };

        if (nextButton) nextButton.addEventListener('click', nextSlide);
        if (prevButton) prevButton.addEventListener('click', prevSlide);
        
        // Auto-play
        setInterval(nextSlide, 5000);
    }
});