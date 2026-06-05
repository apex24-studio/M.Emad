import { db, collection, getDocs } from './firebase-config.js';

// --- Preloader Logic ---
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.progress');
    
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
            progress.style.width = width + '%';
        }
    }, 100);
});

// --- Advanced Magnetic Cursor ---
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

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

// --- Magnetic Elements ---
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        cursor.style.transform = 'translate(-50%, -50%) scale(4)';
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = `translate(0px, 0px)`;
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// --- Interaction Hover Effects ---
const hoverables = document.querySelectorAll('a, button, .work-card, .nav-item');
hoverables.forEach(item => {
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
        const querySnapshot = await getDocs(collection(db, "videos"));
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
                const data = docSnap.data();
                
                const card = document.createElement('div');
                card.className = `work-card ${isFirst ? 'large' : ''} reveal-init is-visible`;
                card.setAttribute('data-category', data.category);
                
                card.innerHTML = `
                    <div class="card-inner">
                        <img src="${data.thumbnailUrl}" alt="${data.title}">
                        <div class="card-overlay">
                            <div class="card-meta">
                                <span class="category">${categoriesMap[data.category] || data.category}</span>
                                <h4 class="project-title">${data.title}</h4>
                            </div>
                            <div class="view-btn">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add Lightbox Event (YouTube) or Open Link (other platforms)
                card.addEventListener('click', () => {
                    if (data.platform === 'youtube' && data.videoId) {
                        lightbox.style.display = 'flex';
                        videoFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${data.videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
                    } else {
                        window.open(data.url, '_blank');
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
            
            // Re-bind Hover Effects for new cards
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
    } catch(e) {
        console.log("استخدام الفيديوهات الثابتة لعدم وجود إعدادات Firebase بعد.");
    }
}

fetchPortfolioVideos();
