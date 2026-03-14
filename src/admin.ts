import { 
  getQuestions, 
  addQuestion, 
  updateQuestion, 
  deleteQuestionFromDb,
  migrateDefaultData,
  Question 
} from './services/firestoreService';
import { defaultQuizData } from './data/defaultData';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

let quizQuestions: Question[] = [];
let currentUser: any = null;

const form = document.getElementById('question-form') as HTMLFormElement;
const questionsList = document.getElementById('questions-list');
const totalQuestionsDisplay = document.getElementById('total-questions');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const editIndexInput = document.getElementById('edit-index') as HTMLInputElement;
const syncBtn = document.getElementById('sync-btn');
const logoutBtn = document.getElementById('logout-btn');

// Auth check
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    console.log("Auth state changed. User:", user ? user.email : "Logged out");
    
    if (user) {
        const adminEmail = "TruongKhoa231999@gmail.com".toLowerCase();
        const userEmail = (user.email || "").toLowerCase();
        
        if (userEmail === adminEmail) {
            console.log("Admin access granted for:", userEmail);
            loadQuestions();
        } else {
            console.warn("Access denied for:", userEmail);
            // If logged in but not admin, show a specific access denied UI instead of just an alert
            showAccessDeniedUI(user.email || "");
            signOut(auth);
        }
    } else {
        showLoginUI();
    }
});

function showLoginUI() {
    if (document.getElementById('access-denied-overlay')) {
        document.getElementById('access-denied-overlay')?.remove();
    }
    
    if (!document.getElementById('login-overlay')) {
        const loginOverlay = document.createElement('div');
        loginOverlay.id = 'login-overlay';
        loginOverlay.className = 'fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-8 text-center';
        loginOverlay.innerHTML = `
            <div class="animate-fade-in">
                <span class="text-6xl mb-6 block">🌊</span>
                <h1 class="text-3xl font-bold mb-4">Quản Trị OceanGuard</h1>
                <p class="text-gray-600 mb-8 max-w-md">Vui lòng đăng nhập bằng tài khoản Admin để quản lý câu hỏi.</p>
                <button id="login-btn" class="bg-primary-green text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all flex items-center space-x-3 mx-auto">
                    <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <span>Đăng nhập với Google</span>
                </button>
            </div>
        `;
        document.body.appendChild(loginOverlay);
        document.getElementById('login-btn')?.addEventListener('click', async () => {
            const btn = document.getElementById('login-btn') as HTMLButtonElement;
            btn.disabled = true;
            btn.innerHTML = '<span>Đang xử lý...</span>';
            
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(auth, provider);
            } catch (err: any) {
                console.error("Login error:", err);
                btn.disabled = false;
                btn.innerHTML = `
                    <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <span>Thử lại với Google</span>
                `;
                if (err.code !== 'auth/popup-closed-by-user') {
                    alert("Đăng nhập thất bại: " + err.message);
                }
            }
        });
    }
}

function showAccessDeniedUI(email: string) {
    document.getElementById('login-overlay')?.remove();
    
    const deniedOverlay = document.createElement('div');
    deniedOverlay.id = 'access-denied-overlay';
    deniedOverlay.className = 'fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-8 text-center';
    deniedOverlay.innerHTML = `
        <div class="animate-fade-in">
            <span class="text-6xl mb-6 block">🚫</span>
            <h1 class="text-3xl font-bold mb-4 text-red-600">Truy cập bị từ chối</h1>
            <p class="text-gray-600 mb-2 max-w-md">Tài khoản <strong>${email}</strong> không có quyền quản trị.</p>
            <p class="text-gray-500 mb-8 text-sm">Vui lòng sử dụng tài khoản: <strong>TruongKhoa231999@gmail.com</strong></p>
            <button id="re-login-btn" class="bg-primary-green text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all">
                Đăng nhập bằng tài khoản khác
            </button>
        </div>
    `;
    document.body.appendChild(deniedOverlay);
    document.getElementById('re-login-btn')?.addEventListener('click', () => {
        deniedOverlay.remove();
        showLoginUI();
    });
}

if (logoutBtn) {
    logoutBtn.onclick = () => {
        if (confirm('Bạn có muốn đăng xuất không?')) {
            signOut(auth).then(() => {
                window.location.reload();
            });
        }
    };
}

async function loadQuestions() {
    document.getElementById('login-overlay')?.remove();
    document.getElementById('access-denied-overlay')?.remove();
    if (questionsList) questionsList.innerHTML = '<div class="text-center py-12 text-gray-500">Đang tải câu hỏi...</div>';
    
    try {
        quizQuestions = await getQuestions();
        if (quizQuestions.length === 0) {
            console.log("No questions in Firestore, using defaults for display.");
            quizQuestions = defaultQuizData.map(q => ({ ...q, id: q.id.toString() }));
        }
        renderQuestions();
    } catch (error: any) {
        console.error("Error loading questions from Firebase, falling back to defaults:", error);
        quizQuestions = defaultQuizData.map(q => ({ ...q, id: q.id.toString() }));
        renderQuestions();
        
        // Show a warning that we're in offline/fallback mode
        showToast('Đang hiển thị dữ liệu mẫu (Lỗi kết nối Firebase)', '⚠️');
    }
}

function renderQuestions() {
    if (!questionsList) return;
    questionsList.innerHTML = '';
    if (totalQuestionsDisplay) totalQuestionsDisplay.textContent = quizQuestions.length.toString();

    quizQuestions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow';
        card.innerHTML = `
            <img src="${q.image}" class="w-full md:w-48 h-32 object-cover rounded-xl">
            <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg text-gray-800">${q.title}</h3>
                    <div class="flex space-x-2">
                        <button onclick="window.editQuestion(${index})" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onclick="window.deleteQuestion(${index})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </div>
                <p class="text-gray-700 mb-4 font-medium">${q.question}</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    ${q.options.map((opt, i) => `
                        <div class="flex items-center space-x-2 ${i == q.correct ? 'text-primary-green font-bold' : 'text-gray-500'}">
                            <span class="w-5 h-5 flex items-center justify-center rounded-full border border-current text-[10px]">${String.fromCharCode(65 + i)}</span>
                            <span>${opt}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        questionsList.appendChild(card);
    });
}

if (form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const index = parseInt(editIndexInput.value);
        const newQuestion: Omit<Question, 'id'> = {
            title: (document.getElementById('img-title') as HTMLInputElement).value,
            image: (document.getElementById('img-url') as HTMLInputElement).value,
            question: (document.getElementById('question-text') as HTMLTextAreaElement).value,
            options: [
                (document.getElementById('opt-0') as HTMLInputElement).value,
                (document.getElementById('opt-1') as HTMLInputElement).value,
                (document.getElementById('opt-2') as HTMLInputElement).value,
                (document.getElementById('opt-3') as HTMLInputElement).value
            ],
            correct: parseInt((document.getElementById('correct-opt') as HTMLSelectElement).value),
            explanation: (document.getElementById('explanation-text') as HTMLTextAreaElement).value
        };

        try {
            if (index >= 0) {
                const id = quizQuestions[index].id!;
                await updateQuestion(id, newQuestion);
                showToast('Cập nhật câu hỏi thành công! ✨');
            } else {
                await addQuestion(newQuestion);
                showToast('Đã tạo câu hỏi mới! 🚀');
            }
            loadQuestions();
            resetForm();
        } catch (error) {
            console.error("Error saving question:", error);
            showToast('Lỗi khi lưu câu hỏi.', '❌');
        }
    };
}

(window as any).editQuestion = (index: number) => {
    const q = quizQuestions[index];
    editIndexInput.value = index.toString();
    (document.getElementById('img-url') as HTMLInputElement).value = q.image;
    (document.getElementById('img-title') as HTMLInputElement).value = q.title;
    (document.getElementById('question-text') as HTMLTextAreaElement).value = q.question;
    (document.getElementById('opt-0') as HTMLInputElement).value = q.options[0];
    (document.getElementById('opt-1') as HTMLInputElement).value = q.options[1];
    (document.getElementById('opt-2') as HTMLInputElement).value = q.options[2];
    (document.getElementById('opt-3') as HTMLInputElement).value = q.options[3];
    (document.getElementById('correct-opt') as HTMLSelectElement).value = q.correct.toString();
    (document.getElementById('explanation-text') as HTMLTextAreaElement).value = q.explanation || '';

    if (formTitle) formTitle.textContent = 'Chỉnh sửa câu hỏi';
    if (submitBtn) submitBtn.textContent = 'Cập nhật câu hỏi';
    cancelBtn?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

(window as any).deleteQuestion = async (index: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
        try {
            const id = quizQuestions[index].id!;
            await deleteQuestionFromDb(id);
            loadQuestions();
            showToast('Đã xóa câu hỏi. 🗑️', '❌');
        } catch (error) {
            console.error("Error deleting question:", error);
            showToast('Lỗi khi xóa câu hỏi.', '❌');
        }
    }
};

if (cancelBtn) cancelBtn.onclick = resetForm;

if (syncBtn) {
    syncBtn.onclick = async () => {
        if (confirm('Bạn có muốn bổ sung thêm các câu hỏi mẫu mới vào hệ thống không? (Các câu hỏi đã tồn tại sẽ không bị trùng lặp)')) {
            syncBtn.classList.add('animate-pulse', 'opacity-50');
            (syncBtn as HTMLButtonElement).disabled = true;
            try {
                await migrateDefaultData(defaultQuizData, true);
                showToast('Đã đồng bộ câu hỏi mẫu thành công! ✨');
                loadQuestions();
            } catch (error) {
                console.error("Sync error:", error);
                showToast('Lỗi khi đồng bộ dữ liệu.', '❌');
            } finally {
                syncBtn.classList.remove('animate-pulse', 'opacity-50');
                (syncBtn as HTMLButtonElement).disabled = false;
            }
        }
    };
}

function resetForm() {
    form.reset();
    editIndexInput.value = "-1";
    if (formTitle) formTitle.textContent = 'Tạo câu hỏi mới';
    if (submitBtn) submitBtn.textContent = 'Tạo câu hỏi';
    cancelBtn?.classList.add('hidden');
}

function showToast(msg: string, icon = '✅') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');
    
    if (toastMsg) toastMsg.textContent = msg;
    if (toastIcon) toastIcon.textContent = icon;
    
    toast?.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast?.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
        try {
            const errInfo = JSON.parse(event.error.message);
            if (errInfo.error && errInfo.operationType) {
                console.error("Firestore Error Details:", errInfo);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl max-w-md w-full';
                errorDiv.innerHTML = `
                    <div class="flex items-start space-x-3">
                        <span class="text-2xl">⚠️</span>
                        <div>
                            <h3 class="font-bold">Lỗi quản trị dữ liệu</h3>
                            <p class="text-sm opacity-90">${errInfo.error}</p>
                            <p class="text-xs mt-2 opacity-75">Thao tác: ${errInfo.operationType} | Đường dẫn: ${errInfo.path}</p>
                            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="mt-3 text-xs font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1 rounded">Đóng</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(errorDiv);
            }
        } catch (e) {
            // Not a JSON error, ignore
        }
    }
});
