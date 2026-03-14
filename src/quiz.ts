import { getQuestions } from './services/firestoreService';
import { defaultQuizData } from './data/defaultData';

let quizData: any[] = [];
let currentScore = 0;
let answeredQuestions = new Set();
let timerInterval: any;
const TIME_LIMIT = 30;

const galleryGrid = document.getElementById('gallery-grid');
const modal = document.getElementById('quiz-modal');
const modalContent = document.getElementById('modal-content');
const scoreDisplay = document.getElementById('current-score');
const progressDisplay = document.getElementById('progress-counter');
const resultSection = document.getElementById('result-section');

async function initGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">Đang tải câu hỏi...</div>';
    
    try {
        quizData = await getQuestions();
        
        if (quizData.length === 0) {
            console.log("No questions in Firestore, using defaults.");
            quizData = defaultQuizData.map(q => ({ ...q, id: q.id.toString() }));
        }
    } catch (error: any) {
        console.error("Error loading questions from Firebase, falling back to defaults:", error);
        quizData = defaultQuizData.map(q => ({ ...q, id: q.id.toString() }));
    }

    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    
    if (quizData.length === 0) {
        galleryGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 mb-4">Chưa có câu hỏi nào trong hệ thống.</p>
                <a href="admin.html" class="text-primary-green font-bold hover:underline">Đến trang Quản lý để thêm câu hỏi →</a>
            </div>
        `;
        return;
    }

    if (progressDisplay) {
        progressDisplay.textContent = `0 / ${quizData.length}`;
    }

    quizData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300';
        galleryItem.id = `quiz-item-${index}`;
        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                <span class="font-bold text-lg mb-2">${item.title}</span>
                <span class="bg-primary-orange px-4 py-1 rounded-full text-sm font-bold">Làm Quiz 📝</span>
            </div>
            <div class="absolute top-4 right-4 bg-white/90 text-primary-green rounded-full p-2 opacity-0 transition-opacity" id="check-${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
        `;
        galleryItem.onclick = () => openQuiz(index);
        galleryGrid.appendChild(galleryItem);
    });
}

function openQuiz(index: number) {
    if (answeredQuestions.has(index)) {
        return;
    }

    const item = quizData[index];
    let timeLeft = TIME_LIMIT;

    if (modalContent) {
        modalContent.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <span class="text-xl">⏱️</span>
                        <span class="text-sm font-bold text-gray-500 uppercase tracking-wider">Thời gian còn lại</span>
                    </div>
                    <div id="timer-display" class="text-2xl font-bold text-primary-orange">${timeLeft}s</div>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div id="timer-bar" class="bg-primary-orange h-full transition-all duration-1000 ease-linear" style="width: 100%"></div>
                </div>
                <img src="${item.image}" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="text-xl font-bold text-gray-800">${item.question}</h3>
                <div class="grid grid-cols-1 gap-3">
                    ${item.options.map((option, i) => `
                        <button onclick="window.checkAnswer(${index}, ${i})" class="w-full text-left p-4 rounded-lg border-2 border-gray-100 hover:border-primary-green hover:bg-green-50 transition-all font-medium">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');

    // Start Timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        const timerDisplay = document.getElementById('timer-display');
        const timerBar = document.getElementById('timer-bar');
        
        if (timerDisplay) {
            timerDisplay.textContent = `${timeLeft}s`;
            if (timeLeft <= 10) {
                timerDisplay.classList.add('text-red-500', 'animate-pulse');
                timerDisplay.classList.remove('text-primary-orange');
            }
        }
        
        if (timerBar) {
            timerBar.style.width = `${(timeLeft / TIME_LIMIT) * 100}%`;
            if (timeLeft <= 10) {
                timerBar.classList.add('bg-red-500');
                timerBar.classList.remove('bg-primary-orange');
            }
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            (window as any).checkAnswer(index, -1); // Timeout case
        }
    }, 1000);
}

(window as any).checkAnswer = function(questionIndex: number, selectedIndex: number) {
    clearInterval(timerInterval);
    const item = quizData[questionIndex];
    const buttons = modalContent?.querySelectorAll('button');
    
    answeredQuestions.add(questionIndex);
    
    // Update progress
    if (progressDisplay) {
        progressDisplay.textContent = `${answeredQuestions.size} / ${quizData.length}`;
    }

    // Mark gallery item as completed
    const checkIcon = document.getElementById(`check-${questionIndex}`);
    if (checkIcon) checkIcon.classList.remove('opacity-0');
    
    buttons?.forEach((btn, i) => {
        (btn as HTMLButtonElement).disabled = true;
        if (i === parseInt(item.correct as any)) {
            btn.classList.add('bg-green-500', 'text-white', 'border-green-500');
            btn.classList.remove('hover:border-primary-green', 'hover:bg-green-50');
        } else if (i === selectedIndex) {
            btn.classList.add('bg-red-500', 'text-white', 'border-red-500');
        }
    });

    const feedback = document.createElement('div');
    feedback.className = 'mt-6 p-4 rounded-lg bg-gray-50 border-l-4 border-primary-orange';
    
    if (selectedIndex === parseInt(item.correct as any)) {
        currentScore += 10;
        if (scoreDisplay) scoreDisplay.textContent = currentScore.toString();
        feedback.innerHTML = `<p class="font-bold text-green-600">Chính xác! 🎉</p><p class="text-gray-600 mt-1">${item.explanation}</p>`;
    } else if (selectedIndex === -1) {
        feedback.innerHTML = `<p class="font-bold text-red-600">Hết thời gian! ⏰</p><p class="text-gray-600 mt-1">${item.explanation}</p>`;
    } else {
        feedback.innerHTML = `<p class="font-bold text-red-600">Chưa đúng. 🌊</p><p class="text-gray-600 mt-1">${item.explanation}</p>`;
    }
    
    modalContent?.appendChild(feedback);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'mt-6 w-full bg-primary-orange text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors';
    closeBtn.textContent = 'Tiếp tục';
    closeBtn.onclick = () => {
        closeModal();
        checkGameEnd();
    };
    modalContent?.appendChild(closeBtn);
}

function checkGameEnd() {
    if (answeredQuestions.size === quizData.length) {
        showResults();
    }
}

function showResults() {
    if (!resultSection) return;
    
    const maxScore = quizData.length * 10;
    const percentage = (currentScore / maxScore) * 100;
    let message = "";
    
    if (percentage >= 80) {
        message = "Tuyệt vời! Đại dương cần những người như bạn để bảo vệ nó. Bạn là một Người gác đền Đại dương thực thụ! 🔱";
    } else if (percentage >= 50) {
        message = "Nỗ lực tốt! Bạn có hiểu biết khá tốt về các vấn đề đại dương, nhưng vẫn còn nhiều điều để học hỏi. 🌊";
    } else {
        message = "Hãy tiếp tục học hỏi! Mỗi chút kiến thức đều giúp ích trong cuộc chiến cứu lấy đại dương của chúng ta. 🐠";
    }

    resultSection.innerHTML = `
        <div class="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-2xl mx-auto border-4 border-primary-green">
            <div class="text-6xl mb-6">🏆</div>
            <h2 class="text-4xl font-bold mb-4 text-gray-900">Hoàn thành Quiz!</h2>
            <div class="text-5xl font-bold text-primary-green mb-6">${currentScore} / ${maxScore}</div>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">${message}</p>
            <button onclick="window.resetGame()" class="bg-primary-orange hover:bg-orange-600 text-white px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl">
                Chơi lại 🔄
            </button>
        </div>
    `;
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

(window as any).resetGame = function() {
    currentScore = 0;
    answeredQuestions.clear();
    if (scoreDisplay) scoreDisplay.textContent = '0';
    if (progressDisplay) progressDisplay.textContent = `0 / ${quizData.length}`;
    if (resultSection) resultSection.classList.add('hidden');
    initGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeModal() {
    clearInterval(timerInterval);
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
}

(window as any).closeModal = closeModal;

if (modal) {
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
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
                            <h3 class="font-bold">Lỗi truy cập dữ liệu</h3>
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

document.addEventListener('DOMContentLoaded', initGallery);
