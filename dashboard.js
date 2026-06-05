import {
    db, auth,
    collection, addDoc, getDocs, deleteDoc, doc,
    signInWithEmailAndPassword, onAuthStateChanged, signOut
} from './firebase-config.js';

// ===== DOM =====
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

// ===== Platform Detection =====
function detectPlatform(url) {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('facebook.com') || url.includes('fb.com') || url.includes('fb.watch')) return 'facebook';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    return 'other';
}

const platformInfo = {
    youtube:   { icon: 'fa-brands fa-youtube',    label: 'YouTube',    class: 'youtube',   color: '#ff4444' },
    facebook:  { icon: 'fa-brands fa-facebook',   label: 'Facebook',   class: 'facebook',  color: '#4267B2' },
    instagram: { icon: 'fa-brands fa-instagram',  label: 'Instagram',  class: 'instagram', color: '#e1306c' },
    tiktok:    { icon: 'fa-brands fa-tiktok',      label: 'TikTok',     class: 'tiktok',    color: '#fff' },
    other:     { icon: 'fa-solid fa-link',         label: 'رابط خارجي', class: 'other',     color: '#7c5cbf' }
};

// ===== Watch link input =====
document.getElementById('video-link').addEventListener('input', (e) => {
    const url = e.target.value.trim();
    const platform = detectPlatform(url);

    if (platform && url.length > 5) {
        const info = platformInfo[platform];
        platformBadge.innerHTML = `<i class="${info.icon}"></i> ${info.label}`;
        platformBadge.className = `platform-badge show ${info.class}`;

        // Auto-fill YouTube thumbnail (no upload needed)
        if (platform === 'youtube' && !selectedFile) {
            const videoId = getYouTubeID(url);
            if (videoId) {
                const ytThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                uploadPreview.src = ytThumb;
                uploadPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                uploadArea.classList.add('has-image');
                base64Thumbnail = null; // Will use YouTube URL directly
            }
        }
    } else {
        platformBadge.className = 'platform-badge';
    }
});

// ===== Image Compression to Base64 =====
function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Scale down if too large
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to compressed base64
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
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

    // Compress image
    base64Thumbnail = await compressImage(file);

    uploadPreview.src = base64Thumbnail;
    uploadPreview.style.display = 'block';
    uploadPlaceholder.style.display = 'none';
    uploadArea.classList.add('has-image');

    progressFill.style.width = '100%';
    uploadStatus.textContent = 'تم ضغط الصورة ✅';
    setTimeout(() => { progressWrap.style.display = 'none'; progressFill.style.width = '0%'; }, 1500);
});

// ===== YouTube ID Extractor =====
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// ===== Auth State =====
onAuthStateChanged(auth, (user) => {
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
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginError.style.display = 'none';
    signInWithEmailAndPassword(auth, email, password)
        .catch(() => { loginError.style.display = 'block'; });
});

// ===== Logout =====
logoutBtn.addEventListener('click', () => signOut(auth));

// ===== Add Video =====
addVideoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('video-link').value.trim();
    const title = document.getElementById('project-title').value.trim();
    const category = document.getElementById('project-category').value;
    const platform = detectPlatform(url) || 'other';

    // For non-YouTube, require a thumbnail
    if (platform !== 'youtube' && !base64Thumbnail) {
        showToast('⚠️ يرجى رفع صورة مصغرة للفيديو', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';

    try {
        // Determine final thumbnail URL
        let thumbnailUrl = '';
        if (base64Thumbnail) {
            thumbnailUrl = base64Thumbnail; // base64 stored in Firestore
        } else if (platform === 'youtube') {
            const videoId = getYouTubeID(url);
            thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
        }

        await addDoc(collection(db, "videos"), {
            title,
            category,
            url,
            platform,
            thumbnailUrl,
            videoId: platform === 'youtube' ? (getYouTubeID(url) || '') : '',
            createdAt: new Date()
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
        console.error(err);
        showToast('❌ حدث خطأ، حاول مجدداً', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> إضافة الفيديو';
    }
});

// ===== Load Videos =====
const categoriesMap = { restaurants: 'مطاعم', clinics: 'عيادات طبية', cafes: 'كافيهات', other: 'أخرى' };

async function loadVideos() {
    videosContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>`;
    try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        videosCount.textContent = querySnapshot.size;

        if (querySnapshot.empty) {
            videosContainer.innerHTML = `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>لا توجد فيديوهات مضافة بعد. ابدأ بإضافة أول فيديو!</p></div>`;
            return;
        }

        videosContainer.innerHTML = '';
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const platInfo = platformInfo[data.platform] || platformInfo['other'];

            const item = document.createElement('div');
            item.className = 'video-item';
            item.innerHTML = `
                <div class="video-info">
                    <img class="video-thumb" src="${data.thumbnailUrl}" alt="${data.title}" onerror="this.src='https://placehold.co/100x60/1a1a2e/7c5cbf?text=No+Image'">
                    <div class="video-meta">
                        <h4>${data.title}</h4>
                        <div class="meta-row">
                            <span class="cat-badge">${categoriesMap[data.category] || data.category}</span>
                            <span class="plat-badge" style="font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:20px;background:rgba(0,0,0,0.2);border:1px solid ${platInfo.color}33;color:${platInfo.color}">
                                <i class="${platInfo.icon}"></i> ${platInfo.label}
                            </span>
                        </div>
                        <div class="video-link">${data.url.length > 55 ? data.url.substring(0, 55) + '...' : data.url}</div>
                    </div>
                </div>
                <button class="delete-btn" data-id="${id}">
                    <i class="fa-solid fa-trash"></i> حذف
                </button>
            `;
            videosContainer.appendChild(item);
        });

        // Delete events
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;
                const docId = btn.getAttribute('data-id');
                try {
                    await deleteDoc(doc(db, "videos", docId));
                    showToast('🗑️ تم حذف الفيديو', 'success');
                    loadVideos();
                } catch (err) {
                    showToast('❌ حدث خطأ أثناء الحذف', 'error');
                }
            });
        });

    } catch (err) {
        console.error(err);
        videosContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>حدث خطأ في جلب البيانات</p></div>`;
    }
}
