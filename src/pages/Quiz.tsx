import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getQuestions, ensureQuestionsExist } from '../services/firestoreService';
import { defaultQuizData } from '../data/defaultData';

interface QuizItem {
    id: string;
    title: string;
    image: string;
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
}

export default function Quiz() {
    const [quizData, setQuizData] = useState<QuizItem[]>([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [showResult, setShowResult] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const TIME_LIMIT = 30;

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const questions = await ensureQuestionsExist(defaultQuizData);
                setQuizData(
                    questions && questions.length > 0
                        ? questions
                        : defaultQuizData.map((q) => ({ ...q, id: q.id.toString() }))
                );
            } catch (error) {
                console.error('Error loading questions:', error);
                setQuizData(defaultQuizData.map((q) => ({ ...q, id: q.id.toString() })));
            }
        };

        loadQuestions();
    }, []);

    const startTimer = () => {
        setTimeLeft(TIME_LIMIT);
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleTimeout = () => {
        checkAnswer(-1);
    };

    const checkAnswer = (selectedIndex: number) => {
        if (selectedQuizIndex === null) return;

        const item = quizData[selectedQuizIndex];
        const newAnswered = new Set(answeredQuestions);
        newAnswered.add(selectedQuizIndex);
        setAnsweredQuestions(newAnswered);

        if (selectedIndex === item.correct) {
            setCurrentScore((prev) => prev + 10);
        }

        if (timerRef.current) clearInterval(timerRef.current);

        // Auto proceed after 2 seconds
        setTimeout(() => {
            if (newAnswered.size === quizData.length) {
                showResults();
            } else {
                setSelectedQuizIndex(null);
            }
        }, 2000);
    };

    const showResults = () => {
        setShowResult(true);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const resetGame = () => {
        setCurrentScore(0);
        setAnsweredQuestions(new Set());
        setSelectedQuizIndex(null);
        setShowResult(false);
    };

    if (quizData.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Đang tải câu hỏi...</p>
            </div>
        );
    }

    if (showResult) {
        const maxScore = quizData.length * 10;
        const percentage = (currentScore / maxScore) * 100;
        let message = '';

        if (percentage >= 80) {
            message = 'Tuyệt vời! Đại dương cần những người như bạn để bảo vệ nó. Bạn là một Người gác đền Đại dương thực thụ! 🔱';
        } else if (percentage >= 50) {
            message =
                'Nỗ lực tốt! Bạn có hiểu biết khá tốt về các vấn đề đại dương, nhưng vẫn còn nhiều điều để học hỏi. 🌊';
        } else {
            message =
                'Hãy tiếp tục học hỏi! Mỗi chút kiến thức đều giúp ích trong cuộc chiến cứu lấy đại dương của chúng ta. 🐠';
        }

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            <div className="flex items-center space-x-2">
                                <span className="text-3xl">🌊</span>
                                <span className="text-2xl font-bold tracking-tight text-green-500">OceanGuard</span>
                            </div>
                            <div className="hidden md:flex space-x-8 font-medium">
                                <Link to="/" className="hover:text-green-500 transition-colors">
                                    Trang chủ
                                </Link>
                                <Link to="/quiz" className="text-green-500 font-bold transition-colors">
                                    Trò chơi Quiz
                                </Link>
                                <Link to="/admin" className="hover:text-green-500 transition-colors">
                                    Quản lý câu hỏi
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <section className="py-24">
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        <div className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-green-500">
                            <div className="text-6xl mb-6">🏆</div>
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">Hoàn thành Quiz!</h2>
                            <div className="text-5xl font-bold text-green-500 mb-6">
                                {currentScore} / {maxScore}
                            </div>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{message}</p>
                            <button
                                onClick={resetGame}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl"
                            >
                                Chơi lại 🔄
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl">🌊</span>
                            <span className="text-2xl font-bold tracking-tight text-green-500">OceanGuard</span>
                        </div>
                        <div className="hidden md:flex space-x-8 font-medium">
                            <Link to="/" className="hover:text-green-500 transition-colors">
                                Trang chủ
                            </Link>
                            <Link to="/quiz" className="text-green-500 font-bold transition-colors">
                                Trò chơi Quiz
                            </Link>
                            <Link to="/admin" className="hover:text-green-500 transition-colors">
                                Quản lý câu hỏi
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Trắc Nghiệm Bảo Vệ Đại Dương</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Kiểm tra kiến thức của bạn và học cách bảo vệ đại dương. Nhấp vào mỗi hình ảnh để xem câu hỏi. Bạn có thể
                        trả lời hết không?
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                            <span className="text-xs uppercase font-bold text-green-500 block">Tiến độ</span>
                            <span className="text-xl font-bold text-green-500">
                                {answeredQuestions.size} / {quizData.length}
                            </span>
                        </div>
                    </div>
                    <div className="bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20">
                        <span className="text-xs uppercase font-bold text-orange-500 block">Điểm số</span>
                        <span className="text-xl font-bold text-orange-500">{currentScore}</span>
                    </div>
                </div>
            </div>

            {/* Quiz Game Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {selectedQuizIndex === null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {quizData.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedQuizIndex(index);
                                        startTimer();
                                    }}
                                    className={`relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${answeredQuestions.has(index) ? 'opacity-60' : ''
                                        }`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                                        <span className="font-bold text-lg mb-2">{item.title}</span>
                                        <span className="bg-orange-500 px-4 py-1 rounded-full text-sm font-bold">
                                            Làm Quiz 📝
                                        </span>
                                    </div>
                                    {answeredQuestions.has(index) && (
                                        <div className="absolute top-4 right-4 bg-white/90 text-green-500 rounded-full p-2">
                                            <span className="text-2xl">✓</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl">⏱️</span>
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Thời gian còn lại</span>
                                    </div>
                                    <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-orange-500'}`}>
                                        {timeLeft}s
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-6">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 10 ? 'bg-red-500' : 'bg-orange-500'
                                            }`}
                                        style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
                                    ></div>
                                </div>

                                <img
                                    src={quizData[selectedQuizIndex].image}
                                    className="w-full h-48 object-cover rounded-lg mb-6"
                                    alt=""
                                />

                                <h3 className="text-xl font-bold text-gray-800 mb-6">{quizData[selectedQuizIndex].question}</h3>

                                <div className="grid grid-cols-1 gap-3">
                                    {quizData[selectedQuizIndex].options.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() => checkAnswer(i)}
                                            className="w-full text-left p-4 rounded-lg border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all font-medium"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
