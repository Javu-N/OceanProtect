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
        image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fbe5e?auto=format&fit=crop&q=80&w=800",
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
        image: "https://images.unsplash.com/photo-1620206343767-7da98185edd4?auto=format&fit=crop&q=80&w=800",
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

let quizQuestions = [];

const form = document.getElementById('question-form');
const questionsList = document.getElementById('questions-list');
const totalQuestionsDisplay = document.getElementById('total-questions');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const editIndexInput = document.getElementById('edit-index');

// Load data
function loadQuestions() {
    const storedData = localStorage.getItem('oceanQuizQuestions');
    if (storedData) {
        quizQuestions = JSON.parse(storedData);
    } else {
        quizQuestions = [...defaultQuizData];
        saveToStorage();
    }
    renderQuestions();
}

function saveToStorage() {
    localStorage.setItem('oceanQuizQuestions', JSON.stringify(quizQuestions));
    totalQuestionsDisplay.textContent = quizQuestions.length;
}

function renderQuestions() {
    questionsList.innerHTML = '';
    totalQuestionsDisplay.textContent = quizQuestions.length;

    quizQuestions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow';
        card.innerHTML = `
            <img src="${q.image}" class="w-full md:w-48 h-32 object-cover rounded-xl">
            <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg text-gray-800">${q.title}</h3>
                    <div class="flex space-x-2">
                        <button onclick="editQuestion(${index})" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onclick="deleteQuestion(${index})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
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

form.onsubmit = (e) => {
    e.preventDefault();
    
    const index = parseInt(editIndexInput.value);
    const newQuestion = {
        id: index >= 0 ? quizQuestions[index].id : Date.now(),
        title: document.getElementById('img-title').value,
        image: document.getElementById('img-url').value,
        question: document.getElementById('question-text').value,
        options: [
            document.getElementById('opt-0').value,
            document.getElementById('opt-1').value,
            document.getElementById('opt-2').value,
            document.getElementById('opt-3').value
        ],
        correct: parseInt(document.getElementById('correct-opt').value),
        explanation: document.getElementById('explanation-text').value
    };

    if (index >= 0) {
        quizQuestions[index] = newQuestion;
        showToast('Cập nhật câu hỏi thành công! ✨');
    } else {
        quizQuestions.push(newQuestion);
        showToast('Đã tạo câu hỏi mới! 🚀');
    }

    saveToStorage();
    renderQuestions();
    resetForm();
};

window.editQuestion = (index) => {
    const q = quizQuestions[index];
    editIndexInput.value = index;
    document.getElementById('img-url').value = q.image;
    document.getElementById('img-title').value = q.title;
    document.getElementById('question-text').value = q.question;
    document.getElementById('opt-0').value = q.options[0];
    document.getElementById('opt-1').value = q.options[1];
    document.getElementById('opt-2').value = q.options[2];
    document.getElementById('opt-3').value = q.options[3];
    document.getElementById('correct-opt').value = q.correct;
    document.getElementById('explanation-text').value = q.explanation || '';

    formTitle.textContent = 'Chỉnh sửa câu hỏi';
    submitBtn.textContent = 'Cập nhật câu hỏi';
    cancelBtn.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteQuestion = (index) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
        quizQuestions.splice(index, 1);
        saveToStorage();
        renderQuestions();
        showToast('Đã xóa câu hỏi. 🗑️', '❌');
    }
};

cancelBtn.onclick = resetForm;

function resetForm() {
    form.reset();
    editIndexInput.value = -1;
    formTitle.textContent = 'Tạo câu hỏi mới';
    submitBtn.textContent = 'Tạo câu hỏi';
    cancelBtn.classList.add('hidden');
}

function showToast(msg, icon = '✅') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');
    
    toastMsg.textContent = msg;
    toastIcon.textContent = icon;
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', loadQuestions);
