/**
 * EnnieDevelopers - Contact Form Handler
 * Author: EnnieDevelopers
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get contact form element
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('contact-success');
    const errorMessage = document.getElementById('contact-error');
    
    // Only initialize if form exists on the page
    if (contactForm) {
        initContactForm();
    }
    
    /**
     * Initialize Contact Form
     */
    function initContactForm() {
        // Check for success/error messages in URL params (for page reload after form submission)
        checkUrlParams();
        
        // Add form submission handler
        contactForm.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // If valid, submit the form via AJAX
                submitForm();
            }
        });
        
        // Add input event listeners for real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                // Remove error class when user starts typing
                this.classList.remove('error');
                const errorElement = this.nextElementSibling;
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.remove();
                }
            });
        });
    }
    
    /**
     * Check URL parameters for success/error messages
     */
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for success message
        if (urlParams.has('success')) {
            const success = urlParams.get('success');
            if (success === 'true') {
                showSuccess('Thank you! Your message has been sent successfully.');
                // Clear form
                contactForm.reset();
            }
        }
        
        // Check for error message
        if (urlParams.has('error')) {
            const error = urlParams.get('error');
            showError(decodeURIComponent(error));
        }
    }
    
    /**
     * Validate the contact form
     * 
     * @return {boolean} True if valid, false otherwise
     */
    function validateForm() {
        let isValid = true;
        
        // Remove any existing error messages
        const existingErrors = contactForm.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Reset error styles
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => input.classList.remove('error'));
        
        // Hide previous status messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Required fields
        const requiredFields = ['name', 'email', 'message'];
        
        // Validate each required field
        requiredFields.forEach(field => {
            const input = contactForm.querySelector(`#${field}`);
            if (!input.value.trim()) {
                showFieldError(input, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                isValid = false;
            }
        });
        
        // Validate email format
        const emailInput = contactForm.querySelector('#email');
        if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
            showFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Show field-specific error message
     * 
     * @param {HTMLElement} inputElement Input element with error
     * @param {string} message Error message
     */
    function showFieldError(inputElement, message) {
        // Add error class to input
        inputElement.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Insert error message after input
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
    
    /**
     * Validate email format
     * 
     * @param {string} email Email to validate
     * @return {boolean} True if valid, false otherwise
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    /**
     * Submit form via AJAX
     */
    function submitForm() {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Send AJAX request
        fetch(contactForm.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Reset submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            if (data.success) {
                // Show success message
                showSuccess(data.message);
                // Clear form
                contactForm.reset();
            } else {
                // Show error message
                showError(data.message);
            }
        })
        .catch(error => {
            // Reset submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Show error message
            showError('An error occurred while sending your message. Please try again later.');
            console.error('Contact form error:', error);
        });
    }
    
    /**
     * Show success message
     * 
     * @param {string} message Success message
     */
    function showSuccess(message) {
        // Hide error message
        errorMessage.style.display = 'none';
        
        // Show success message
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        // Scroll to message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    /**
     * Show error message
     * 
     * @param {string} message Error message
     */
    function showError(message) {
        // Hide success message
        successMessage.style.display = 'none';
        
        // Show error message
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Scroll to message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});