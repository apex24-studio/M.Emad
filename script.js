
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

    // --- Interaction Hover Effects ---
    const hoverables = document.querySelectorAll('a, button, .work-card, .nav-item');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!cursor) return;
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.background = 'rgba(255,255,255,0.1)';
            cursor.style.backdropFilter = 'blur(2px)';
            cursor.style.border = '1px solid white';
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

    // --- 1. AI VIRAL SCRIPT & HOOK GENERATOR ---
    let selectedNiche = 'restaurants';

    const nicheChips = document.querySelectorAll('.niche-chip');
    nicheChips.forEach(chip => {
        chip.addEventListener('click', () => {
            nicheChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedNiche = chip.getAttribute('data-niche');
        });
    });

    const generateScriptBtn = document.getElementById('generate-script-btn');
    const scriptOutputContainer = document.getElementById('script-output-container');
    const scriptResultContent = document.getElementById('script-result-content');
    const copyScriptBtn = document.getElementById('copy-script-btn');
    const whatsappScriptBtn = document.getElementById('whatsapp-script-btn');

    const scriptTemplates = {
        restaurants: {
            viral: {
                hook: "🔥 'لو لسه ما جربتش الطعم ده.. يبقى فاوتك نص عمرك في الأكل!'",
                shots: [
                    "00:00 - 00:03 🎬 [افتتاحية خاطفة]: زوم سريع جداً (Speed Ramp) على الدخان المتصاعد مع صوت قرمشة عالي.",
                    "00:03 - 00:10 🎥 [استعراض الوجبة]: لقطة سينمائية بطيئة للمكونات وتناغم الألوان الذكي.",
                    "00:10 - 00:15 ⚡ [دعوة للتجربة]: كابشن عريض باللون الأصفر والأبيض 'اطلب الآن واكتشف السر!'"
                ],
                caption: "💬 'أول قرمشة هتغير مفهومك عن الأكل الفاخر! 🍔🔥 #مطاعم #أكل_سينمائي #ريلز'",
                prompt: "🤖 AI Prompt: Ultra-realistic cinematic food b-roll, mouth-watering lighting, slow-motion steam, 8k resolution."
            },
            cinematic: {
                hook: "🎬 'هنا لا نقدم مجرد طعام.. بل نسرد قصة عشق لكل تفصيلة.'",
                shots: [
                    "00:00 - 00:05 🎥 [لقطة سينمائية فاخرة]: إضاءة درامية خافتة مع حركة كاميرا سريعة ودقيقة.",
                    "00:05 - 00:15 🍷 [تفاصيل التقديم]: إبراز جودة المكونات واللمسات الفنية للشيف.",
                    "00:15 - 00:30 ✨ [الختام]: شعار المكان بخلفية سينمائية راقية."
                ],
                caption: "✨ 'تجربة استثنائية تأخذك إلى عالم آخر من الفخامة.'",
                prompt: "🤖 AI Prompt: Moody cinematic restaurant interior, anamorphic lens flare, professional color grade."
            }
        },
        clinics: {
            viral: {
                hook: "🩺 'الابتسامة اللي بتغير حياتك مش حلم.. دي أسهل مما تتخيل!'",
                shots: [
                    "00:00 - 00:03 ⚡ [قبل وبعد]: تحول خاطف للابتسامة مع إضاءة براقة وكابشن تفاعلي.",
                    "00:03 - 00:12 👨‍⚕️ [حديث الطبيب]: لقطات سريعة ومريحة للأجهزة الحديثة مع تعليق صوتي واضح.",
                    "00:12 - 00:20 🌟 [النتيجة النهائية]: ثقة العميل والابتسامة المشرقة."
                ],
                caption: "✨ 'احجز استشارتك الآن واستعد ابتسامتك المثالية!'",
                prompt: "🤖 AI Prompt: Modern clean dental clinic, soft professional lighting, bright confident smile."
            }
        },
        ecommerce: {
            viral: {
                hook: "🛒 'المنتج ده غير يومي تماماً.. ليه ما عرفتوش من زمان؟!'",
                shots: [
                    "00:00 - 00:03 💥 [المشكلة]: لقطة سريعة للعين والمعاناة اليومية.",
                    "00:03 - 00:10 💡 [الحل الذكي]: فتح المنتج واستعراض طريقة الاستخدام المدهشة.",
                    "00:10 - 00:15 🚀 [عرض خاص]: كابشن خصم 20% لفترة محدودة مع زر الشراء."
                ],
                caption: "🎁 'اطلبه الآن واحصل على الشحن المجاني اليوم فقط!'",
                prompt: "🤖 AI Prompt: Studio product showcase, clean neon background, dynamic unboxing motion."
            }
        },
        podcast: {
            viral: {
                hook: "🎙️ 'أكبر خطأ بيقع فيه 90% من الناس في بداية حياتهم...'",
                shots: [
                    "00:00 - 00:04 ⚡ [Hook عالي التوتر]: زوم سريع على الضيف أثناء نطق الجملة الخاطفة.",
                    "00:04 - 00:15 💬 [الكابشنز الديناميكية]: ظهور الكلمات واحدة تلو الأخرى بألوان مشعة ومؤثرات صوتية.",
                    "00:15 - 00:30 🎧 [رد الفعل]: لقطة رد فعل المذيع مع موسيقى خلفية حماسية."
                ],
                caption: "💡 'اسمع النصيحة دي وركّز فيها كويس جداً! 🎧'",
                prompt: "🤖 AI Prompt: Studio podcast setup, dark moody background, dynamic captions overlay."
            }
        },
        personal: {
            viral: {
                hook: "💼 'لو عاوز تكبر البزنس بتاعك في 2026.. الفيديو ده ليك!'",
                shots: [
                    "00:00 - 00:03 🚀 [انتباه]: لقطة خاطفة مع مؤشر صعود الأرباح أو النجاح.",
                    "00:03 - 00:15 📈 [النقاط الثلاث الرئيسية]: استعراض سريع للحلول المبتكرة.",
                    "00:15 - 00:30 🤝 [Call to action]: تواصل معنا الآن لبدء الاستشارة."
                ],
                caption: "🎯 'نجاح مشروعك يبدأ بقرار صح! تواصل معنا اليوم.'",
                prompt: "🤖 AI Prompt: Professional modern office backdrop, crisp lighting, high engagement aesthetic."
            }
        }
    };

    if (generateScriptBtn && scriptResultContent) {
        generateScriptBtn.addEventListener('click', () => {
            const tone = document.getElementById('ai-tone-select').value;
            const duration = document.getElementById('ai-duration-select').value;
            const topic = document.getElementById('ai-topic-input').value.trim();

            const categoryData = scriptTemplates[selectedNiche] || scriptTemplates.restaurants;
            const template = categoryData[tone] || categoryData.viral;

            let topicText = topic ? `📌 **فكرة المشروع الخاص:** "${topic}"` : '';

            let fullHtml = `
                ${topicText ? `<div class="script-section-block"><h5>${topicText}</h5></div>` : ''}
                <div class="script-section-block">
                    <h5>🔥 الخطاف الفيروسي الخاطف (Viral Hook):</h5>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #FFC107;">${template.hook}</p>
                </div>
                <div class="script-section-block">
                    <h5>🎬 سيناريو المشاهد والكاميرا (Duration: ${duration}s):</h5>
                    <ul style="list-style: none; padding: 0;">
                        ${template.shots.map(s => `<li style="margin-bottom: 8px;"><i class="fa-solid fa-play" style="color: #00f2fe; margin-left: 8px;"></i> ${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="script-section-block">
                    <h5>💬 الكابشن الموصى به للمنصات:</h5>
                    <p>${template.caption}</p>
                </div>
                <div class="script-section-block" style="border-right-color: #00f2fe;">
                    <h5>🤖 أمر الذكاء الاصطناعي للمؤثرات والصوت (AI Prompt):</h5>
                    <code style="display: block; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px; font-size: 0.85rem; color: #00f2fe;">${template.prompt}</code>
                </div>
            `;

            scriptResultContent.innerHTML = fullHtml;
            scriptOutputContainer.style.display = 'block';
            scriptOutputContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Copy script button
    if (copyScriptBtn && scriptResultContent) {
        copyScriptBtn.addEventListener('click', () => {
            const textToCopy = scriptResultContent.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHtml = copyScriptBtn.innerHTML;
                copyScriptBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>تم النسخ بنجاح!</span>`;
                setTimeout(() => { copyScriptBtn.innerHTML = originalHtml; }, 2000);
            });
        });
    }

    // Send via WhatsApp button
    if (whatsappScriptBtn && scriptResultContent) {
        whatsappScriptBtn.addEventListener('click', () => {
            const text = `مرحباً محمد عماد، قمت بتوليد هذا السكربت من موقعك وأود البدء في مونتاجه فوراً:\n\n${scriptResultContent.innerText}`;
            const url = `https://wa.me/201001376298?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }



    // --- 3. AI SMART COST CALCULATOR ---
    const videoCountRange = document.getElementById('video-count-range');
    const videoCountVal = document.getElementById('video-count-val');
    const videoLenRange = document.getElementById('video-len-range');
    const videoLenVal = document.getElementById('video-len-val');

    const chkCaptions = document.getElementById('chk-captions');
    const chkColor = document.getElementById('chk-color');
    const chkAudio = document.getElementById('chk-audio');
    const chkExpress = document.getElementById('chk-express');

    const calcTotalPrice = document.getElementById('calc-total-price');
    const calcDeliveryTime = document.getElementById('calc-delivery-time');
    const calcWhatsappBtn = document.getElementById('calc-whatsapp-btn');

    function calculatePrice() {
        if (!videoCountRange || !videoLenRange || !calcTotalPrice) return;

        const count = parseInt(videoCountRange.value);
        const lenSeconds = parseInt(videoLenRange.value);

        if (videoCountVal) videoCountVal.innerText = `${count} ${count === 1 ? 'فيديو' : 'فيديوهات'}`;
        if (videoLenVal) videoLenVal.innerText = `${lenSeconds} ثانية`;

        // Base rates calculation ($ per video)
        let baseRatePerVideo = 15;
        if (lenSeconds > 30 && lenSeconds <= 60) baseRatePerVideo = 25;
        else if (lenSeconds > 60) baseRatePerVideo = 40;

        let videoTotal = baseRatePerVideo * count;

        // Add-ons
        let addOnsTotal = 0;
        if (chkCaptions && chkCaptions.checked) addOnsTotal += 5 * count;
        if (chkColor && chkColor.checked) addOnsTotal += 5 * count;
        if (chkAudio && chkAudio.checked) addOnsTotal += 5 * count;

        let total = videoTotal + addOnsTotal;

        // Express multiplier
        if (chkExpress && chkExpress.checked) {
            total = Math.round(total * 1.25);
            if (calcDeliveryTime) calcDeliveryTime.innerText = "خلال 24 ساعة 🚀";
        } else {
            let days = count <= 3 ? "24-48 ساعة" : count <= 7 ? "3-4 أيام" : "5-7 أيام";
            if (calcDeliveryTime) calcDeliveryTime.innerText = days;
        }

        // Bulk discount
        if (count >= 5) {
            total = Math.round(total * 0.85); // 15% bulk discount
        }

        calcTotalPrice.innerText = `$${total}`;

        if (calcWhatsappBtn) {
            const msg = `مرحباً محمد عماد، أود طلب هذا العرض للمونتاج:\n- عدد الفيديوهات: ${count}\n- مدة الفيديو: ${lenSeconds} ثانية\n- التكلفة التقديرية: $${total}\n- مدة التسليم المتوقعة: ${calcDeliveryTime ? calcDeliveryTime.innerText : ''}`;
            calcWhatsappBtn.href = `https://wa.me/201001376298?text=${encodeURIComponent(msg)}`;
        }
    }

    if (videoCountRange) videoCountRange.addEventListener('input', calculatePrice);
    if (videoLenRange) videoLenRange.addEventListener('input', calculatePrice);
    if (chkCaptions) chkCaptions.addEventListener('change', calculatePrice);
    if (chkColor) chkColor.addEventListener('change', calculatePrice);
    if (chkAudio) chkAudio.addEventListener('change', calculatePrice);
    if (chkExpress) chkExpress.addEventListener('change', calculatePrice);

    calculatePrice();


    // --- 4. FLOATING AI ASSISTANT BOT WIDGET ---
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
            return "تبدأ أسعار المونتاج من **$15 للفيديو** (Reel/Short 30s) مع خصم خاص للمجموعات! يمكنك استخدام **حاسبة التكلفة الذكية** بالموقع لحساب التكلفة بدقة فوراً! 📊";
        }
        if (msg.includes('خطوات') || msg.includes('كيف') || msg.includes('بدء') || msg.includes('تواصل')) {
            return "خطوات بدء العمل بسيطة جداً: \n1️⃣ إرسال اللقطات المصورة لـ محمد عماد عبر الواتساب.\n2️⃣ تحديد الأسلوب والمؤثرات أو توليد السكربت عبر الموقع.\n3️⃣ البدء فوراً في المونتاج والتسليم خلال 24-48 ساعة! 🚀";
        }
        if (msg.includes('سكربت') || msg.includes('مولد') || msg.includes('فكره')) {
            return "يمكنك استخدام قسم **'مولد السكربتات AI'** بالأعلى! اختر مجالك وسيقوم الذكاء الاصطناعي بتوليد سيناريو مشهدي وخطاف خاطف فوراً! 🪄";
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


