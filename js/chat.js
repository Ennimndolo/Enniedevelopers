/**
 * EnnieDevelopers - Chat Functionality
 * Author: EnnieDevelopers
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatToggle = document.getElementById('chat-toggle');
    const chatPopup = document.getElementById('chat-popup');
    
    // Initialize Chat Widget
    if (chatToggle && chatPopup) {
        initChatWidget();
    }
    
    /**
     * Initialize Chat Widget Functionality
     */
    function initChatWidget() {
        // Create chat UI structure
        createChatUI();
        
        // Toggle chat popup
        chatToggle.addEventListener('click', function() {
            chatPopup.classList.toggle('active');
            
            // If opening the chat, focus on input
            if (chatPopup.classList.contains('active')) {
                const chatInput = document.getElementById('chat-input');
                if (chatInput) {
                    chatInput.focus();
                }
                
                // Load chat history if not already loaded
                if (!chatPopup.dataset.loaded) {
                    loadChatHistory();
                    chatPopup.dataset.loaded = 'true';
                }
            }
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', function(event) {
            if (chatPopup.classList.contains('active') && 
                !event.target.closest('.chat-popup') && 
                !event.target.closest('.chat-toggle')) {
                chatPopup.classList.remove('active');
            }
        });
    }
    
    /**
     * Create Chat UI Elements
     */
    function createChatUI() {
        // Create chat header
        const chatHeader = document.createElement('div');
        chatHeader.className = 'chat-header';
        chatHeader.innerHTML = `
            <h3>Live Chat with Enniedevelopers</h3>
            <button id="chat-close" class="chat-close">&times;</button>
        `;
        
        // Create chat body (messages container)
        const chatBody = document.createElement('div');
        chatBody.className = 'chat-body';
        chatBody.id = 'chat-messages';
        
        // Create welcome message
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'chat-message admin-message';
        welcomeMessage.innerHTML = `
            <div class="message-content">
                <p>Welcome to EnnieDevelopers! How can we help you today?</p>
                <span class="message-time">${formatTime(new Date())}</span>
            </div>
        `;
        chatBody.appendChild(welcomeMessage);
        
        // Create chat footer (input area)
        const chatFooter = document.createElement('div');
        chatFooter.className = 'chat-footer';
        chatFooter.innerHTML = `
            <input type="text" id="chat-input" placeholder="Type your message...">
            <button id="chat-send" class="chat-send">
                <i class="fas fa-paper-plane"></i>
            </button>
        `;
        
        // Append all elements to chat popup
        chatPopup.appendChild(chatHeader);
        chatPopup.appendChild(chatBody);
        chatPopup.appendChild(chatFooter);
        
        // Add event listeners
        document.getElementById('chat-close').addEventListener('click', function() {
            chatPopup.classList.remove('active');
        });
        
        document.getElementById('chat-send').addEventListener('click', sendMessage);
        
        document.getElementById('chat-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    /**
     * Send Chat Message
     */
    function sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');
        
        if (chatInput && chatInput.value.trim() !== '') {
            const messageText = chatInput.value.trim();
            
            // Create user message element
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user-message';
            userMessage.innerHTML = `
                <div class="message-content">
                    <p>${escapeHTML(messageText)}</p>
                    <span class="message-time">${formatTime(new Date())}</span>
                </div>
            `;
            
            // Add to chat
            chatMessages.appendChild(userMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Save message to local storage for demo purposes
            saveMessageToHistory({
                type: 'user',
                content: messageText,
                time: new Date().toISOString()
            });
            
            // Send to server in production
            // In this demo, we'll simulate a response
            simulateResponse(messageText);
        }
    }
    
    /**
     * Simulate Admin Response (for demo purposes)
     */
    function simulateResponse(userMessage) {
        const chatMessages = document.getElementById('chat-messages');
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingIndicator);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Prepare response based on user message
        let responseText = '';
        
        // Simple keyword matching for demo
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            responseText = 'Our pricing plans start at $99/month for basic websites. For more details, please visit our pricing page or provide your email for a custom quote.';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
            responseText = 'You can reach us at info@enniedevelopers.com or call us at (123) 456-7890. Alternatively, fill out the contact form on our contact page.';
        } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('projects')) {
            responseText = 'We have completed over 100 projects across various industries. You can view our portfolio on the portfolio page to see examples of our work.';
        } else if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
            responseText = 'We offer web design, web development, e-commerce solutions, mobile app development, and SEO services. Check our services page for more information.';
        } else {
            responseText = 'Thank you for your message. One of our team members will get back to you shortly. Is there anything specific you would like to know about our services?';
        }
        
        // Simulate typing delay
        setTimeout(function() {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Create admin message
            const adminMessage = document.createElement('div');
            adminMessage.className = 'chat-message admin-message';
            adminMessage.innerHTML = `
                <div class="message-content">
                    <p>${responseText}</p>
                    <span class="message-time">${formatTime(new Date())}</span>
                </div>
            `;
            
            // Add to chat
            chatMessages.appendChild(adminMessage);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Save message to history
            saveMessageToHistory({
                type: 'admin',
                content: responseText,
                time: new Date().toISOString()
            });
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }
    
    /**
     * Save Chat Message to History (Local Storage)
     * In production, this would send to a database via AJAX
     */
    function saveMessageToHistory(message) {
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        chatHistory.push(message);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
    
    /**
     * Load Chat History from Local Storage
     * In production, this would fetch from a database via AJAX
     */
    function loadChatHistory() {
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        const chatMessages = document.getElementById('chat-messages');
        
        // Clear existing messages except welcome message
        while (chatMessages.childNodes.length > 1) {
            chatMessages.removeChild(chatMessages.lastChild);
        }
        
        // Add messages from history
        chatHistory.forEach(message => {
            const messageEl = document.createElement('div');
            messageEl.className = `chat-message ${message.type}-message`;
            
            messageEl.innerHTML = `
                <div class="message-content">
                    <p>${escapeHTML(message.content)}</p>
                    <span class="message-time">${formatTime(new Date(message.time))}</span>
                </div>
            `;
            
            chatMessages.appendChild(messageEl);
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    /**
     * Format Time for Chat Messages
     */
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    /**
     * Escape HTML Special Characters for Security
     */
    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#039;');
    }
    
    // Add CSS for chat widget
    addChatStyles();
    
    /**
     * Add Chat Widget Styles
     */
    function addChatStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .chat-popup {
                display: none;
            }
            
            .chat-popup.active {
                display: flex;
                flex-direction: column;
            }
            
            .chat-header {
                background-color: #4A6CF7;
                color: white;
                padding: 10px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 10px 10px 0 0;
            }
            
            .chat-header h3 {
                margin: 0;
                font-size: 1rem;
            }
            
            .chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                line-height: 1;
            }
            
            .chat-body {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
                background-color: #f5f5f5;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .chat-message {
                max-width: 80%;
                padding: 10px 15px;
                border-radius: 15px;
                position: relative;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .admin-message {
                align-self: flex-start;
                background-color: white;
                border-bottom-left-radius: 5px;
            }
            
            .user-message {
                align-self: flex-end;
                background-color: #4A6CF7;
                color: white;
                border-bottom-right-radius: 5px;
            }
            
            .message-content p {
                margin: 0 0 5px 0;
            }
            
            .message-time {
                font-size: 0.7rem;
                opacity: 0.7;
                display: block;
                text-align: right;
            }
            
            .chat-footer {
                display: flex;
                align-items: center;
                padding: 10px;
                background-color: white;
                border-top: 1px solid #e0e0e0;
                border-radius: 0 0 10px 10px;
            }
            
            #chat-input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 20px;
                margin-right: 10px;
                outline: none;
            }
            
            .chat-send {
                background-color: #4A6CF7;
                color: white;
                border: none;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .chat-send:hover {
                background-color: #3652D9;
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                align-self: flex-start;
                background-color: #f1f1f1;
                padding: 10px 15px;
                border-radius: 15px;
                margin-bottom: 10px;
            }
            
            .typing-indicator span {
                width: 8px;
                height: 8px;
                margin: 0 2px;
                background-color: #999;
                border-radius: 50%;
                display: inline-block;
                animation: bounce 1.3s infinite ease-in-out;
            }
            
            .typing-indicator span:nth-child(1) { animation-delay: 0s; }
            .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes bounce {
                0%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-8px); }
            }
        `;
        
        document.head.appendChild(style);
    }
});
// scroll button

  window.onscroll = function() {
    const div = document.getElementById("scrollTopDiv");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  };

  function scrollToTop(duration = 1000) {
    const start = document.documentElement.scrollTop || document.body.scrollTop;
    const startTime = performance.now();

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const scrollTo = start * (1 - ease);

      window.scrollTo(0, scrollTo);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }
  // Wait for entire page to load
  window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");

    // Optional delay to let animation finish
    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }, 500);
  });

