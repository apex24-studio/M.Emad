// ===== DOM Elements =====
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const addVideoForm = document.getElementById('add-video-form');
const videosContainer = document.getElementById('videos-container');
const videosCount = document.getElementById('videos-count');
const submitBtn = document.getElementById('submit-btn');
const thumbnailInput = document.getElementById('thumbnail-input');
const uploadPreview = document.getElementById('upload-preview');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const uploadArea = document.getElementById('upload-area');
const platformBadge = document.getElementById('platform-badge');
const progressWrap = document.getElementById('upload-progress-wrap');
const progressFill = document.getElementById('progress-fill');
const uploadStatus = document.getElementById('upload-status');
const toast = document.getElementById('toast');

let selectedFile = null;
let base64Thumbnail = null; // Store compressed base64 image

// ===== Toast Notification =====
function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

// ===== Normalize & Sanitize URL =====
function normalizeUrl(inputUrl) {
    if (!inputUrl) return '';
    let url = inputUrl.trim();
    if (url && !/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    return url;
}

// ===== Platform Detection =====
function detectPlatform(url) {
    if (!url) return null;
    const cleanUrl = url.toLowerCase();
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) return 'youtube';
    if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.com') || cleanUrl.includes('fb.watch')) return 'facebook';
    if (cleanUrl.includes('instagram.com')) return 'instagram';
    if (cleanUrl.includes('tiktok.com')) return 'tiktok';
    return 'other';
}

const platformInfo = {
    youtube:   { icon: 'fa-brands fa-youtube',    label: 'YouTube',    class: 'youtube',   color: '#ff4444' },
    facebook:  { icon: 'fa-brands fa-facebook',   label: 'Facebook',   class: 'facebook',  color: '#4267B2' },
    instagram: { icon: 'fa-brands fa-instagram',  label: 'Instagram',  class: 'instagram', color: '#e1306c' },
    tiktok:    { icon: 'fa-brands fa-tiktok',      label: 'TikTok',     class: 'tiktok',    color: '#fff' },
    other:     { icon: 'fa-solid fa-link',         label: 'رابط خارجي', class: 'other',     color: '#7c5cbf' }
};

// ===== YouTube ID Extractor (Supports Shorts, Watch, Embed, shorten) =====
function getYouTubeID(url) {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// ===== Generate Default Platform Canvas Image =====
function getDefaultThumbnail(platform, title) {
    const info = platformInfo[platform] || platformInfo['other'];
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 360);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#0f0c20');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 360);

    // Platform accent line
    ctx.fillStyle = info.color || '#7c5cbf';
    ctx.fillRect(0, 350, 600, 10);

    // Platform Name Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.label, 300, 160);

    // Video Title Text
    ctx.fillStyle = '#a0a0c0';
    ctx.font = '20px sans-serif';
    const displayTitle = title ? (title.length > 35 ? title.substring(0, 35) + '...' : title) : 'فيديو جديد';
    ctx.fillText(displayTitle, 300, 210);

    return canvas.toDataURL('image/jpeg', 0.85);
}

// ===== Watch link input =====
document.getElementById('video-link').addEventListener('input', (e) => {
    let rawUrl = e.target.value.trim();
    if (!rawUrl) {
        platformBadge.className = 'platform-badge';
        return;
    }

    const url = normalizeUrl(rawUrl);
    const platform = detectPlatform(url);

    if (platform && url.length > 5) {
        const info = platformInfo[platform];
        platformBadge.innerHTML = `<i class="${info.icon}"></i> ${info.label}`;
        platformBadge.className = `platform-badge show ${info.class}`;

        // Auto-fill YouTube thumbnail
        if (platform === 'youtube' && !selectedFile) {
            const videoId = getYouTubeID(url);
            if (videoId) {
                const ytThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                uploadPreview.src = ytThumb;
                uploadPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                uploadArea.classList.add('has-image');
            }
        }
    } else {
        platformBadge.className = 'platform-badge';
    }
});

// ===== Image Compression to Base64 =====
function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => reject(new Error('فشل قراءة الصورة'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('فشل رفع الملف'));
        reader.readAsDataURL(file);
    });
}

// ===== Image Upload Preview =====
thumbnailInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    selectedFile = file;
    progressWrap.style.display = 'block';
    uploadStatus.textContent = 'جاري ضغط الصورة...';
    progressFill.style.width = '50%';

    try {
        base64Thumbnail = await compressImage(file);
        uploadPreview.src = base64Thumbnail;
        uploadPreview.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
        uploadArea.classList.add('has-image');

        progressFill.style.width = '100%';
        uploadStatus.textContent = 'تم ضغط الصورة ✅';
        setTimeout(() => { progressWrap.style.display = 'none'; progressFill.style.width = '0%'; }, 1500);
    } catch (err) {
        progressWrap.style.display = 'none';
        showToast('❌ تعذر معالجة الصورة المصغرة', 'error');
    }
});

// ===== Auth State =====
auth.onAuthStateChanged((user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadVideos();
    } else {
        loginSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
    }
});

// ===== Login =====
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    loginError.style.display = 'none';
    auth.signInWithEmailAndPassword(email, password)
        .catch((err) => {
            console.error('Login error:', err);
            loginError.style.display = 'block';
            loginError.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        });
});

// ===== Logout =====
logoutBtn.addEventListener('click', () => auth.signOut());

// ===== Add Video =====
addVideoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rawUrl = document.getElementById('video-link').value;
    const url = normalizeUrl(rawUrl);
    const title = document.getElementById('project-title').value.trim();
    const category = document.getElementById('project-category').value;
    const platform = detectPlatform(url) || 'other';

    if (!url || url.length < 5) {
        showToast('⚠️ يرجى إدخال رابط فيديو صحيح', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';

    try {
        let thumbnailUrl = '';
        let videoId = '';

        if (platform === 'youtube') {
            videoId = getYouTubeID(url) || '';
            if (base64Thumbnail) {
                thumbnailUrl = base64Thumbnail;
            } else if (videoId) {
                thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            } else {
                thumbnailUrl = getDefaultThumbnail(platform, title);
            }
        } else {
            thumbnailUrl = base64Thumbnail ? base64Thumbnail : getDefaultThumbnail(platform, title);
        }

        await db.collection("videos").add({
            title,
            category,
            url,
            platform,
            thumbnailUrl,
            videoId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Reset form
        addVideoForm.reset();
        selectedFile = null;
        base64Thumbnail = null;
        uploadPreview.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
        uploadArea.classList.remove('has-image');
        platformBadge.className = 'platform-badge';

        showToast('✅ تم إضافة الفيديو بنجاح!', 'success');
        loadVideos();
    } catch (err) {
        console.error('Error adding video:', err);
        showToast('❌ حدث خطأ: ' + (err.message || 'حاول مجدداً'), 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> إضافة الفيديو';
    }
});

// ===== Load Videos =====
const categoriesMap = { 'capcut-ai': 'CapCut & AI ✦', restaurants: 'مطاعم', clinics: 'عيادات طبية', cafes: 'كافيهات', other: 'أخرى' };

function renderVideoItem(docSnap) {
    const data = docSnap.data() || {};
    const id = docSnap.id;
    const title = data.title || 'فيديو بدون عنوان';
    const url = data.url || '';
    const platform = data.platform || 'other';
    const category = data.category || 'other';
    const thumbnailUrl = data.thumbnailUrl || 'https://placehold.co/100x60/1a1a2e/7c5cbf?text=No+Image';

    const platInfo = platformInfo[platform] || platformInfo['other'];
    const displayUrl = url.length > 55 ? url.substring(0, 55) + '...' : url;

    const item = document.createElement('div');
    item.className = 'video-item';
    item.innerHTML = `
        <div class="video-info">
            <img class="video-thumb" src="${thumbnailUrl}" alt="${title}" onerror="this.src='https://placehold.co/100x60/1a1a2e/7c5cbf?text=No+Image'">
            <div class="video-meta">
                <h4>${title}</h4>
                <div class="meta-row">
                    <span class="cat-badge">${categoriesMap[category] || category}</span>
                    <span class="plat-badge" style="font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:20px;background:rgba(0,0,0,0.2);border:1px solid ${platInfo.color}33;color:${platInfo.color}">
                        <i class="${platInfo.icon}"></i> ${platInfo.label}
                    </span>
                </div>
                <div class="video-link">${displayUrl}</div>
            </div>
        </div>
        <button class="delete-btn" data-id="${id}">
            <i class="fa-solid fa-trash"></i> حذف
        </button>
    `;
    return item;
}

function bindDeleteEvents() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;
            const docId = btn.getAttribute('data-id');
            try {
                await db.collection("videos").doc(docId).delete();
                showToast('🗑️ تم حذف الفيديو', 'success');
                loadVideos();
            } catch (err) {
                showToast('❌ حدث خطأ أثناء الحذف: ' + (err.message || ''), 'error');
            }
        });
    });
}

async function loadVideos() {
    videosContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>`;
    try {
        let querySnapshot;
        try {
            querySnapshot = await db.collection("videos").orderBy("createdAt", "desc").get();
        } catch (orderErr) {
            console.warn('OrderBy failed, falling back to simple query:', orderErr);
            querySnapshot = await db.collection("videos").get();
        }

        videosCount.textContent = querySnapshot.size;

        if (querySnapshot.empty) {
            videosContainer.innerHTML = `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>لا توجد فيديوهات مضافة بعد. ابدأ بإضافة أول فيديو!</p></div>`;
            return;
        }

        videosContainer.innerHTML = '';
        querySnapshot.forEach((docSnap) => {
            const item = renderVideoItem(docSnap);
            videosContainer.appendChild(item);
        });

        bindDeleteEvents();

    } catch (err) {
        console.error('Error loading videos:', err);
        const errorMsg = err.message ? `(${err.message})` : '';
        videosContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-triangle-exclamation" style="color:var(--danger);"></i>
                <p>حدث خطأ أثناء جلب البيانات من قواعد البيانات</p>
                <small style="color:var(--danger); opacity:0.8; margin-top:0.5rem; display:block;">${errorMsg}</small>
            </div>`;
    }
}
