/**
 * EnnieDevelopers - FAQ Functionality
 * Author: EnnieDevelopers
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Only initialize if FAQ items exist on the page
    if (faqItems.length > 0) {
        initFAQ();
    }
    
    /**
     * Initialize FAQ functionality
     */
    function initFAQ() {
        // Add click event listener to each FAQ question
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Toggle active class on the clicked FAQ item
                item.classList.toggle('active');
                
                // Update toggle icon
                updateToggleIcon(item);
                
                // Collapse other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        updateToggleIcon(otherItem);
                    }
                });
            });
        });
        
        // Add CSS for FAQ functionality
        addFAQStyles();
    }
    
    /**
     * Update toggle icon based on FAQ item state
     * 
     * @param {HTMLElement} item FAQ item element
     */
    function updateToggleIcon(item) {
        const toggleIcon = item.querySelector('.faq-toggle i');
        
        if (item.classList.contains('active')) {
            toggleIcon.classList.remove('fa-plus');
            toggleIcon.classList.add('fa-minus');
        } else {
            toggleIcon.classList.remove('fa-minus');
            toggleIcon.classList.add('fa-plus');
        }
    }
    
    /**
     * Add CSS for FAQ functionality
     */
    function addFAQStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .faq-item {
                margin-bottom: 1rem;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-md);
                overflow: hidden;
                background-color: white;
            }
            
            .faq-question {
                padding: 1.25rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                background-color: white;
                transition: background-color var(--transition-fast);
            }
            
            .faq-question:hover {
                background-color: var(--background-light);
            }
            
            .faq-question h3 {
                margin: 0;
                font-size: 1.125rem;
                font-weight: 600;
            }
            
            .faq-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: var(--primary-light);
                color: var(--primary-color);
                transition: all var(--transition-fast);
            }
            
            .faq-answer {
                max-height: 0;
                overflow: hidden;
                transition: max-height var(--transition-normal);
                padding: 0 1.25rem;
            }
            
            .faq-item.active .faq-answer {
                max-height: 500px;
                padding: 0 1.25rem 1.25rem;
            }
            
            .faq-answer p {
                margin-top: 0;
            }
            
            @media (max-width: 767.98px) {
                .faq-question h3 {
                    font-size: 1rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
});