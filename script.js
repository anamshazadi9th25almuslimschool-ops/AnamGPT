/* ══════════════════════════════════════
   ChatBot AI — JavaScript
   File: script.js
   ══════════════════════════════════════ */

/* ── DOM REFERENCES ── */
const textarea  = document.getElementById('chatInput');
const msgEl     = document.getElementById('messages');

/* ── STATE ── */
let welcomeGone = false;

/* ── AI AVATAR SVG ── */
const aiSvg = `
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#a855f7"/>
        <stop offset="1" stop-color="#06b6d4"/>
      </linearGradient>
    </defs>
    <path
      d="M7 1.5C3.962 1.5 1.5 3.962 1.5 7s2.462 5.5 5.5 5.5S12.5 10.038 12.5 7
         10.038 1.5 7 1.5zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 8a3.75 3.75 0
         01-3-1.5c.015-.75 1.5-1.163 3-1.163s2.985.413 3 1.163A3.75 3.75 0 017 11.5z"
      fill="url(#g1)"
    />
  </svg>
`;

/* ── SAMPLE AI RESPONSES ── */
const responses = [
  "Bohat acha sawaal hai! Yeh concept samajhna zaroori hai. Main aap ko step by step guide karta hun...",
  "Zaroor! Yeh topic simple lagta hai lekin isme bohat kuch hai. Aao shuru karte hain...",
  "Bilkul! Is cheez ka jawab dekhte hain. Pehli bunyadi baat yeh hai ke...",
  "Excellent question! Main is baare mein poori tafseel se bata sakta hun..."
];

/* ── UTILITY: escape HTML ── */
function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ── SET INPUT FROM CHIP ── */
function setInput(text) {
  textarea.value = text;
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
  textarea.focus();
}

/* ── ADD MESSAGE TO CHAT ── */
function addMsg(html, role) {
  /* Remove welcome screen on first message */
  if (!welcomeGone) {
    document.getElementById('welcome-wrap')?.remove();
    welcomeGone = true;
  }

  const row = document.createElement('div');
  row.className = `msg-row ${role}`;

  if (role === 'user') {
    row.innerHTML = `
      <div class="bubble user">${html}</div>
      <div class="user-msg-av">A</div>
    `;
  } else {
    row.innerHTML = `
      <div class="ai-avatar">${aiSvg}</div>
      <div class="bubble ai">${html}</div>
    `;
  }

  msgEl.appendChild(row);
  msgEl.scrollTop = msgEl.scrollHeight;
}

/* ── SHOW TYPING INDICATOR ── */
function showTyping() {
  const row = document.createElement('div');
  row.id = 'typing';
  row.className = 'msg-row ai';
  row.innerHTML = `
    <div class="ai-avatar">${aiSvg}</div>
    <div class="typing-indicator">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  msgEl.appendChild(row);
  msgEl.scrollTop = msgEl.scrollHeight;
}

/* ── REMOVE TYPING INDICATOR ── */
function removeTyping() {
  document.getElementById('typing')?.remove();
}

/* ── SEND MESSAGE ── */
function send() {
  const text = textarea.value.trim();
  if (!text) return;

  /* Clear input */
  textarea.value = '';
  textarea.style.height = 'auto';

  /* Add user message */
  addMsg(esc(text), 'user');

  /* Show typing dots */
  showTyping();

  /* Simulate AI response after short delay */
  const delay = 1300 + Math.random() * 700;
  setTimeout(() => {
    removeTyping();
    const r = responses[Math.floor(Math.random() * responses.length)];
    const preview = esc(text.substring(0, 40));
    addMsg(
      `${r}<br><br>
       <span style="color:var(--text2);font-size:13px;font-style:italic;">
         "${preview}..." — aur detail chahiye to poochhein!
       </span>`,
      'ai'
    );
  }, delay);
}

/* ── SIDEBAR OPEN / CLOSE ── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── EVENT LISTENERS ── */

/* Send button click */
document.getElementById('sendBtn').addEventListener('click', send);

/* Enter key to send (Shift+Enter = new line) */
textarea.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

/* Auto-resize textarea */
textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 140) + 'px';
});

/* Menu toggle button */
document.getElementById('menuToggle').addEventListener('click', openSidebar);

/* Close sidebar when overlay is clicked */
document.getElementById('overlay').addEventListener('click', closeSidebar);

/* Close sidebar when a history item is tapped on mobile */
document.querySelectorAll('.history-item').forEach(function(el) {
  el.addEventListener('click', function() {
    if (window.innerWidth <= 700) {
      closeSidebar();
    }
  });
});
