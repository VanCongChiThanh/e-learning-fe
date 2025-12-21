(() => {
  // CSS Styles
  const CSS_STYLES = `
        /* Widget Container */
        .chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        }

        /* Toggle Button */
        .chatbot-toggle {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.35);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .chatbot-toggle::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .chatbot-toggle:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.45);
        }

        .chatbot-toggle:hover::before {
            opacity: 0.2;
        }

        .chatbot-toggle:active {
            transform: translateY(0) scale(1);
        }

        .chatbot-toggle svg {
            width: 28px;
            height: 28px;
            fill: white;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 1;
        }

        .chatbot-toggle.active svg {
            transform: rotate(45deg);
        }

        /* Chat Container */
        .chatbot-container {
            position: absolute;
            bottom: 84px;
            right: 0;
            width: 380px;
            height: 580px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.05);
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
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
            padding: 24px 24px 20px;
            text-align: center;
            font-weight: 600;
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
        }

        .chatbot-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
            pointer-events: none;
        }

        .chatbot-header-content {
            position: relative;
            z-index: 1;
        }

        .chatbot-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 6px;
            letter-spacing: -0.3px;
        }

        .chatbot-subtitle {
            font-size: 13px;
            opacity: 0.95;
            font-weight: 400;
        }

        /* Messages Container */
        .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: #fafbfc;
        }

        .chatbot-messages::-webkit-scrollbar {
            width: 8px;
        }

        .chatbot-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .chatbot-messages::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 4px;
            border: 2px solid #fafbfc;
        }

        .chatbot-messages::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
        }

        /* Message Bubbles */
        .chatbot-message {
            max-width: 85%;
            padding: 14px 18px;
            border-radius: 18px;
            font-size: 14.5px;
            line-height: 1.5;
            animation: chatbotFadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .chatbot-message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 6px;
            box-shadow: 0 2px 12px rgba(102, 126, 234, 0.25);
        }

        .chatbot-message.bot {
            align-self: flex-start;
            background: white;
            color: #2d3748;
            border: 1px solid #e2e8f0;
            border-bottom-left-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .chatbot-message.typing {
            align-self: flex-start;
            background: white;
            color: #718096;
            border: 1px solid #e2e8f0;
            border-bottom-left-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        /* Markdown Styles */
        .chatbot-message p {
            margin: 0 0 8px 0;
        }

        .chatbot-message p:last-child {
            margin-bottom: 0;
        }

        .chatbot-message strong {
            font-weight: 700;
        }

        .chatbot-message em {
            font-style: italic;
        }

        .chatbot-message code {
            background: rgba(0, 0, 0, 0.08);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
        }

        .chatbot-message.user code {
            background: rgba(255, 255, 255, 0.25);
        }

        .chatbot-message pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 12px 14px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
            font-size: 13px;
            line-height: 1.6;
        }

        .chatbot-message pre code {
            background: transparent;
            padding: 0;
            color: inherit;
        }

        .chatbot-message ul, .chatbot-message ol {
            margin: 8px 0;
            padding-left: 24px;
        }

        .chatbot-message li {
            margin: 2px 0; // Reduced margin from 4px to 2px for tighter list spacing
        }

        .chatbot-message a {
            color: #667eea;
            text-decoration: underline;
            transition: opacity 0.2s;
        }

        .chatbot-message.user a {
            color: white;
            text-decoration: underline;
        }

        .chatbot-message a:hover {
            opacity: 0.8;
        }

        .chatbot-message blockquote {
            border-left: 3px solid #cbd5e0;
            padding-left: 12px;
            margin: 8px 0;
            font-style: italic;
            color: #4a5568;
        }

        .chatbot-message.user blockquote {
            border-left-color: rgba(255, 255, 255, 0.5);
            color: rgba(255, 255, 255, 0.9);
        }

        .chatbot-message h1, .chatbot-message h2, .chatbot-message h3 {
            margin: 12px 0 8px 0;
            font-weight: 700;
            line-height: 1.3;
        }

        .chatbot-message h1 { font-size: 18px; }
        .chatbot-message h2 { font-size: 16px; }
        .chatbot-message h3 { font-size: 14.5px; }

        /* Typing Animation */
        .chatbot-typing-dots {
            display: inline-block;
            margin-left: 4px;
        }

        .chatbot-typing-dots span {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #718096;
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
                transform: translateY(12px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Input Container */
        .chatbot-input-container {
            padding: 20px 20px 22px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 12px;
            background: white;
            flex-shrink: 0;
        }

        .chatbot-input {
            flex: 1;
            padding: 13px 18px;
            border: 2px solid #e2e8f0;
            border-radius: 24px;
            outline: none;
            font-size: 14px;
            transition: all 0.2s ease;
            background: #fafbfc;
            color: #2d3748;
        }

        .chatbot-input:focus {
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .chatbot-input::placeholder {
            color: #a0aec0;
        }

        .chatbot-send {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .chatbot-send:hover:not(:disabled) {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .chatbot-send:active:not(:disabled) {
            transform: scale(0.98);
        }

        .chatbot-send:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
            .chatbot-container {
                width: calc(100vw - 20px);
                height: calc(100vh - 140px);
                max-width: 400px;
                right: 10px;
                bottom: 74px;
            }
            
            .chatbot-widget {
                right: 10px;
                bottom: 10px;
            }

            .chatbot-messages {
                padding: 16px;
            }

            .chatbot-message {
                max-width: 90%;
            }
        }

        /* Error Message */
        .chatbot-error-message {
            background: #fff5f5;
            color: #c53030;
            border: 1px solid #feb2b2;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13px;
            text-align: center;
            margin: 0;
            animation: chatbotFadeInUp 0.3s ease;
            box-shadow: 0 2px 8px rgba(197, 48, 48, 0.1);
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
            background: #1a202c;
            color: white;
        }

        .chatbot-widget.theme-dark .chatbot-messages {
            background: #1a202c;
        }

        .chatbot-widget.theme-dark .chatbot-message.bot {
            background: #2d3748;
            color: #e2e8f0;
            border-color: #4a5568;
        }

        .chatbot-widget.theme-dark .chatbot-input-container {
            background: #1a202c;
            border-top-color: #4a5568;
        }

        .chatbot-widget.theme-dark .chatbot-input {
            background: #2d3748;
            border-color: #4a5568;
            color: white;
        }

        .chatbot-widget.theme-dark .chatbot-input:focus {
            background: #374151;
            border-color: #667eea;
        }

        .chatbot-widget.theme-dark .chatbot-input::placeholder {
            color: #718096;
        }

        .chatbot-widget.theme-dark .chatbot-messages::-webkit-scrollbar-thumb {
            background: #4a5568;
            border-color: #1a202c;
        }

        .chatbot-widget.theme-dark .chatbot-message code {
            background: rgba(255, 255, 255, 0.1);
        }
    `;

  // HTML Template
  const HTML_TEMPLATE = `
        <div class="chatbot-widget" id="chatbotWidget">
            <!-- Toggle Button -->
            <button class="chatbot-toggle" id="chatbotToggle" aria-label="Toggle chatbot">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
            </button>

            <!-- Chat Container -->
            <div class="chatbot-container" id="chatbotContainer">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-title" id="chatbotTitle">💬 Trợ lý AI</div>
                        <div class="chatbot-subtitle" id="chatbotSubtitle">
                            Xin chào! Tôi có thể giúp gì cho bạn?
                        </div>
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
                        aria-label="Message input"
                    >
                    <button class="chatbot-send" id="chatbotSend" aria-label="Send message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

  // Simple Markdown Parser
  class MarkdownParser {
    static parse(text) {
      if (!text) return "";

      // Escape HTML
      text = text.replace(/[<>]/g, (match) => {
        return match === "<" ? "&lt;" : "&gt;";
      });

      // Code blocks (\`\`\`code\`\`\`)
      text = text.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        "<pre><code>$2</code></pre>"
      );

      // Inline code (`code`)
      text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

      // Bold (**text** or __text__)
      text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");

      // Italic (*text* or _text_)
      text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      text = text.replace(/_([^_]+)_/g, "<em>$1</em>");

      // Links [text](url)
      text = text.replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      );

      // Headings
      text = text.replace(/^### (.+)$/gm, "<h3>$1</h3>");
      text = text.replace(/^## (.+)$/gm, "<h2>$1</h2>");
      text = text.replace(/^# (.+)$/gm, "<h1>$1</h1>");

      // Blockquotes
      text = text.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

      // Unordered lists
      text = text.replace(/^\* (.+)$/gm, "<li>$1</li>");
      text = text.replace(/^- (.+)$/gm, "<li>$1</li>");
      text = text.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

      // Ordered lists
      text = text.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

      text = text.replace(/\n\n/g, "</p><p>");
      // Only add <br> for line breaks that are not after HTML tags
      text = text.replace(/([^>])\n/g, "$1<br>");

      // Wrap in paragraph if not already wrapped
      if (!text.startsWith("<")) {
        text = "<p>" + text + "</p>";
      }

      return text;
    }
  }

  // Main ChatbotWidget Class
  class ChatbotWidget {
    constructor(options = {}) {
      this.options = {
        apiUrl: options.apiUrl || "http://localhost:8000",
        position: options.position || "right",
        theme: options.theme || "light",
        title: options.title || "💬 Trợ lý AI",
        subtitle: options.subtitle || "Xin chào! Tôi có thể giúp gì cho bạn?",
        placeholder: options.placeholder || "Nhập câu hỏi của bạn...",
        welcomeMessage:
          options.welcomeMessage ||
          "Xin chào! Tôi là trợ lý AI. Bạn có câu hỏi gì muốn hỏi không?",
        primaryColor: options.primaryColor || "#667eea",
        secondaryColor: options.secondaryColor || "#764ba2",
        enableMarkdown: options.enableMarkdown !== false, // Default true
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
      const existing = document.getElementById("chatbotWidget");
      if (existing) existing.remove();

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

      document.addEventListener("click", (e) => {
        if (this.isOpen && !this.widget.contains(e.target)) {
          this.toggleChat();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.toggleChat();
        }
      });
    }

    applyCustomizations() {
      if (this.options.position === "left") {
        this.widget.classList.add("position-left");
      }

      if (this.options.theme === "dark") {
        this.widget.classList.add("theme-dark");
      }

      if (this.title) this.title.textContent = this.options.title;
      if (this.subtitle) this.subtitle.textContent = this.options.subtitle;
      if (this.input) this.input.placeholder = this.options.placeholder;

      const firstMessage = this.messages.querySelector(".chatbot-message.bot");
      if (firstMessage) {
        if (this.options.enableMarkdown) {
          firstMessage.innerHTML = MarkdownParser.parse(
            this.options.welcomeMessage
          );
        } else {
          firstMessage.textContent = this.options.welcomeMessage;
        }
      }

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
                .chatbot-message a {
                    color: ${primary};
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

      if (this.isOpen) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }

    async sendMessage() {
      const query = this.input.value.trim();
      if (!query || this.isLoading) return;

      this.messageHistory.push({
        type: "user",
        text: query,
        timestamp: new Date(),
      });

      this.addMessage(query, "user");
      this.input.value = "";

      this.showTyping();

      try {
        const response = await this.callAPI(query);

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

      if (type === "bot" && this.options.enableMarkdown) {
        messageDiv.innerHTML = MarkdownParser.parse(text);
      } else {
        messageDiv.textContent = text;
      }

      this.messages.appendChild(messageDiv);
      this.messages.scrollTop = this.messages.scrollHeight;

      this.onMessage(text, type);
    }

    showTyping() {
      this.isLoading = true;
      this.sendBtn.disabled = true;

      const typingDiv = document.createElement("div");
      typingDiv.className = "chatbot-message typing";
      typingDiv.id = "chatbotTypingIndicator";
      typingDiv.innerHTML = `
                Đang trả lời<span class="chatbot-typing-dots">
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
      errorDiv.textContent = `❌ Lỗi: ${message}`;

      this.messages.appendChild(errorDiv);
      this.messages.scrollTop = this.messages.scrollHeight;

      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.remove();
        }
      }, 5000);

      this.onError(message);
    }

    // Public API methods
    open() {
      if (!this.isOpen) this.toggleChat();
    }

    close() {
      if (this.isOpen) this.toggleChat();
    }

    clearHistory() {
      this.messageHistory = [];
      const welcomeMsg = this.options.enableMarkdown
        ? MarkdownParser.parse(this.options.welcomeMessage)
        : this.options.welcomeMessage;

      this.messages.innerHTML = `
                <div class="chatbot-message bot">
                    ${welcomeMsg}
                </div>
            `;
    }

    sendCustomMessage(text, type = "bot") {
      this.addMessage(text, type);
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

    // Event callbacks
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

  // Auto-initialize
  if (window.chatbotConfig) {
    window.ChatbotWidget.init(window.chatbotConfig);
  }
})();
