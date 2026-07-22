
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

/* ==========================================================================
   BEFORE / AFTER AI SLIDER & AI CREATIVE BRIEF GENERATOR LOGIC
   ========================================================================== */

// --- Before/After AI Visual Slider Logic ---
const baContainer = document.getElementById('ba-slider');
const baBefore = document.getElementById('ba-before');
const baHandle = document.getElementById('ba-handle');

if (baContainer && baBefore && baHandle) {
    let isDragging = false;

    function setSliderPosition(x) {
        const rect = baContainer.getBoundingClientRect();
        let offsetX = x - rect.left;
        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;

        const percentage = (offsetX / rect.width) * 100;
        baBefore.style.width = percentage + '%';
        baHandle.style.left = percentage + '%';

        const beforeImg = baBefore.querySelector('img');
        if (beforeImg) {
            beforeImg.style.width = rect.width + 'px';
        }
    }

    baHandle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setSliderPosition(e.clientX);
    });

    baHandle.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging || !e.touches[0]) return;
        setSliderPosition(e.touches[0].clientX);
    });

    baContainer.addEventListener('click', (e) => {
        setSliderPosition(e.clientX);
    });

    window.addEventListener('resize', () => {
        const rect = baContainer.getBoundingClientRect();
        const beforeImg = baBefore.querySelector('img');
        if (beforeImg) beforeImg.style.width = rect.width + 'px';
    });
}

// --- AI Creative Assistant Brief Generator ---
const generateBriefBtn = document.getElementById('generate-ai-brief-btn');
const aiResultBox = document.getElementById('ai-result-box');
const resultTitle = document.getElementById('result-title');
const resultHook = document.getElementById('result-hook');
const resultScript = document.getElementById('result-script');
const resultFx = document.getElementById('result-fx');
const sendWhatsappBrief = document.getElementById('send-whatsapp-brief');

const aiTemplates = {
    restaurant: {
        name: "مطعم / مأكولات ومشروبات",
        hooks: [
            "🔥 سر الطعم اللي كلكوا بتدوروا عليه في مكان واحد!",
            "🍔 فيديو تشويقي يبدأ بلقطة ماكرو 4K لصوت القرمشة ورشة البهارات!",
            "✨ لو زرت المكان ده ومشربتش التميز يبقى مخرجتش!"
        ],
        scripts: [
            "افتتاحية سريعة (0-3 ثواني): لقطات تجميعية سريعة بالـ Speed Ramping لأهم الأطباق. ثم انتقالة ذكية لعرض المطبخ والتقديم الاحترافي، واختتام بدعوة للتجربة مع الموقع والأرقام.",
            "استعراض قصصي من البداية لطهي الطبق الرئيسي، التركيز على التفاصيل والدخان والألوان المشبعة الزاهية."
        ],
        fx: [
            "تأثيرات CapCut Pro AI Color Grading المشبعة بالألوان الدافئة + نصوص ديناميكية Auto Captions بإيموجي الطعام + زوم سريع وSpeed Ramping متناغم مع الإيقاع.",
            "مؤثرات صوتية حية (Sfx) لصوت الشواء، القرمشة، والموسيقى الحماسية."
        ]
    },
    clinic: {
        name: "عيادة طبية / مركز تجميل",
        hooks: [
            "💎 ابتسامتك هي عنوان ثقتك.. انظر الفرق بعد الجلسة الأولى!",
            "✨ سر البشرة المشرقة الجذابة في 30 ثانية بس!",
            "🏥 تجربة علاجية وسينمائية مختلفة تماماً في أفضل مركز متخصص."
        ],
        scripts: [
            "مشهد افتتاحي هادئ وفخم للعيادة، انتقال للحديث السريع للطبيب أو الحالة قبل وبعد المعالجة، مع إبراز التقنيات والأجهزة الحديثة بشكل مشوق وموثوق.",
            "استعراض حالة حقيقية (Before & After) مع ترجمة تلقائية ملونة ونصوص توضيحية لخطوات العلاج."
        ],
        fx: [
            "إخراج لوني ناصع وبارد (Clean Medical Teal & White Grade) + نصوص توضيحية ثلاثية الأبعاد خفيفة + CapCut Auto Captions أنيقة ومريحة للعين."
        ]
    },
    cafe: {
        name: "كافيه / محمصة قهوة",
        hooks: [
            "☕ ريحة القهوة هنا مش مجرد مشروب.. دي تجربة تعدل مزاجك!",
            "✨ أول ريلز سينمائي يخليك تشم ريحة البن من ورا الشاشة!",
            "🥐 المكان الأروق لقضاء وقتك والمذاكرة أو الشغل."
        ],
        scripts: [
            "لقطة سلو موشن (Slow-Motion) لصب القهوة والـ Espresso Drop مع صوت التقطير الحقيقي، ثم استعراض الديكور المريح والأجواء الجذابة واختتام باللوجو.",
            "جولة سريعة وممتعة بالـ CapCut Speed Ramping بين تفاصيل المكان وأفضل الوجبات الخفيفة والقهوة المختصة."
        ],
        fx: [
            "تدرجات لونية سينمائية دافئة (Vintage Warm Mood) + تأثيرات صوتية عالية الدقة لصوت القهوة + نصوص كابشن متحركة مع حركة الكاميرا."
        ]
    },
    realestate: {
        name: "عقارات / تصميم داخلي",
        hooks: [
            "🏰 شقة أحلامك في أرقى موقع وبإطلالة ساحرة.. شاهد التفاصيل!",
            "🔑 تصميم داخلي يحول مساحتك إلى تحفة فنية معاصرة!",
            "✨ الفرصة الاستثمارية الأقوى لهذا العام."
        ],
        scripts: [
            "جولة سينمائية واسعة (Wide Cinematic Shot) تنتقل بسلاسة بين الغرف والصالة والمطبخ مع تسريع ذكي وإبراز مساحات الإضاءة الطبيعية والأثاث الفاخر.",
            "استعراض التصميم الداخلي قبل وبعد التشطيب بتقنيات الانتقال السريع في CapCut Pro."
        ],
        fx: [
            "تثبيت وتنعيم حركة الكاميرا (AI Stabilization) + تباين ألوان فخم + أرقام ومميزات ثلاثية الأبعاد تظهر على الحوائط تلقائياً (AI 3D Text Tracking)."
        ]
    },
    ecommerce: {
        name: "متجر إلكتروني / منتجات",
        hooks: [
            "🛍️ المنتج اللي مكسر تيك توك ووصل أخيرًا بخصم خاص!",
            "📦 فتح صندوق المنتجات الأكثر طلباً في 2026!",
            "🔥 ليه المنتج ده لازم يكون عندك النهاردة؟"
        ],
        scripts: [
            "افتتاحية خطفة (Unboxing Hook) في أول 2 ثانية، إبراز طريقة الاستخدام، استعراض المزايا والحلول التي يقدمها المنتج، ثم Call to Action قوي للشراء مع الخصم.",
            "مراجعة سريعة للمنتج بتأثيرات البوب أب والتكبير والتصغير الديناميكي."
        ],
        fx: [
            "تفريغ وعزل خلفيات المنتجات بالـ CapCut AI Cutout + ملصقات وأسهم متحركة تفاعلية + نصوص ديناميكية ملونة مع أسعار وعروض خصم حماسية."
        ]
    },
    personal: {
        name: "صانع محتوى / شخصي",
        hooks: [
            "💡 معلومة في 60 ثانية هتغير طريقة تفكيرك تماماً!",
            "🚀 الخطأ القاتل اللي بيقع فيه أغلب الناس وكيف تتجنبه؟",
            "🎬 كيف تصنع محتوى فيروسي وتحقق انتشار واسع بأسهل طريقة؟"
        ],
        scripts: [
            "تحدث مباشر للجمهور (Talking Head) محاط بقِصّات سريعة جداً بدون فترات صمت، تزويد الفيديوهات بصور ومقاطع توضيحية (B-Roll) تتغير كل 2-3 ثواني لمنع التشتت.",
            "قصة شخصية مشوقة تبدأ بسؤال غريب وتستعرض الحل في النهاية."
        ],
        fx: [
            "CapCut AI Auto Captions مع إبراز الكلمات الهامة بالأصفر والأخضر + زوم إن وزوم أوت تلقائي في نقاط التوكيد + مؤثرات صوتية (Pop, Woosh, Click) عند ظهور كل عنصر."
        ]
    }
};

if (generateBriefBtn && aiResultBox) {
    generateBriefBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const bizType = document.getElementById('ai-business-type').value;
        const platform = document.getElementById('ai-platform').options[document.getElementById('ai-platform').selectedIndex].text;
        const tone = document.getElementById('ai-tone').options[document.getElementById('ai-tone').selectedIndex].text;
        
        const template = aiTemplates[bizType] || aiTemplates.restaurant;
        
        const hookChoice = template.hooks[Math.floor(Math.random() * template.hooks.length)];
        const scriptChoice = template.scripts[Math.floor(Math.random() * template.scripts.length)];
        const fxChoice = template.fx[Math.floor(Math.random() * template.fx.length)];
        
        resultTitle.textContent = `مقترح فيديو: ${template.name}`;
        resultHook.textContent = hookChoice;
        resultScript.textContent = scriptChoice;
        resultFx.textContent = fxChoice;
        
        const message = `أهلاً أ/ محمد عماد، قمت بتوليد brief فيديو من خلال المساعد الذكي بموقعك:\n\n` +
            `📌 *مجال النشاط:* ${template.name}\n` +
            `📱 *المنصة:* ${platform}\n` +
            `🎵 *الطابع والموسيقى:* ${tone}\n\n` +
            `💡 *فكرة الخطفة (Hook):* ${hookChoice}\n` +
            `🎬 *السيناريو المقترح:* ${scriptChoice}\n` +
            `✂️ *مؤثرات CapCut AI:* ${fxChoice}\n\n` +
            `حابب نشتغل على الفكرة دي وأعرف التفاصيل والتكلفة!`;
            
        const encodedMessage = encodeURIComponent(message);
        sendWhatsappBrief.href = `https://wa.me/201001376298?text=${encodedMessage}`;
        
        aiResultBox.classList.remove('hidden');
        aiResultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

