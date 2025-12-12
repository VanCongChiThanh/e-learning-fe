(function () {
  "use strict";

  // CSS Styles
  const CSS_STYLES = `
        /* Widget Container */
        .chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Toggle Button */
        .chatbot-toggle {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chatbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }

        .chatbot-toggle svg {
            width: 24px;
            height: 24px;
            fill: white;
            transition: transform 0.3s ease;
        }

        .chatbot-toggle.active svg {
            transform: rotate(45deg);
        }

        /* Chat Container */
        .chatbot-container {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .chatbot-container.active {
            transform: translateY(0) scale(1);
            opacity: 1;
            visibility: visible;
        }

        /* Header */
        .chatbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            font-weight: 600;
        }

        /* Messages Container */
        .chatbot-messages {
            height: 350px;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }

        .chatbot-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        .chatbot-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        /* Message Bubbles */
        .chatbot-message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.4;
            animation: chatbotFadeInUp 0.3s ease;
        }

        .chatbot-message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 6px;
        }

        .chatbot-message.bot {
            align-self: flex-start;
            background: #f8f9fa;
            color: #333;
            border: 1px solid #e9ecef;
            border-bottom-left-radius: 6px;
        }

        .chatbot-message.typing {
            align-self: flex-start;
            background: #f8f9fa;
            color: #666;
            border: 1px solid #e9ecef;
            border-bottom-left-radius: 6px;
        }

        /* Typing Animation */
        .chatbot-typing-dots {
            display: inline-block;
        }

        .chatbot-typing-dots span {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #666;
            margin: 0 2px;
            animation: chatbotTypingAnimation 1.4s infinite ease-in-out;
        }

        .chatbot-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .chatbot-typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes chatbotTypingAnimation {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }

        @keyframes chatbotFadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Input Container */
        .chatbot-input-container {
            padding: 20px;
            border-top: 1px solid #e9ecef;
            display: flex;
            gap: 10px;
        }

        .chatbot-input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .chatbot-input:focus {
            border-color: #667eea;
        }

        .chatbot-send {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            transition: transform 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chatbot-send:hover {
            transform: scale(1.05);
        }

        .chatbot-send:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
            .chatbot-container {
                width: 300px;
                height: 450px;
                right: 10px;
                bottom: 70px;
            }
            
            .chatbot-messages {
                height: 300px;
            }
            
            .chatbot-widget {
                right: 10px;
                bottom: 10px;
            }
        }

        /* Error Message */
        .chatbot-error-message {
            background: #fee;
            color: #c33;
            border: 1px solid #fcc;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            text-align: center;
            margin: 10px 0;
        }

        /* Position variants */
        .chatbot-widget.position-left {
            left: 20px;
            right: auto;
        }

        .chatbot-widget.position-left .chatbot-container {
            left: 0;
            right: auto;
        }

        /* Theme variants */
        .chatbot-widget.theme-dark .chatbot-container {
            background: #2d3748;
            color: white;
        }

        .chatbot-widget.theme-dark .chatbot-message.bot {
            background: #4a5568;
            color: white;
            border-color: #5a6578;
        }

        .chatbot-widget.theme-dark .chatbot-input {
            background: #4a5568;
            border-color: #5a6578;
            color: white;
        }

        .chatbot-widget.theme-dark .chatbot-input::placeholder {
            color: #a0aec0;
        }
    `;

  // HTML Template
  const HTML_TEMPLATE = `
        <div class="chatbot-widget" id="chatbotWidget">
            <!-- Toggle Button -->
            <button class="chatbot-toggle" id="chatbotToggle">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
            </button>

            <!-- Chat Container -->
            <div class="chatbot-container" id="chatbotContainer">
                <!-- Header -->
                <div class="chatbot-header">
                    <div id="chatbotTitle">💬 Trợ lý AI</div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;" id="chatbotSubtitle">
                        Xin chào! Tôi có thể giúp gì cho bạn?
                    </div>
                </div>

                <!-- Messages -->
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="chatbot-message bot">
                        Xin chào! Tôi là trợ lý AI. Bạn có câu hỏi gì muốn hỏi không?
                    </div>
                </div>

                <!-- Input -->
                <div class="chatbot-input-container">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbotInput" 
                        placeholder="Nhập câu hỏi của bạn..."
                        maxlength="500"
                    >
                    <button class="chatbot-send" id="chatbotSend">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

  // Main ChatbotWidget Class
  class ChatbotWidget {
    constructor(options = {}) {
      this.options = {
        apiUrl: options.apiUrl || "http://localhost:8000",
        position: options.position || "right", // 'right' or 'left'
        theme: options.theme || "light", // 'light' or 'dark'
        title: options.title || "💬 Trợ lý AI",
        subtitle: options.subtitle || "Xin chào! Tôi có thể giúp gì cho bạn?",
        placeholder: options.placeholder || "Nhập câu hỏi của bạn...",
        welcomeMessage:
          options.welcomeMessage ||
          "Xin chào! Tôi là trợ lý AI. Bạn có câu hỏi gì muốn hỏi không?",
        primaryColor: options.primaryColor || "#667eea",
        secondaryColor: options.secondaryColor || "#764ba2",
        ...options,
      };

      this.isOpen = false;
      this.isLoading = false;
      this.messageHistory = [];

      this.init();
    }

    init() {
      this.injectStyles();
      this.createWidget();
      this.bindEvents();
      this.applyCustomizations();
    }

    injectStyles() {
      if (document.getElementById("chatbot-widget-styles")) return;

      const styleSheet = document.createElement("style");
      styleSheet.id = "chatbot-widget-styles";
      styleSheet.textContent = CSS_STYLES;
      document.head.appendChild(styleSheet);
    }

    createWidget() {
      // Remove existing widget if present
      const existing = document.getElementById("chatbotWidget");
      if (existing) existing.remove();

      // Create widget container
      const widgetContainer = document.createElement("div");
      widgetContainer.innerHTML = HTML_TEMPLATE;
      document.body.appendChild(widgetContainer.firstElementChild);

      this.initElements();
    }

    initElements() {
      this.widget = document.getElementById("chatbotWidget");
      this.toggle = document.getElementById("chatbotToggle");
      this.container = document.getElementById("chatbotContainer");
      this.messages = document.getElementById("chatbotMessages");
      this.input = document.getElementById("chatbotInput");
      this.sendBtn = document.getElementById("chatbotSend");
      this.title = document.getElementById("chatbotTitle");
      this.subtitle = document.getElementById("chatbotSubtitle");
    }

    bindEvents() {
      this.toggle.addEventListener("click", () => this.toggleChat());
      this.sendBtn.addEventListener("click", () => this.sendMessage());
      this.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Close on outside click
      document.addEventListener("click", (e) => {
        if (this.isOpen && !this.widget.contains(e.target)) {
          this.toggleChat();
        }
      });

      // Handle ESC key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.toggleChat();
        }
      });
    }

    applyCustomizations() {
      // Position
      if (this.options.position === "left") {
        this.widget.classList.add("position-left");
      }

      // Theme
      if (this.options.theme === "dark") {
        this.widget.classList.add("theme-dark");
      }

      // Custom text
      if (this.title) this.title.textContent = this.options.title;
      if (this.subtitle) this.subtitle.textContent = this.options.subtitle;
      if (this.input) this.input.placeholder = this.options.placeholder;

      // Update welcome message
      const firstMessage = this.messages.querySelector(".chatbot-message.bot");
      if (firstMessage) {
        firstMessage.textContent = this.options.welcomeMessage;
      }

      // Custom colors
      if (this.options.primaryColor || this.options.secondaryColor) {
        this.applyCustomColors();
      }
    }

    applyCustomColors() {
      const primary = this.options.primaryColor;
      const secondary = this.options.secondaryColor;

      const customStyles = `
                .chatbot-toggle {
                    background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);
                }
                .chatbot-header {
                    background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);
                }
                .chatbot-message.user {
                    background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);
                }
                .chatbot-send {
                    background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);
                }
                .chatbot-input:focus {
                    border-color: ${primary};
                }
            `;

      const styleSheet = document.createElement("style");
      styleSheet.textContent = customStyles;
      document.head.appendChild(styleSheet);
    }

    toggleChat() {
      this.isOpen = !this.isOpen;
      this.container.classList.toggle("active", this.isOpen);
      this.toggle.classList.toggle("active", this.isOpen);

      if (this.isOpen) {
        setTimeout(() => this.input.focus(), 300);
      }

      // Trigger events
      if (this.isOpen) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }

    async sendMessage() {
      const query = this.input.value.trim();
      if (!query || this.isLoading) return;

      // Add to history
      this.messageHistory.push({
        type: "user",
        text: query,
        timestamp: new Date(),
      });

      // Add user message
      this.addMessage(query, "user");
      this.input.value = "";

      // Show typing indicator
      this.showTyping();

      try {
        const response = await this.callAPI(query);

        // Remove typing indicator and add bot response
        this.hideTyping();

        if (response && response.answer) {
          this.messageHistory.push({
            type: "bot",
            text: response.answer,
            timestamp: new Date(),
            context: response.context_used,
          });
          this.addMessage(response.answer, "bot");
        } else {
          throw new Error("Không nhận được phản hồi hợp lệ từ server");
        }
      } catch (error) {
        console.error("Chatbot Error:", error);
        this.hideTyping();
        this.showError(error.message);
      }
    }

    async callAPI(query) {
      const url = `${this.options.apiUrl}/ask?query=${encodeURIComponent(
        query
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    }

    addMessage(text, type) {
      const messageDiv = document.createElement("div");
      messageDiv.className = `chatbot-message ${type}`;
      messageDiv.textContent = text;

      this.messages.appendChild(messageDiv);
      this.messages.scrollTop = this.messages.scrollHeight;

      // Trigger message event
      this.onMessage(text, type);
    }

    showTyping() {
      this.isLoading = true;
      this.sendBtn.disabled = true;

      const typingDiv = document.createElement("div");
      typingDiv.className = "chatbot-message typing";
      typingDiv.id = "chatbotTypingIndicator";
      typingDiv.innerHTML = `
                Đang trả lời
                <span class="chatbot-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            `;

      this.messages.appendChild(typingDiv);
      this.messages.scrollTop = this.messages.scrollHeight;
    }

    hideTyping() {
      this.isLoading = false;
      this.sendBtn.disabled = false;

      const typingIndicator = document.getElementById("chatbotTypingIndicator");
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }

    showError(message) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "chatbot-error-message";
      errorDiv.textContent = `Lỗi: ${message}`;

      this.messages.appendChild(errorDiv);
      this.messages.scrollTop = this.messages.scrollHeight;

      // Auto remove error after 5 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.remove();
        }
      }, 5000);

      // Trigger error event
      this.onError(message);
    }

    // Public methods
    open() {
      if (!this.isOpen) this.toggleChat();
    }

    close() {
      if (this.isOpen) this.toggleChat();
    }

    clearHistory() {
      this.messageHistory = [];
      this.messages.innerHTML = `
                <div class="chatbot-message bot">
                    ${this.options.welcomeMessage}
                </div>
            `;
    }

    getHistory() {
      return this.messageHistory;
    }

    updateOptions(newOptions) {
      this.options = { ...this.options, ...newOptions };
      this.applyCustomizations();
    }

    destroy() {
      if (this.widget) {
        this.widget.remove();
      }
      const styles = document.getElementById("chatbot-widget-styles");
      if (styles) {
        styles.remove();
      }
    }

    // Event callbacks (can be overridden)
    onOpen() {
      console.log("Chatbot opened");
    }

    onClose() {
      console.log("Chatbot closed");
    }

    onMessage(text, type) {
      console.log("Message:", { text, type });
    }

    onError(error) {
      console.log("Chatbot error:", error);
    }
  }

  // Global API
  window.ChatbotWidget = {
    instances: [],

    init: function (options = {}) {
      const widget = new ChatbotWidget(options);
      this.instances.push(widget);
      return widget;
    },

    destroyAll: function () {
      this.instances.forEach((widget) => widget.destroy());
      this.instances = [];
    },
  };

  // Auto-initialize if configuration exists
  if (window.chatbotConfig) {
    window.ChatbotWidget.init(window.chatbotConfig);
  }
})();
