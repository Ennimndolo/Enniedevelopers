/**
 * EnnieDevelopers - Authentication JavaScript
 * Author: EnnieDevelopers
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginSuccess = document.getElementById('login-success');
    const loginError = document.getElementById('login-error');
    const registerSuccess = document.getElementById('register-success');
    const registerError = document.getElementById('register-error');
    
    // Only initialize if auth elements exist on the page
    if (authTabs.length > 0 && authForms.length > 0) {
        initAuthForms();
    }
    
    /**
     * Initialize authentication forms and tabs
     */
    function initAuthForms() {
        // Tab switching
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                authTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding form
                const tabId = tab.getAttribute('data-tab');
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${tabId}-form`) {
                        form.classList.add('active');
                    }
                });
                
                // Hide all status messages
                hideStatusMessages();
                
                // Handle URL hash for deep linking
                if (window.history.pushState) {
                    window.history.pushState(null, null, `#${tabId}`);
                } else {
                    window.location.hash = tabId;
                }
            });
        });
        
        // Check URL hash for deep linking
        checkUrlHash();
        
        // Handle URL parameters for error/success messages
        checkUrlParams();
        
        // Form validation and submission
        if (loginForm) {
            setupLoginForm();
        }
        
        if (registerForm) {
            setupRegisterForm();
        }
        
        // Add CSS for auth forms
        addAuthStyles();
    }
    
    /**
     * Check URL hash for deep linking to specific tab
     */
    function checkUrlHash() {
        const hash = window.location.hash.substring(1);
        if (hash === 'login' || hash === 'register') {
            // Activate corresponding tab
            authTabs.forEach(tab => {
                if (tab.getAttribute('data-tab') === hash) {
                    tab.click();
                }
            });
        }
    }
    
    /**
     * Check URL parameters for error/success messages
     */
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for success message
        if (urlParams.has('success')) {
            const success = urlParams.get('success');
            if (success === 'login') {
                showLoginSuccess('Login successful');
            } else if (success === 'register') {
                showRegisterSuccess('Registration successful');
            }
        }
        
        // Check for error message
        if (urlParams.has('error')) {
            const error = urlParams.get('error');
            const errorMessage = decodeURIComponent(urlParams.get('message') || 'An error occurred');
            
            if (error === 'login') {
                showLoginError(errorMessage);
            } else if (error === 'register') {
                showRegisterError(errorMessage);
                // Switch to register tab
                authTabs.forEach(tab => {
                    if (tab.getAttribute('data-tab') === 'register') {
                        tab.click();
                    }
                });
            }
        }
    }
    
    /**
     * Setup login form validation and submission
     */
    function setupLoginForm() {
        loginForm.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Validate form
            if (validateLoginForm()) {
                // If valid, submit the form via AJAX
                submitLoginForm();
            }
        });
        
        // Add input event listeners for real-time validation
        const inputs = loginForm.querySelectorAll('input');
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
     * Setup registration form validation and submission
     */
    function setupRegisterForm() {
        registerForm.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Validate form
            if (validateRegisterForm()) {
                // If valid, submit the form via AJAX
                submitRegisterForm();
            }
        });
        
        // Add input event listeners for real-time validation
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                // Remove error class when user starts typing
                this.classList.remove('error');
                const errorElement = this.nextElementSibling;
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.remove();
                }
                
                // Special case for password confirmation
                if (input.id === 'register-confirm-password' || input.id === 'register-password') {
                    validatePasswordMatch();
                }
            });
        });
    }
    
    /**
     * Validate login form
     * 
     * @return {boolean} True if valid, false otherwise
     */
    function validateLoginForm() {
        let isValid = true;
        
        // Remove any existing error messages
        const existingErrors = loginForm.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Reset error styles
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => input.classList.remove('error'));
        
        // Hide previous status messages
        hideStatusMessages();
        
        // Get form inputs
        const username = loginForm.querySelector('#login-username');
        const password = loginForm.querySelector('#login-password');
        
        // Validate username
        if (!username.value.trim()) {
            showFieldError(username, 'Username is required');
            isValid = false;
        }
        
        // Validate password
        if (!password.value.trim()) {
            showFieldError(password, 'Password is required');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Validate registration form
     * 
     * @return {boolean} True if valid, false otherwise
     */
    function validateRegisterForm() {
        let isValid = true;
        
        // Remove any existing error messages
        const existingErrors = registerForm.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Reset error styles
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => input.classList.remove('error'));
        
        // Hide previous status messages
        hideStatusMessages();
        
        // Get form inputs
        const username = registerForm.querySelector('#register-username');
        const email = registerForm.querySelector('#register-email');
        const password = registerForm.querySelector('#register-password');
        const confirmPassword = registerForm.querySelector('#register-confirm-password');
        const termsAgree = registerForm.querySelector('#terms-agree');
        
        // Validate username
        if (!username.value.trim()) {
            showFieldError(username, 'Username is required');
            isValid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            showFieldError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password.value.trim()) {
            showFieldError(password, 'Password is required');
            isValid = false;
        } else if (password.value.length < 8) {
            showFieldError(password, 'Password must be at least 8 characters long');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword.value.trim()) {
            showFieldError(confirmPassword, 'Please confirm your password');
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            showFieldError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }
        
        // Validate terms agreement
        if (!termsAgree.checked) {
            showFieldError(termsAgree, 'You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Validate password match in real-time
     */
    function validatePasswordMatch() {
        const password = registerForm.querySelector('#register-password');
        const confirmPassword = registerForm.querySelector('#register-confirm-password');
        
        // Only validate if both fields have values
        if (password.value && confirmPassword.value) {
            // Remove any existing error messages
            const existingError = confirmPassword.parentNode.nextElementSibling;
            if (existingError && existingError.classList.contains('error-message')) {
                existingError.remove();
            }
            
            // Check if passwords match
            if (password.value !== confirmPassword.value) {
                showFieldError(confirmPassword, 'Passwords do not match');
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Submit login form via AJAX
     */
    function submitLoginForm() {
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';
        
        // Get form data
        const formData = new FormData(loginForm);
        
        // Send AJAX request
        fetch(loginForm.action, {
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
                showLoginSuccess(data.message);
                
                // Clear form
                loginForm.reset();
                
                // Redirect to appropriate page after a delay
                setTimeout(() => {
                    window.location.href = data.redirect || 'index.html';
                }, 1500);
            } else {
                // Show error message
                showLoginError(data.message);
            }
        })
        .catch(error => {
            // Reset submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Show error message
            showLoginError('An error occurred. Please try again later.');
            console.error('Login error:', error);
        });
    }
    
    /**
     * Submit registration form via AJAX
     */
    function submitRegisterForm() {
        // Show loading state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';
        
        // Get form data
        const formData = new FormData(registerForm);
        
        // Send AJAX request
        fetch(registerForm.action, {
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
                showRegisterSuccess(data.message);
                
                // Clear form
                registerForm.reset();
                
                // Switch to login tab after a delay
                setTimeout(() => {
                    authTabs[0].click(); // Login tab
                }, 1500);
            } else {
                // Show error message
                showRegisterError(data.message);
            }
        })
        .catch(error => {
            // Reset submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Show error message
            showRegisterError('An error occurred. Please try again later.');
            console.error('Registration error:', error);
        });
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
        
        // Insert error message after input or its container
        const parent = inputElement.type === 'checkbox' ? inputElement.parentNode : inputElement.parentNode.parentNode;
        parent.insertBefore(errorElement, parent.nextSibling);
    }
    
    /**
     * Show login success message
     * 
     * @param {string} message Success message
     */
    function showLoginSuccess(message) {
        loginSuccess.textContent = message;
        loginSuccess.style.display = 'block';
        loginError.style.display = 'none';
    }
    
    /**
     * Show login error message
     * 
     * @param {string} message Error message
     */
    function showLoginError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
        loginSuccess.style.display = 'none';
    }
    
    /**
     * Show register success message
     * 
     * @param {string} message Success message
     */
    function showRegisterSuccess(message) {
        registerSuccess.textContent = message;
        registerSuccess.style.display = 'block';
        registerError.style.display = 'none';
    }
    
    /**
     * Show register error message
     * 
     * @param {string} message Error message
     */
    function showRegisterError(message) {
        registerError.textContent = message;
        registerError.style.display = 'block';
        registerSuccess.style.display = 'none';
    }
    
    /**
     * Hide all status messages
     */
    function hideStatusMessages() {
        loginSuccess.style.display = 'none';
        loginError.style.display = 'none';
        registerSuccess.style.display = 'none';
        registerError.style.display = 'none';
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
     * Add CSS for auth forms
     */
    function addAuthStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #auth-section {
                min-height: calc(100vh - 300px);
                display: flex;
                align-items: center;
                padding-top: 100px;
            }
            
            .auth-container {
                display: flex;
                background-color: white;
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-lg);
                overflow: hidden;
                max-width: 1000px;
                margin: 0 auto;
            }
            
            .auth-form-container {
                flex: 1;
                padding: var(--spacing-lg);
            }
            
            .auth-info {
                flex: 1;
                background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                color: white;
                padding: var(--spacing-lg);
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            .auth-tabs {
                display: flex;
                margin-bottom: var(--spacing-lg);
                border-bottom: 1px solid var(--border-color);
            }
            
            .auth-tab {
                background: none;
                border: none;
                padding: var(--spacing-md) var(--spacing-lg);
                font-size: 1rem;
                font-weight: 600;
                color: var(--text-light);
                cursor: pointer;
                position: relative;
                transition: color var(--transition-fast);
            }
            
            .auth-tab:hover {
                color: var(--primary-color);
            }
            
            .auth-tab.active {
                color: var(--primary-color);
            }
            
            .auth-tab.active:after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: var(--primary-color);
            }
            
            .auth-forms {
                position: relative;
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .form-group {
                margin-bottom: var(--spacing-md);
            }
            
            .input-with-icon {
                position: relative;
            }
            
            .input-with-icon i {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-light);
            }
            
            .input-with-icon input {
                padding-left: 40px;
            }
            
            .remember-forgot {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-md);
            }
            
            .checkbox-container {
                display: flex;
                align-items: center;
            }
            
            .checkbox-container label {
                margin-left: 8px;
                cursor: pointer;
            }
            
            .forgot-password {
                color: var(--primary-color);
                font-size: 0.875rem;
            }
            
            .btn-block {
                width: 100%;
            }
            
            .form-hint {
                display: block;
                font-size: 0.75rem;
                color: var(--text-light);
                margin-top: 4px;
            }
            
            .auth-benefits {
                list-style: none;
                padding: 0;
                margin: var(--spacing-md) 0 var(--spacing-lg);
            }
            
            .auth-benefits li {
                margin-bottom: var(--spacing-sm);
                display: flex;
                align-items: center;
            }
            
            .auth-benefits i {
                margin-right: 8px;
                color: var(--secondary-color);
            }
            
            .auth-testimonial {
                background-color: rgba(255, 255, 255, 0.1);
                padding: var(--spacing-md);
                border-radius: var(--border-radius-md);
                margin-top: auto;
            }
            
            .testimonial-author {
                margin-top: var(--spacing-sm);
            }
            
            .author-name {
                font-weight: 600;
                display: block;
            }
            
            .author-title {
                font-size: 0.875rem;
                opacity: 0.8;
            }
            
            .alert-success, .alert-error {
                padding: 10px 15px;
                border-radius: var(--border-radius-md);
                margin-bottom: var(--spacing-md);
            }
            
            .alert-success {
                background-color: rgba(52, 199, 89, 0.1);
                border: 1px solid var(--success-color);
                color: var(--success-color);
            }
            
            .alert-error {
                background-color: rgba(255, 59, 48, 0.1);
                border: 1px solid var(--error-color);
                color: var(--error-color);
            }
            
            .error-message {
                color: var(--error-color);
                font-size: 0.75rem;
                margin-top: 4px;
            }
            
            input.error {
                border-color: var(--error-color);
            }
            
            @media (max-width: 991.98px) {
                .auth-container {
                    flex-direction: column;
                }
                
                .auth-info {
                    padding: var(--spacing-lg);
                }
            }
            
            @media (max-width: 767.98px) {
                #auth-section {
                    padding-top: 80px;
                }
                
                .auth-form-container {
                    padding: var(--spacing-md);
                }
                
                .auth-info {
                    padding: var(--spacing-md);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
});