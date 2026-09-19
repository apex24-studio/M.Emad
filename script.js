
// --- Preloader Logic ---
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.progress');
    if (!preloader) return;
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 800);
            }, 500);
        } else {
            width += Math.random() * 20;
            if (width > 100) width = 100;
            if (progress) progress.style.width = width + '%';
        }
    }, 100);
}

if (document.readyState === 'complete') {
    hidePreloader();
} else {
    window.addEventListener('load', hidePreloader);
}

// --- Hamburger / Mobile Menu ---
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
            mobileNav.classList.remove('open');
            menuToggle.classList.remove('open');
            setTimeout(() => { mobileNav.style.display = 'none'; }, 400);
            document.body.style.overflow = '';
        } else {
            mobileNav.style.display = 'flex';
            requestAnimationFrame(() => mobileNav.classList.add('open'));
            menuToggle.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuToggle.classList.remove('open');
            setTimeout(() => { mobileNav.style.display = 'none'; }, 400);
            document.body.style.overflow = '';
        });
    });
}

// --- Advanced Magnetic Cursor (desktop only) ---
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

if (cursor && cursorBlur) {
    if (isTouchDevice) {
        // Hide cursor completely on touch/mobile devices
        cursor.style.display = 'none';
        cursorBlur.style.display = 'none';
    } else {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate cursor
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth blur follower
        function animateCursor() {
            let dx = mouseX - cursorX;
            let dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursorBlur.style.left = cursorX + 'px';
            cursorBlur.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }
}

// --- Magnetic Elements (desktop only) ---
if (!isTouchDevice) {
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(4)';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
            if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // --- Interaction Hover Effects (Dennis Snellenberg Cursor Hover) ---
    const hoverables = document.querySelectorAll('a, button, .work-card, .nav-pill-link, .pill-btn, .niche-chip, .location-pill-badge, .editorial-chip, .filter-btn, .social-inset-pill, .smi-link');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!cursor) return;
            cursor.style.width = '44px';
            cursor.style.height = '44px';
            cursor.style.background = 'rgba(255, 255, 255, 0.12)';
            cursor.style.backdropFilter = 'blur(4px)';
            cursor.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        });
        item.addEventListener('mouseleave', () => {
            if (!cursor) return;
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursor.style.background = 'white';
            cursor.style.backdropFilter = 'none';
            cursor.style.border = 'none';
        });
    });
}

// --- Scroll Text Reveal Animation ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Select elements to reveal
const revealElements = document.querySelectorAll('.hero-title .line, .hero-title .line-gradient, .hero-subtitle, .hero-actions, .work-card, .contact-card');
revealElements.forEach(el => {
    el.classList.add('reveal-init');
    revealObserver.observe(el);
});

// Add temporary CSS for reveal
const style = document.createElement('style');
style.textContent = `
    .reveal-init {
        opacity: 0;
        transform: translateY(40px);
        transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .is-visible {
        opacity: 1;
        transform: translateY(0);
    }
    .hero-title .line:nth-child(2) { transition-delay: 0.2s; }
    .hero-title .line:nth-child(3) { transition-delay: 0.4s; }
`;
document.head.appendChild(style);

// --- Ticker Clone for infinite effect ---
const ticker = document.querySelector('.ticker');
if (ticker) {
    const clone = ticker.cloneNode(true);
    ticker.parentElement.appendChild(clone);
}

// --- Lightbox / Video Modal ---
const workCards = document.querySelectorAll('.work-card');
const lightbox = document.getElementById('lightbox');
const videoFrame = document.getElementById('video-frame');
const closeLightbox = document.querySelector('.close-lightbox');

workCards.forEach(card => {
    card.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        videoFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
    videoFrame.innerHTML = '';
});

window.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        videoFrame.innerHTML = '';
    }
});

// --- Work Category Filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const workCardsAll = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        workCardsAll.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    });
});

// --- Dynamic Firebase Fetch ---
async function fetchPortfolioVideos() {
    const grid = document.getElementById('dynamic-work-grid');
    if (!grid) return;
    
    try {
        const querySnapshot = await db.collection("videos").get();
        if (!querySnapshot.empty) {
            // مسح العناصر الثابتة إذا وجدت بيانات في القاعدة
            grid.innerHTML = '';
            
            // قاموس لترجمة التصنيفات
            const categoriesMap = {
                'restaurants': 'مطاعم',
                'clinics': 'عيادات طبية',
                'cafes': 'كافيهات',
                'other': 'أخرى'
            };

            let isFirst = true;
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data() || {};
                const title = data.title || 'مشروع جديد';
                const category = data.category || 'other';
                const url = data.url || '#';
                const platform = data.platform || 'other';
                const thumbnailUrl = data.thumbnailUrl || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200';

                const card = document.createElement('div');
                card.className = `work-card ${isFirst ? 'large' : ''} reveal-init is-visible`;
                card.setAttribute('data-category', category);
                
                card.innerHTML = `
                    <div class="card-inner">
                        <img src="${thumbnailUrl}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200'">
                        <div class="card-overlay">
                            <div class="card-meta">
                                <span class="category">${categoriesMap[category] || category}</span>
                                <h4 class="project-title">${title}</h4>
                            </div>
                            <div class="view-btn">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add Lightbox Event (YouTube) or Open Link (other platforms)
                card.addEventListener('click', () => {
                    if (platform === 'youtube' && data.videoId) {
                        lightbox.style.display = 'flex';
                        videoFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${data.videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
                    } else if (url && url !== '#') {
                        window.open(url, '_blank');
                    }
                });
                
                grid.appendChild(card);
                isFirst = false;
            });
            
            // Re-bind filter events to new cards
            const newCards = document.querySelectorAll('.work-card');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filterValue = btn.getAttribute('data-filter');
                    newCards.forEach(c => {
                        if (filterValue === 'all' || c.getAttribute('data-category') === filterValue) {
                            c.classList.remove('hide');
                        } else {
                            c.classList.add('hide');
                        }
                    });
                });
            });
            
            // Re-bind Hover Effects for new cards (desktop only)
            if (!isTouchDevice && cursor) {
                newCards.forEach(item => {
                    item.addEventListener('mouseenter', () => {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.background = 'rgba(255,255,255,0.1)';
                        cursor.style.backdropFilter = 'blur(2px)';
                        cursor.style.border = '1px solid white';
                    });
                    item.addEventListener('mouseleave', () => {
                        cursor.style.width = '10px';
                        cursor.style.height = '10px';
                        cursor.style.background = 'white';
                        cursor.style.backdropFilter = 'none';
                        cursor.style.border = 'none';
                    });
                });
            }
        }
    } catch(e) {
        console.log("استخدام الفيديوهات الثابتة لعدم وجود إعدادات Firebase بعد.");
    }
}

fetchPortfolioVideos();

// --- Social Contact Modal (زر "ابدأ الآن") ---
const startNowBtn = document.getElementById('start-now-btn');
const socialModal = document.getElementById('social-modal');
const socialModalClose = document.getElementById('social-modal-close');

function openSocialModal() {
    socialModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSocialModal() {
    socialModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (startNowBtn && socialModal) {
    startNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSocialModal();
    });
}

if (socialModalClose) {
    socialModalClose.addEventListener('click', closeSocialModal);
}

if (socialModal) {
    // إغلاق عند الضغط على الخلفية
    socialModal.addEventListener('click', (e) => {
        if (e.target === socialModal) {
            closeSocialModal();
        }
    });
}

// إغلاق بزر Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && socialModal && socialModal.classList.contains('active')) {
        closeSocialModal();
    }
});



// ==========================================================================
// FUTURISTIC AI 2026 INTERACTIVE MODULES (SCRIPT GENERATOR, SIMULATOR, CALCULATOR & COPILOT)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- FLOATING EDITORIAL ASSISTANT BOT WIDGET ---
    const aiBotToggleBtn = document.getElementById('ai-bot-toggle-btn');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const aiChatClose = document.getElementById('ai-chat-close');
    const chatUserInput = document.getElementById('chat-user-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessagesContainer = document.getElementById('chat-messages-container');
    const quickPrompts = document.querySelectorAll('.quick-prompt-btn');

    if (aiBotToggleBtn && aiChatWindow) {
        aiBotToggleBtn.addEventListener('click', () => {
            const isHidden = aiChatWindow.style.display === 'none' || !aiChatWindow.style.display;
            aiChatWindow.style.display = isHidden ? 'flex' : 'none';
        });
    }

    if (aiChatClose && aiChatWindow) {
        aiChatClose.addEventListener('click', () => {
            aiChatWindow.style.display = 'none';
        });
    }

    function appendMessage(sender, text) {
        if (!chatMessagesContainer) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
        chatMessagesContainer.appendChild(msgDiv);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function getBotResponse(userMsg) {
        const msg = userMsg.toLowerCase();

        if (msg.includes('سعر') || msg.includes('تكلفة') || msg.includes('أسعار') || msg.includes('بكام')) {
            return "تبدأ باقات وأسعار المونتاج السينمائي من **$15 للفيديو** (Reel/Short 30s) مع باقات خاصة للمحتوى الشهري والشركات! تواصل مع محمد عماد مباشرة لتحديد عرض مخصص لمشروعك 📊";
        }
        if (msg.includes('خطوات') || msg.includes('كيف') || msg.includes('بدء') || msg.includes('تواصل')) {
            return "خطوات بدء العمل بسيطة جداً: \n1️⃣ إرسال اللقطات المصورة وتفاصيل الفكرة عبر الواتساب.\n2️⃣ الاتفاق على الهوية والإيقاع الموسيقي والمؤثرات.\n3️⃣ البدء فوراً في المونتاج والتسليم خلال 24-48 ساعة! 🚀";
        }
        if (msg.includes('برامج') || msg.includes('تقنيات') || msg.includes('خبرة') || msg.includes('مونتاج')) {
            return "يعتمد محمد عماد على أقوى برامج المونتاج الاحترافي: **CapCut Pro**, **Adobe Premiere Pro**, **After Effects**, و **DaVinci Resolve** لتنفيذ مونتاج سينمائي عالي الجودة بلمسة بشرية احترافية! 💻✨";
        }

        return "شكراً لتواصلك! 😊 يمكنك زيارة قسم **معرض الأعمال** لرؤية نماذج الفيديوهات السابقة أو التواصل مباشرة مع محمد عماد عبر الواتساب لبدء مشروعك الآن: +201001376298 📱";
    }

    function handleUserSend() {
        if (!chatUserInput) return;
        const text = chatUserInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        chatUserInput.value = '';

        setTimeout(() => {
            const botReply = getBotResponse(text);
            appendMessage('bot', botReply);
        }, 500);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', handleUserSend);
    }

    if (chatUserInput) {
        chatUserInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserSend();
            }
        });
    }

    quickPrompts.forEach(btn => {
        btn.addEventListener('click', () => {
            const promptMsg = btn.getAttribute('data-msg');
            if (promptMsg) {
                appendMessage('user', promptMsg);
                setTimeout(() => {
                    const botReply = getBotResponse(promptMsg);
                    appendMessage('bot', botReply);
                }, 500);
            }
        });
    });

});


