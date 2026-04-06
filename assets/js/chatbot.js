/* ============================================
   CHATBOT.JS — AI-like Chat with Bubble UI
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
});

function initChatbot() {
  const toggle = document.querySelector('.chatbot-toggle');
  const window_ = document.querySelector('.chatbot-window');
  const input = document.querySelector('.chatbot-input input');
  const sendBtn = document.querySelector('.chatbot-input button');
  const messages = document.querySelector('.chatbot-messages');

  if (!toggle || !window_) return;

  // Toggle
  toggle.addEventListener('click', () => {
    const isOpen = window_.classList.contains('open');
    window_.classList.toggle('open');
    toggle.classList.toggle('active');

    if (!isOpen && messages.children.length <= 1) {
      addBotMessage('Halo! Selamat datang di Elmaz Hijab Modeling School ✨ Ada yang bisa saya bantu?');
      setTimeout(() => showQuickActions(), 600);
    }
  });

  // Send
  function send() {
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    showTyping();
    setTimeout(() => {
      removeTyping();
      const response = getResponse(text);
      addBotMessage(response);
    }, 1200);
  }

  if (sendBtn) sendBtn.addEventListener('click', send);
  if (input) input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });

  function addBotMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.innerHTML = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function addUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.id = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  function showQuickActions() {
    const actions = document.createElement('div');
    actions.className = 'chat-quick-actions';
    const options = ['Info Program', 'Cara Daftar', 'Harga', 'Jadwal'];
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-quick-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        addUserMessage(opt);
        actions.remove();
        showTyping();
        setTimeout(() => {
          removeTyping();
          addBotMessage(getResponse(opt));
        }, 1000);
      });
      actions.appendChild(btn);
    });
    messages.appendChild(actions);
    messages.scrollTop = messages.scrollHeight;
  }

  function getResponse(text) {
    const lower = text.toLowerCase();

    if (lower.includes('program') || lower.includes('kelas') || lower.includes('info')) {
      return 'Kami memiliki <strong>The Elmaz Program</strong> — program eksklusif yang mencakup Catwalk, Public Speaking, Personal Branding, Photoshoot Experience, dan Styling. Program ini dirancang untuk membangun kepercayaan diri dan elegansi Anda ✨';
    }

    if (lower.includes('daftar') || lower.includes('registrasi') || lower.includes('join')) {
      return 'Untuk mendaftar, Anda bisa:<br>1. Klik tombol <strong>"Join The Program"</strong> di halaman Program<br>2. Hubungi kami via WhatsApp<br>3. Datang langsung ke studio kami<br><br>Pendaftaran terbuka sepanjang tahun! 🌟';
    }

    if (lower.includes('harga') || lower.includes('biaya') || lower.includes('bayar') || lower.includes('price')) {
      return 'Investasi untuk <strong>The Elmaz Program</strong>:<br><br>💎 Paket Regular: <strong>Rp 2.500.000</strong><br>💎 Paket Premium: <strong>Rp 4.500.000</strong> (termasuk photoshoot profesional)<br>💎 Paket VIP: <strong>Rp 7.500.000</strong> (termasuk portfolio & mentoring)<br><br>*Harga dapat berubah sewaktu-waktu';
    }

    if (lower.includes('jadwal') || lower.includes('waktu') || lower.includes('kapan')) {
      return 'Jadwal kelas kami:<br><br>📅 Batch baru dimulai setiap bulan<br>🕐 Sabtu & Minggu: 09:00 - 15:00 WIB<br>📍 Studio Elmaz, Jakarta<br><br>Hubungi kami untuk jadwal batch terdekat!';
    }

    if (lower.includes('lokasi') || lower.includes('alamat') || lower.includes('dimana')) {
      return 'Studio kami berlokasi di:<br><br>📍 <strong>Elmaz Hijab Modeling School</strong><br>Jl. Fashion Avenue No. 88<br>Jakarta Selatan<br><br>Kunjungi halaman <a href="/contact/" style="color: var(--color-accent);">Contact</a> untuk peta lokasi 🗺️';
    }

    if (lower.includes('hai') || lower.includes('halo') || lower.includes('hello') || lower.includes('hi')) {
      return 'Halo! 👋 Senang bertemu Anda! Ada yang ingin ditanyakan tentang Elmaz Hijab Modeling School?';
    }

    return 'Terima kasih atas pertanyaannya! Untuk informasi lebih lanjut, silakan hubungi kami via WhatsApp atau kunjungi halaman <a href="/program/" style="color: var(--color-accent);">Program</a> kami. Tim kami siap membantu Anda! 💫';
  }
}
