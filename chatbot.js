/**
 * Aashirwad Enterprise — Gemini AI Chatbot
 * Contextual chatbot pre-loaded with full business knowledge
 */

import './chatbot.css';

// =============================================
// BUSINESS KNOWLEDGE BASE (sent to Gemini as system context)
// =============================================
const BUSINESS_CONTEXT = `
You are the official AI assistant for **Aashirwad Enterprise India**, a premier plastic raw materials trading company based in Ahmedabad, Gujarat.

## COMPANY OVERVIEW
- **Name**: Aashirwad Enterprise India
- **Industry**: Plastic Raw Materials Trading & Distribution
- **Location**: A 804, Dharti Saket Height, Opp. Sukan Glory, Ahmedabad - 382481, Gujarat, India
- **Phone**: +91 7863048385
- **GSTIN/UIN**: 24CCLPP0098L1Z4
- **State**: Gujarat, Code: 24
- **Tagline**: "Your Trusted Partner for Reliability, Quality, and On-time Delivery"

## KEY STATISTICS
- 10,000+ Tons Supplied Annually
- 250+ Manufacturing Partners
- 100% Quality Assurance

## BUSINESS DIVISIONS

### 1. Bulk Polymer Trading Wing (Flagship Division)
Handles massive-scale procurement and distribution of commodity thermoplastics. Bridges the gap between volatile international petrochemical markets and domestic manufacturers.
- **Strategic Procurement**: High-volume purchasing from Reliance, Opal, ONGC, and global suppliers
- **Market Hedging**: Deep market intelligence to advise clients on procurement timing
- **Just-In-Time (JIT) Delivery**: Warehouse infrastructure optimized for JIT frameworks
- **Grade Selection Consulting**: Matching specific Melt Flow Indices (MFI) and tensile properties

### 2. Specialty Chemicals & Additives Division
Supplies critical additives that transform raw resins into specialized, high-value materials.
- **Plasticizers & Stabilizers**: For PVC compounding (cables/hoses)
- **UV Protectors & Antioxidants**: For outdoor applications (agricultural films, water tanks)
- **Color Masterbatches**: High-dispersion pigment concentrates for uniform coloration

### 3. Logistics & Supply Chain Infrastructure
Operates from Gujarat's industrial heartland, ensuring "On-Time Delivery" with proprietary fleet.
- **Mass Storage Facilities**: Tens of thousands of sq ft in Ahmedabad, moisture-controlled
- **Integrated Fleet Operations**: Dedicated freight channels, 25kg bags, jumbo bags, bulk loose material
- **Real-Time Tracking**: Modern ERP systems for dispatch transparency

## PRODUCTS CATALOG

### Polyvinyl Chloride (PVC)
- K-67 / K-65: Rigid pipes, conduits, heavy-duty profiles
- K-57 / K-58: High flow resins for complex injection-molded fittings
- Emulsion Paste Grades: Artificial leather, flooring, rotational molding

### HDPE & LDPE (High & Low-Density Polyethylene)
- HDPE Blow Molding: Rigid containers, jerry cans, drums
- HDPE Injection Molding: Crates, pallets, household wares
- LDPE Film Grades: Shrink wraps, heavy-duty sacks, agricultural films

### Polypropylene (PP)
- Raffia Grade: Woven fabrics, cement bags, ropes
- Injection Grade: Thin-wall packaging, consumer appliances
- Copolymer Grades: Battery cases, automotive bumpers

### Specialty Chemicals & Additives
- Plasticizers & Impact Modifiers
- UV Stabilizers & Antioxidants
- Custom Masterbatches (Calcium/Talc filler compounds)

## CORE VALUES
- **Integrity**: Transparent pricing, honest lead times, clear material origins
- **Reliability**: Guaranteed delivery schedules, logistical redundancies
- **Innovation**: Constantly upgrading portfolio with new efficient chemical additives

## THE AASHIRWAD ADVANTAGE
- Zero-Defect Quality Policy (prime, virgin materials)
- Financial Resilience (massive inventories to shield from price spikes)
- Client-Centric Logistics (customized packaging: 25kg bags to bulk tanker deliveries)
- Global Sourcing (direct ties with top international petrochemical refineries)
- Technical Expertise (material consulting to optimize production)
- Strategic Warehousing (massive storage capacities ensuring zero downtime)

## INSTRUCTIONS FOR RESPONDING
1. Be friendly, professional, and knowledgeable.
2. Always answer in the context of Aashirwad Enterprise India's business.
3. If asked about pricing, say "For exact pricing, please call us at +91 7863048385 or visit our Contact page."
4. If asked something outside the business scope, politely redirect to business-related topics.
5. Keep responses concise but informative (2-4 sentences typically).
6. Use the company name "Aashirwad Enterprise" when referring to the company.
7. For technical product queries, provide specific grade details from the catalog above.
8. If asked for a quote or specific order, direct them to call +91 7863048385 or visit the Contact page.
9. You can respond in Hindi or English based on the user's language preference.
10. When mentioning the phone number, always write it as +91 7863048385 so users can tap to call.
`;

// =============================================
// CONFIGURATION
// =============================================
const GEMINI_API_KEY = 'AIzaSyB1zKRQf1Nt1FHN1ZCkfbg2Tj4M_9EJaPw';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// =============================================
// CHATBOT CLASS
// =============================================
class AashirwadChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.apiKey = GEMINI_API_KEY;
    this.isLoading = false;
    this.conversationHistory = [];

    this.init();
  }

  init() {
    this.createDOM();
    this.bindEvents();
    this.addBotMessage("Welcome to Aashirwad Enterprise! 👋\n\nI'm your AI assistant. Ask me anything about our plastic raw materials, products, services, or business operations.\n\nHow can I help you today?");
  }

  // ---- DOM Creation ----
  createDOM() {
    // Toggle Button
    const toggle = document.createElement('button');
    toggle.id = 'chatbot-toggle';
    toggle.setAttribute('aria-label', 'Open chat assistant');
    toggle.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    `;
    document.body.appendChild(toggle);
    this.toggleBtn = toggle;

    // "Ask Assistance" floating label
    const label = document.createElement('div');
    label.id = 'chatbot-label';
    label.textContent = 'Ask Assistance';
    document.body.appendChild(label);
    this.labelEl = label;

    // Chat Window
    const window = document.createElement('div');
    window.id = 'chatbot-window';
    window.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-avatar">
          <img src="/logo.jpeg" alt="Aashirwad Assistant" />
        </div>
        <div class="chatbot-header-info">
          <h3>Aashirwad Assistant</h3>
          <p><span class="chatbot-status-dot"></span>Online · Powered by Gemini</p>
        </div>
      </div>
      <div class="chatbot-messages" id="chatbot-messages"></div>
      <div class="chatbot-chips" id="chatbot-chips">
        <button class="chatbot-chip" data-question="What products do you sell?">🧪 Products</button>
        <button class="chatbot-chip" data-question="Tell me about your company">🏢 About Us</button>
        <a href="tel:+917863048385" class="chatbot-chip chatbot-call-cta">📞 Call Now</a>
        <button class="chatbot-chip" data-question="What are your business divisions?">📊 Divisions</button>
      </div>
      <div class="chatbot-input-area">
        <input type="text" id="chatbot-input" placeholder="Ask about our products, services..." autocomplete="off" />
        <button class="chatbot-send-btn" id="chatbot-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <div class="chatbot-footer">Powered by <span>Gemini AI</span> · Aashirwad Enterprise</div>
    `;
    document.body.appendChild(window);
    this.chatWindow = window;
    this.messagesContainer = window.querySelector('#chatbot-messages');
    this.input = window.querySelector('#chatbot-input');
    this.sendBtn = window.querySelector('#chatbot-send');

  }

  // ---- Event Binding ----
  bindEvents() {
    this.toggleBtn.addEventListener('click', () => this.toggle());

    this.sendBtn.addEventListener('click', () => this.handleSend());

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    // Quick action chips
    this.chatWindow.querySelectorAll('.chatbot-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const question = chip.getAttribute('data-question');
        this.input.value = question;
        this.handleSend();
      });
    });
  }

  // ---- Toggle ----
  toggle() {
    this.isOpen = !this.isOpen;
    this.chatWindow.classList.toggle('open', this.isOpen);
    this.toggleBtn.classList.toggle('active', this.isOpen);
    this.labelEl.classList.toggle('hidden', this.isOpen);

    if (this.isOpen) {
      this.toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      `;
      setTimeout(() => this.input.focus(), 350);
    } else {
      this.toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      `;
    }
  }

  // ---- API Key Prompt ----
  promptForApiKey() {
    setTimeout(() => {
      this.addBotMessage("⚙️ **Setup Required**\n\nTo enable AI responses, please enter your Gemini API key. You can get one free from [Google AI Studio](https://aistudio.google.com/apikey).\n\nType your API key below to get started:");
      this.input.placeholder = 'Paste your Gemini API key here...';
      this.isWaitingForKey = true;
    }, 800);
  }

  // ---- Message Handling ----
  async handleSend() {
    const text = this.input.value.trim();
    if (!text || this.isLoading) return;

    // Add user message
    this.addUserMessage(text);
    this.input.value = '';

    // Show typing indicator
    this.showTyping();

    try {
      const response = await this.callGeminiAPI(text);
      this.hideTyping();
      this.addBotMessage(response);
    } catch (error) {
      this.hideTyping();
      console.error('Gemini API Error:', error);

      this.addBotMessage("I apologize, but I'm experiencing a temporary issue. Please try again in a moment, or contact us directly at **+91 7863048385**.");
    }
  }

  // ---- Gemini API Call with Retry ----
  async callGeminiAPI(userMessage, retryCount = 0) {
    const MAX_RETRIES = 3;

    // Only add to history on first attempt
    if (retryCount === 0) {
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
    }

    // Keep only last 10 turns to stay within token limits
    const recentHistory = this.conversationHistory.slice(-10);

    const requestBody = {
      system_instruction: {
        parts: [{ text: BUSINESS_CONTEXT }]
      },
      contents: recentHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Handle rate limiting with automatic retry
    if (response.status === 429 && retryCount < MAX_RETRIES) {
      const waitTime = Math.pow(2, retryCount + 1) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.callGeminiAPI(userMessage, retryCount + 1);
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again.";

    // Add to conversation history
    this.conversationHistory.push({
      role: 'model',
      parts: [{ text: botReply }]
    });

    return botReply;
  }

  // ---- UI Methods ----
  addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chatbot-msg user';
    msg.textContent = text;
    this.messagesContainer.appendChild(msg);
    this.scrollToBottom();
  }

  addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chatbot-msg bot';
    msg.innerHTML = this.formatMessage(text);
    this.messagesContainer.appendChild(msg);
    this.scrollToBottom();
  }

  formatMessage(text) {
    // Convert markdown-like formatting to HTML
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Phone numbers → clickable tel: links with call CTA
      .replace(/(\+91[\s-]?\d{10})/g, '<a href="tel:$1" class="chatbot-phone-link">📞 $1</a>')
      // Bullet points
      .replace(/^[-•]\s+(.+)/gm, '<li>$1</li>')
      // Wrap consecutive <li>s in <ul>
      .replace(/((<li>.*?<\/li>\s*)+)/g, '<ul>$1</ul>')
      // Numbered lists
      .replace(/^\d+\.\s+(.+)/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n/g, '<br>');
  }

  showTyping() {
    this.isLoading = true;
    this.sendBtn.disabled = true;
    const typing = document.createElement('div');
    typing.className = 'chatbot-typing';
    typing.id = 'chatbot-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    this.messagesContainer.appendChild(typing);
    this.scrollToBottom();
  }

  hideTyping() {
    this.isLoading = false;
    this.sendBtn.disabled = false;
    const typing = document.getElementById('chatbot-typing');
    if (typing) typing.remove();
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    });
  }
}

// =============================================
// INITIALIZE
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  new AashirwadChatbot();
});
