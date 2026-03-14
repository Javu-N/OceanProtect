const defaultQuizData = [
    {
        id: 1,
        title: "Chai nhựa",
        image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=800",
        question: "Loại rác thải nào phổ biến nhất trong đại dương?",
        options: ["Rác thải nhựa", "Thủy tinh", "Gỗ", "Giấy"],
        correct: 0,
        explanation: "Rác thải nhựa là loại mảnh vụn biển phổ biến nhất được tìm thấy trong đại dương của chúng ta ngày nay."
    },
    {
        id: 2,
        title: "Bãi biển ô nhiễm",
        image: "https://phapluat.tuoitrethudo.com.vn/stores/news_dataimages/tongduytan/112020/07/09/in_article/3555_3444_Dam_lam_muoi__Sa_Huynh_Quang_Ngai_2018_.jpg?rt=20201107093557",
        question: "Một chai nhựa có thể mất bao lâu để phân hủy trong đại dương?",
        options: ["10 năm", "50 năm", "450 năm", "5 năm"],
        correct: 2,
        explanation: "Chai nhựa có thể mất tới 450 năm để phân hủy, và ngay cả khi đó, chúng chỉ trở thành vi nhựa."
    },
    {
        id: 3,
        title: "Lưới ma",
        image: "https://images.unsplash.com/photo-1591139039938-085750849319?auto=format&fit=crop&q=80&w=800",
        question: "'Lưới ma' trong đại dương là gì?",
        options: ["Lưới làm bằng lụa", "Lưới đánh cá bị bỏ rơi", "Rong biển tự nhiên", "Mạng nhện"],
        correct: 1,
        explanation: "Lưới ma là những tấm lưới đánh cá bị bỏ lại hoặc bị mất trong đại dương, tiếp tục bẫy và giết chết sinh vật biển."
    },
    {
        id: 4,
        title: "Tràn dầu",
        image: "https://vibienxanh.vn/upload/2017/09/26/Tran%20dau%20BP_Reuters.jpg",
        question: "Các vụ tràn dầu chủ yếu ảnh hưởng đến chim biển như thế nào?",
        options: ["Chúng đổi màu", "Chúng lớn nhanh hơn", "Lông mất khả năng cách nhiệt", "Chúng ngừng hót"],
        correct: 2,
        explanation: "Dầu phá hủy khả năng cách nhiệt của động vật có vú có lông và khả năng chống nước của lông chim."
    },
    {
        id: 5,
        title: "Vi nhựa",
        image: "https://images.unsplash.com/photo-1625244695851-1fc873f942bc?auto=format&fit=crop&q=80&w=800",
        question: "Kích thước tối đa của một 'vi nhựa' là bao nhiêu?",
        options: ["10 cm", "5 mm", "1 mét", "50 cm"],
        correct: 1,
        explanation: "Vi nhựa được định nghĩa là các hạt nhựa có đường kính nhỏ hơn 5 mm."
    },
    {
        id: 6,
        title: "Rạn san hô",
        image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=800",
        question: "Hiện tượng 'tẩy trắng san hô' là do nguyên nhân nào chủ yếu?",
        options: ["Nước biển quá lạnh", "Nước biển quá mặn", "Nhiệt độ nước biển tăng cao", "Cá ăn san hô"],
        correct: 2,
        explanation: "Biến đổi khí hậu làm nhiệt độ đại dương tăng lên, khiến san hô trục xuất tảo cộng sinh, dẫn đến hiện tượng tẩy trắng."
    },
    {
        id: 7,
        title: "Rùa biển",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
        question: "Rùa biển thường nhầm lẫn túi nhựa với loại thức ăn nào?",
        options: ["Sứa", "Cua", "Tảo biển", "Cá con"],
        correct: 0,
        explanation: "Túi nhựa trôi nổi trong nước trông rất giống sứa, món ăn yêu thích của nhiều loài rùa biển."
    },
    {
        id: 8,
        title: "Vùng chết",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800",
        question: "'Vùng chết' (Dead Zone) trong đại dương là gì?",
        options: ["Nơi có nhiều cá mập", "Nơi không có oxy cho sinh vật sống", "Nơi có nhiều xác tàu đắm", "Nơi nước biển bị đóng băng"],
        correct: 1,
        explanation: "Vùng chết là những khu vực có nồng độ oxy cực thấp do ô nhiễm chất dinh dưỡng, khiến sinh vật biển không thể tồn tại."
    },
    {
        id: 9,
        title: "Cá voi",
        image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80&w=800",
        question: "Tiếng ồn từ tàu thuyền ảnh hưởng thế nào đến cá voi?",
        options: ["Giúp chúng bơi nhanh hơn", "Làm chúng vui vẻ", "Gây nhiễu khả năng giao tiếp và định vị", "Không ảnh hưởng gì"],
        correct: 2,
        explanation: "Ô nhiễm tiếng ồn từ hoạt động của con người làm gián đoạn khả năng sử dụng sóng âm để tìm thức ăn và bạn tình của cá voi."
    },
    {
        id: 10,
        title: "Rừng ngập mặn",
        image: "https://images.unsplash.com/photo-1584564509170-014389030995?auto=format&fit=crop&q=80&w=800",
        question: "Rừng ngập mặn giúp bảo vệ đại dương như thế nào?",
        options: ["Lọc chất ô nhiễm và bảo vệ bờ biển", "Làm nước biển ngọt hơn", "Cung cấp gỗ để đóng tàu", "Ngăn chặn sóng thần hoàn toàn"],
        correct: 0,
        explanation: "Rừng ngập mặn đóng vai trò như bộ lọc tự nhiên cho các chất ô nhiễm và bảo vệ vùng ven biển khỏi xói mòn."
    },
    {
        id: 11,
        title: "Axit hóa đại dương",
        image: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&q=80&w=800",
        question: "Đại dương hấp thụ khí nào dẫn đến hiện tượng axit hóa?",
        options: ["Oxy", "Nitơ", "Carbon Dioxide (CO2)", "Helium"],
        correct: 2,
        explanation: "Đại dương hấp thụ khoảng 30% lượng CO2 do con người thải ra, làm thay đổi độ pH của nước biển."
    },
    {
        id: 12,
        title: "Ống hút nhựa",
        image: "https://images.unsplash.com/photo-1591872203444-2c391d103965?auto=format&fit=crop&q=80&w=800",
        question: "Tại sao nhiều nơi cấm sử dụng ống hút nhựa dùng một lần?",
        options: ["Vì chúng quá đắt", "Vì chúng khó sản xuất", "Vì chúng nhỏ và dễ bị động vật biển nuốt phải", "Vì chúng làm nước có vị lạ"],
        correct: 2,
        explanation: "Ống hút nhựa nhỏ, nhẹ và dễ dàng lọt vào mũi hoặc dạ dày của các sinh vật biển như rùa."
    }
];

// Load quiz data from LocalStorage or use defaults
function getQuizData() {
    const storedData = localStorage.getItem('oceanQuizQuestions');
    if (storedData) {
        return JSON.parse(storedData);
    }
    // If no data in LocalStorage, initialize with defaults
    localStorage.setItem('oceanQuizQuestions', JSON.stringify(defaultQuizData));
    return defaultQuizData;
}

let quizData = getQuizData();
let currentScore = 0;
let answeredQuestions = new Set();
let timerInterval;
const TIME_LIMIT = 30;

const galleryGrid = document.getElementById('gallery-grid');
const modal = document.getElementById('quiz-modal');
const modalContent = document.getElementById('modal-content');
const scoreDisplay = document.getElementById('current-score');
const progressDisplay = document.getElementById('progress-counter');
const resultSection = document.getElementById('result-section');

function initGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    quizData = getQuizData(); // Refresh data
    
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

function openQuiz(index) {
    if (answeredQuestions.has(index)) {
        return;
    }

    const item = quizData[index];
    let timeLeft = TIME_LIMIT;

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
                    <button onclick="checkAnswer(${index}, ${i})" class="w-full text-left p-4 rounded-lg border-2 border-gray-100 hover:border-primary-green hover:bg-green-50 transition-all font-medium">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

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
            window.checkAnswer(index, -1); // Timeout case
        }
    }, 1000);
}

window.checkAnswer = function(questionIndex, selectedIndex) {
    clearInterval(timerInterval);
    const item = quizData[questionIndex];
    const buttons = modalContent.querySelectorAll('button');
    
    answeredQuestions.add(questionIndex);
    
    // Update progress
    if (progressDisplay) {
        progressDisplay.textContent = `${answeredQuestions.size} / ${quizData.length}`;
    }

    // Mark gallery item as completed
    const checkIcon = document.getElementById(`check-${questionIndex}`);
    if (checkIcon) checkIcon.classList.remove('opacity-0');
    
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === parseInt(item.correct)) {
            btn.classList.add('bg-green-500', 'text-white', 'border-green-500');
            btn.classList.remove('hover:border-primary-green', 'hover:bg-green-50');
        } else if (i === selectedIndex) {
            btn.classList.add('bg-red-500', 'text-white', 'border-red-500');
        }
    });

    const feedback = document.createElement('div');
    feedback.className = 'mt-6 p-4 rounded-lg bg-gray-50 border-l-4 border-primary-orange';
    
    if (selectedIndex === parseInt(item.correct)) {
        currentScore += 10;
        if (scoreDisplay) scoreDisplay.textContent = currentScore;
        feedback.innerHTML = `<p class="font-bold text-green-600">Chính xác! 🎉</p><p class="text-gray-600 mt-1">${item.explanation}</p>`;
    } else if (selectedIndex === -1) {
        feedback.innerHTML = `<p class="font-bold text-red-600">Hết thời gian! ⏰</p><p class="text-gray-600 mt-1">${item.explanation}</p>`;
    } else {
        feedback.innerHTML = `<p class="font-bold text-red-600">Chưa đúng. 🌊</p><p class="text-gray-600 mt-1">${item.explanation}</p>`;
    }
    
    modalContent.appendChild(feedback);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'mt-6 w-full bg-primary-orange text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors';
    closeBtn.textContent = 'Tiếp tục';
    closeBtn.onclick = () => {
        closeModal();
        checkGameEnd();
    };
    modalContent.appendChild(closeBtn);
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
            <button onclick="resetGame()" class="bg-primary-orange hover:bg-orange-600 text-white px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl">
                Chơi lại 🔄
            </button>
        </div>
    `;
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

window.resetGame = function() {
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
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

modal.onclick = (e) => {
    if (e.target === modal) closeModal();
};

document.addEventListener('DOMContentLoaded', initGallery);
