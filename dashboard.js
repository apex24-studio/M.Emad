import { db, auth, collection, addDoc, getDocs, deleteDoc, doc, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase-config.js';

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const addVideoForm = document.getElementById('add-video-form');
const videosContainer = document.getElementById('videos-container');

// Auth State Observer
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

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            loginError.style.display = 'none';
        })
        .catch((error) => {
            loginError.textContent = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
            loginError.style.display = 'block';
        });
});

// Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Helper: Extract YouTube ID
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Add Video
addVideoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('youtube-link').value;
    const title = document.getElementById('project-title').value;
    const category = document.getElementById('project-category').value;
    
    const videoId = getYouTubeID(url);
    if (!videoId) {
        alert('رابط يوتيوب غير صحيح');
        return;
    }
    
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    try {
        const submitBtn = addVideoForm.querySelector('button');
        submitBtn.textContent = 'جاري الإضافة...';
        submitBtn.disabled = true;

        await addDoc(collection(db, "videos"), {
            title: title,
            category: category,
            url: url,
            videoId: videoId,
            thumbnailUrl: thumbnailUrl,
            createdAt: new Date()
        });
        
        addVideoForm.reset();
        submitBtn.textContent = 'إضافة للفيديو';
        submitBtn.disabled = false;
        
        loadVideos(); // Reload list
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("حدث خطأ أثناء الإضافة");
    }
});

// Load Videos
async function loadVideos() {
    videosContainer.innerHTML = 'جاري التحميل...';
    try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        videosContainer.innerHTML = '';
        
        if (querySnapshot.empty) {
            videosContainer.innerHTML = '<p>لا توجد فيديوهات مضافة بعد.</p>';
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            
            const item = document.createElement('div');
            item.className = 'video-item';
            item.innerHTML = `
                <div class="video-info">
                    <img src="${data.thumbnailUrl}" alt="${data.title}">
                    <div>
                        <h4>${data.title}</h4>
                        <span style="font-size: 0.8rem; color: #aaa;">${data.category}</span>
                    </div>
                </div>
                <button class="delete-btn" data-id="${id}">حذف</button>
            `;
            videosContainer.appendChild(item);
        });

        // Add delete event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
                    const docId = e.target.getAttribute('data-id');
                    await deleteDoc(doc(db, "videos", docId));
                    loadVideos();
                }
            });
        });
        
    } catch (e) {
        console.error("Error loading videos: ", e);
        videosContainer.innerHTML = '<p>حدث خطأ أثناء جلب البيانات. يرجى التأكد من إعدادات Firebase.</p>';
    }
}
