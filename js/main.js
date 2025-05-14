/**
 * EnnieDevelopers - Main JavaScript
 * Author: EnnieDevelopers
 * Version: 1.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    // Initialize components
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    
    /**
     * Mobile Menu Functionality
     */
    function initMobileMenu() {
        if (mobileMenuToggle && navLinks) {
            mobileMenuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Close menu when clicking on a link
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.main-nav') && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }
    
    /**
     * Sticky Header on Scroll
     */
    function initStickyHeader() {
        if (header) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }
    
    /**
     * Smooth Scrolling for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Active Link Highlighting
     */
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-links a');
        
        window.addEventListener('scroll', function() {
            let current = '';
            const headerHeight = header.offsetHeight;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navItems.forEach(item => {
                item.classList.remove('active');
                if (current && item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
                
                // Special case for home link
                if (current === 'hero' && item.getAttribute('href') === 'index.html') {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Initialize any sliders or carousels
    initTestimonialSlider();
    
    /**
     * Testimonial Slider
     */
    function initTestimonialSlider() {
        const testimonialSlider = document.getElementById('testimonial-slider');
        const prevBtn = document.getElementById('prev-testimonial');
        const nextBtn = document.getElementById('next-testimonial');
        
        if (testimonialSlider && prevBtn && nextBtn) {
            const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
            let currentIndex = 0;
            
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.style.display = i === index ? 'block' : 'none';
                });
            }
            
            // Initialize slider
            showSlide(currentIndex);
            
            // Next button click
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            });
            
            // Previous button click
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(currentIndex);
            });
            
            // Auto slide every 5 seconds
            setInterval(function() {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            }, 5000);
        }
    }
    
    // Form validation for contact form
    initFormValidation();
    
    /**
     * Contact Form Validation
     */
    function initFormValidation() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                let isValid = true;
                
                // Reset any previous error messages
                const errorMessages = contactForm.querySelectorAll('.error-message');
                errorMessages.forEach(error => error.remove());
                
                // Validate name
                const nameInput = contactForm.querySelector('input[name="name"]');
                if (nameInput && nameInput.value.trim() === '') {
                    showError(nameInput, 'Name is required');
                    isValid = false;
                }
                
                // Validate email
                const emailInput = contactForm.querySelector('input[name="email"]');
                if (emailInput) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailInput.value.trim() === '') {
                        showError(emailInput, 'Email is required');
                        isValid = false;
                    } else if (!emailPattern.test(emailInput.value)) {
                        showError(emailInput, 'Please enter a valid email address');
                        isValid = false;
                    }
                }
                
                // Validate message
                const messageInput = contactForm.querySelector('textarea[name="message"]');
                if (messageInput && messageInput.value.trim() === '') {
                    showError(messageInput, 'Message is required');
                    isValid = false;
                }
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
            
            function showError(inputElement, message) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = message;
                errorElement.style.color = 'red';
                errorElement.style.fontSize = '0.875rem';
                errorElement.style.marginTop = '5px';
                
                // Insert error message after input
                inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
                
                // Add error class to input
                inputElement.classList.add('error');
            }
        }
    }
});