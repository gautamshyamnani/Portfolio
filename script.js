// Advanced Portfolio JavaScript

// ===============================
// Global Variables & Configuration
// ===============================
const CONFIG = {
    animations: {
        duration: 600,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        stagger: 100
    },
    typing: {
        speed: 100,
        deleteSpeed: 50,
        delayBetweenTexts: 2000
    },
    cursor: {
        size: 20,
        followSpeed: 0.15
    },
    particles: {
        count: 50,
        speed: 0.5
    }
};

// State management
const STATE = {
    isLoading: true,
    currentTheme: localStorage.getItem('theme') || 'light',
    isMobileMenuOpen: false,
    scrollY: 0,
    mousePosition: { x: 0, y: 0 },
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// ===============================
// Utility Functions
// ===============================
const utils = {
    // Throttle function for performance optimization
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Debounce function for performance optimization
    debounce: (func, wait, immediate) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Linear interpolation
    lerp: (start, end, factor) => {
        return start + (end - start) * factor;
    },

    // Map value from one range to another
    map: (value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    },

    // Clamp value between min and max
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    // Generate random number between min and max
    random: (min, max) => {
        return Math.random() * (max - min) + min;
    },

    // Check if element is in viewport
    isInViewport: (element, threshold = 0.1) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        
        return vertInView && horInView;
    },

    // Get element's offset from top of document
    getOffset: (element) => {
        let top = 0;
        let left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);
        
        return { top, left };
    },

    // Animate number counting
    animateNumber: (element, start, end, duration = 1000) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }
};

// ===============================
// DOM Ready & Initialization
// ===============================
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.initializeLoading();
        this.initializeCursor();
        this.initializeNavigation();
        this.initializeAnimations();
        this.initializeTypingEffect();
        this.initializeSkillBars();
        this.initializeContactForm();
        this.initializeParticles();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('load', this.handleWindowLoad.bind(this));
        window.addEventListener('resize', utils.debounce(this.handleWindowResize.bind(this), 250));
        window.addEventListener('scroll', utils.throttle(this.handleWindowScroll.bind(this), 16));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));

        // Theme toggle
        const themeToggle = document.getElementById('theme-switch');
        if (themeToggle) {
            themeToggle.addEventListener('change', this.toggleTheme.bind(this));
        }

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Smooth scroll for CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary, .view-all-btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Add magnetic effect to interactive elements
        const magneticElements = document.querySelectorAll('.cta-primary, .project-link, .social-link');
        magneticElements.forEach(element => {
            this.addMagneticEffect(element);
        });
    }

    // ===============================
    // Loading Screen
    // ===============================
    initializeLoading() {
        const loadingScreen = document.querySelector('.loading-screen');
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }

    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
                STATE.isLoading = false;
                this.startAnimations();
            }, 500);
        }
    }

    startAnimations() {
        // Start hero animations
        this.animateHeroElements();
        
        // Initialize scroll-triggered animations
        this.initScrollAnimations();
    }

    animateHeroElements() {
        const heroElements = [
            '.hero-greeting',
            '.hero-title .title-line:nth-child(1)',
            '.hero-title .title-line:nth-child(2)',
            '.hero-subtitle',
            '.hero-description',
            '.hero-cta',
            '.hero-visual'
        ];

        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200 + 500);
            }
        });
    }

    // ===============================
    // Theme Management
    // ===============================
    initializeTheme() {
        document.documentElement.setAttribute('data-theme', STATE.currentTheme);
        const themeToggle = document.getElementById('theme-switch');
        if (themeToggle) {
            themeToggle.checked = STATE.currentTheme === 'dark';
        }
    }

    toggleTheme() {
        STATE.currentTheme = STATE.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', STATE.currentTheme);
        localStorage.setItem('theme', STATE.currentTheme);

        // Add theme transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // ===============================
    // Custom Cursor
    // ===============================
    initializeCursor() {
        if (STATE.isReducedMotion || window.innerWidth <= 768) return;

        const cursor = document.querySelector('.cursor');
        if (!cursor) return;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const updateCursor = () => {
            currentX = utils.lerp(currentX, targetX, CONFIG.cursor.followSpeed);
            currentY = utils.lerp(currentY, targetY, CONFIG.cursor.followSpeed);
            
            cursor.style.transform = `translate3d(${currentX - CONFIG.cursor.size / 2}px, ${currentY - CONFIG.cursor.size / 2}px, 0)`;
            requestAnimationFrame(updateCursor);
        };

        updateCursor();

        // Add cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(1.5)';
                cursor.style.mixBlendMode = 'difference';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
                cursor.style.mixBlendMode = 'difference';
            });
        });
    }

    handleMouseMove(e) {
        STATE.mousePosition.x = e.clientX;
        STATE.mousePosition.y = e.clientY;

        // Update cursor target position
        if (document.querySelector('.cursor')) {
            document.querySelector('.cursor').targetX = e.clientX;
            document.querySelector('.cursor').targetY = e.clientY;
        }
    }

    // ===============================
    // Navigation
    // ===============================
    initializeNavigation() {
        this.updateActiveNav();
    }

    handleWindowScroll() {
        STATE.scrollY = window.pageYOffset;
        
        // Update navbar appearance
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (STATE.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Update active navigation
        this.updateActiveNav();

        // Update scroll-triggered animations
        this.handleScrollAnimations();
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        let currentSection = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleNavClick(e) {
        const href = e.target.getAttribute('href') || e.target.closest('a').getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                const offsetTop = utils.getOffset(targetSection).top - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (STATE.isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            }
        }
    }

    toggleMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        
        STATE.isMobileMenuOpen = !STATE.isMobileMenuOpen;
        
        if (mobileToggle) {
            mobileToggle.classList.toggle('active', STATE.isMobileMenuOpen);
        }
        
        if (mobileNav) {
            mobileNav.classList.toggle('active', STATE.isMobileMenuOpen);
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = STATE.isMobileMenuOpen ? 'hidden' : '';
    }

    // ===============================
    // Scroll Animations
    // ===============================
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger number animations for stats
                    if (entry.target.classList.contains('stat-number')) {
                        const targetNumber = parseInt(entry.target.getAttribute('data-count'));
                        utils.animateNumber(entry.target, 0, targetNumber, 2000);
                    }

                    // Trigger skill bar animations
                    if (entry.target.classList.contains('skill-item')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(`
            .about-text,
            .about-visual,
            .skill-category,
            .project-card,
            .contact-info,
            .contact-form,
            .stat-number,
            .skill-item
        `);

        animatedElements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 50}ms`;
            observer.observe(element);
        });
    }

    initializeAnimations() {
        // Add initial animation classes
        const fadeElements = document.querySelectorAll('.fade-in, .scale-in, .slide-in-left, .slide-in-right');
        fadeElements.forEach(element => {
            if (!element.classList.contains('visible')) {
                element.style.opacity = '0';
                if (element.classList.contains('fade-in')) {
                    element.style.transform = 'translateY(30px)';
                } else if (element.classList.contains('scale-in')) {
                    element.style.transform = 'scale(0.8)';
                } else if (element.classList.contains('slide-in-left')) {
                    element.style.transform = 'translateX(-50px)';
                } else if (element.classList.contains('slide-in-right')) {
                    element.style.transform = 'translateX(50px)';
                }
            }
        });
    }

    handleScrollAnimations() {
        // Parallax effect for floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(STATE.scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Update scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const opacity = utils.clamp(1 - (STATE.scrollY / 300), 0, 1);
            scrollIndicator.style.opacity = opacity;
        }
    }

    // ===============================
    // Typing Effect
    // ===============================
    initializeTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            'Full-Stack Developer',
            'UI/UX Designer',
            'Creative Coder',
            'Problem Solver'
        ];

        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentText = texts[currentTextIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }

            let typeSpeed = isDeleting ? CONFIG.typing.deleteSpeed : CONFIG.typing.speed;

            if (!isDeleting && currentCharIndex === currentText.length) {
                typeSpeed = CONFIG.typing.delayBetweenTexts;
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        // Start typing effect after hero animation
        setTimeout(type, 2000);
    }

    // ===============================
    // Skill Bars Animation
    // ===============================
    initializeSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const progressBar = item.querySelector('.skill-progress');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        });
    }

    animateSkillBar(skillItem) {
        const level = skillItem.getAttribute('data-level');
        const progressBar = skillItem.querySelector('.skill-progress');
        
        if (progressBar && level) {
            setTimeout(() => {
                progressBar.style.width = `${level}%`;
            }, 300);
        }
    }

    // ===============================
    // Contact Form
    // ===============================
    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));

        // Add form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const formData = new FormData(form);
        
        // Basic validation
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        this.setFormLoading(submitBtn, true);

        // Simulate form submission
        setTimeout(() => {
            this.setFormLoading(submitBtn, false);
            this.showFormSuccess();
            form.reset();
        }, 2000);
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(e);

        // Required field check
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = '#dc2626';
        
        let errorDiv = field.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    clearFieldError(e) {
        const field = e.target;
        field.style.borderColor = '';
        
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setFormLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showFormSuccess() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        let successDiv = form.querySelector('.success-message');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            form.appendChild(successDiv);
        }
        
        successDiv.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv) {
                successDiv.remove();
            }
        }, 5000);
    }

    // ===============================
    // Particles System
    // ===============================
    initializeParticles() {
        if (STATE.isReducedMotion || window.innerWidth <= 768) return;

        const canvas = this.createParticleCanvas();
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];

        // Create particles
        for (let i = 0; i < CONFIG.particles.count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.particles.speed,
                vy: (Math.random() - 0.5) * CONFIG.particles.speed,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x <= 0 || particle.x >= canvas.width) {
                    particle.vx = -particle.vx;
                }
                if (particle.y <= 0 || particle.y >= canvas.height) {
                    particle.vy = -particle.vy;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(14, 165, 233, ${particle.opacity})`;
                ctx.fill();

                // Connect particles
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    createParticleCanvas() {
        const hero = document.querySelector('.hero');
        if (!hero) return null;

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.6';
        canvas.style.zIndex = '1';

        const resizeCanvas = () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        hero.appendChild(canvas);
        return canvas;
    }

    // ===============================
    // Magnetic Effect
    // ===============================
    addMagneticEffect(element) {
        if (STATE.isReducedMotion || window.innerWidth <= 768) return;

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = Math.max(rect.width, rect.height) / 2;
            
            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = deltaX * strength * 0.3;
                const moveY = deltaY * strength * 0.3;
                
                element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate3d(0, 0, 0)';
        });
    }

    // ===============================
    // Performance Monitoring
    // ===============================
    initPerformanceMonitoring() {
        // Monitor FPS
        let fps = 0;
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFPS = (currentTime) => {
            frameCount++;
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;

                // Adjust animations based on performance
                if (fps < 30) {
                    this.reducedAnimations();
                }
            }
            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    reducedAnimations() {
        // Disable heavy animations if performance is poor
        const particles = document.querySelector('canvas');
        if (particles) {
            particles.style.display = 'none';
        }

        // Reduce floating elements animation
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(element => {
            element.style.animation = 'none';
        });
    }

    // ===============================
    // Window Event Handlers
    // ===============================
    handleWindowLoad() {
        // Initialize performance monitoring
        this.initPerformanceMonitoring();

        // Preload images for better performance
        this.preloadImages();

        // Initialize service worker if available
        this.initServiceWorker();
    }

    handleWindowResize() {
        // Update cursor system for mobile
        if (window.innerWidth <= 768) {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.display = 'none';
            }
        } else {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.display = 'block';
            }
        }

        // Update mobile menu
        if (window.innerWidth > 768 && STATE.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }

        // Recalculate animations
        this.recalculateAnimations();
    }

    preloadImages() {
        // Preload any background images or important assets
        const imageUrls = [
            // Add any image URLs that need preloading
        ];

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    recalculateAnimations() {
        // Recalculate any position-dependent animations
        const animatedElements = document.querySelectorAll('.fade-in, .scale-in');
        animatedElements.forEach(element => {
            if (utils.isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }

    // ===============================
    // Easter Eggs & Fun Features
    // ===============================
    initEasterEggs() {
        // Konami code easter egg
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];

        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }

            if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
                this.activateEasterEgg();
                konamiCode = [];
            }
        });

        // Double click on logo easter egg
        const logo = document.querySelector('.logo');
        if (logo) {
            let clickCount = 0;
            logo.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 5) {
                    this.activateLogoEasterEgg();
                    clickCount = 0;
                }
                setTimeout(() => clickCount = 0, 2000);
            });
        }
    }

    activateEasterEgg() {
        // Add rainbow colors to the page
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        // Add CSS for rainbow effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Remove after 5 seconds
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);
    }

    activateLogoEasterEgg() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.animation = 'spin 2s linear';
            setTimeout(() => {
                logo.style.animation = '';
            }, 2000);
        }
    }

    // ===============================
    // Accessibility Enhancements
    // ===============================
    initAccessibility() {
        // Add skip links
        this.addSkipLinks();

        // Improve focus management
        this.improveFocus();

        // Add ARIA labels dynamically
        this.addAriaLabels();

        // Handle reduced motion preferences
        this.handleReducedMotion();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            z-index: 1000;
            text-decoration: none;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    improveFocus() {
        // Ensure keyboard navigation works properly
        const focusableElements = document.querySelectorAll(`
            a[href], button, textarea, input[type="text"], 
            input[type="radio"], input[type="checkbox"], select
        `);

        focusableElements.forEach(element => {
            element.addEventListener('focus', (e) => {
                e.target.style.outline = '2px solid var(--primary-color)';
                e.target.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', (e) => {
                e.target.style.outline = '';
                e.target.style.outlineOffset = '';
            });
        });
    }

    addAriaLabels() {
        // Add missing ARIA labels
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text);
            }
        });

        // Add role attributes where needed
        const nav = document.querySelector('.navbar');
        if (nav) nav.setAttribute('role', 'navigation');

        const main = document.querySelector('#home');
        if (main) main.setAttribute('role', 'main');
    }

    handleReducedMotion() {
        if (STATE.isReducedMotion) {
            // Disable animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===============================
    // Debug Mode
    // ===============================
    initDebugMode() {
        // Enable debug mode with URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('debug') === 'true') {
            this.enableDebugMode();
        }
    }

    enableDebugMode() {
        // Add debug panel
        const debugPanel = document.createElement('div');
        debugPanel.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; font-family: monospace; font-size: 12px; z-index: 10000;">
                <div>FPS: <span id="debug-fps">0</span></div>
                <div>Scroll: <span id="debug-scroll">0</span></div>
                <div>Mouse: <span id="debug-mouse">0, 0</span></div>
                <div>Viewport: <span id="debug-viewport">${window.innerWidth}x${window.innerHeight}</span></div>
                <div>Theme: <span id="debug-theme">${STATE.currentTheme}</span></div>
            </div>
        `;
        document.body.appendChild(debugPanel);

        // Update debug info
        setInterval(() => {
            const fpsEl = document.getElementById('debug-fps');
            const scrollEl = document.getElementById('debug-scroll');
            const mouseEl = document.getElementById('debug-mouse');
            const viewportEl = document.getElementById('debug-viewport');
            const themeEl = document.getElementById('debug-theme');

            if (scrollEl) scrollEl.textContent = Math.round(STATE.scrollY);
            if (mouseEl) mouseEl.textContent = `${STATE.mousePosition.x}, ${STATE.mousePosition.y}`;
            if (viewportEl) viewportEl.textContent = `${window.innerWidth}x${window.innerHeight}`;
            if (themeEl) themeEl.textContent = STATE.currentTheme;
        }, 100);
    }
}

// ===============================
// Initialize Application
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Make app globally available for debugging
    if (typeof window !== 'undefined') {
        window.portfolioApp = app;
    }
});

// ===============================
// Export for modules (if needed)
// ===============================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, utils, CONFIG, STATE };
}



