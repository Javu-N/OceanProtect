import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import {
    getQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestionFromDb,
    migrateDefaultData,
    ensureQuestionsExist,
    Question,
} from '../services/firestoreService';
import { defaultQuizData } from '../data/defaultData';

export default function Admin() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [toastMsg, setToastMsg] = useState('');
    const [toastIcon, setToastIcon] = useState('✅');
    const [isSyncing, setIsSyncing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        question: '',
        options: ['', '', '', ''],
        correct: '0',
        explanation: '',
    });

    const ADMIN_EMAIL = 'TruongKhoa231999@gmail.com'.toLowerCase();

    // Auth check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            if (user) {
                const userEmail = (user.email || '').toLowerCase();
                if (userEmail === ADMIN_EMAIL) {
                    loadQuestions();
                } else {
                    console.warn('Access denied for:', userEmail);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const loadQuestions = async () => {
        try {
            const questions = await ensureQuestionsExist(defaultQuizData);
            setQuizQuestions(questions && questions.length > 0
                ? questions
                : defaultQuizData.map((q) => ({ ...q, id: q.id.toString() }))
            );
        } catch (error) {
            console.error('Error loading questions:', error);
            setQuizQuestions(defaultQuizData.map((q) => ({ ...q, id: q.id.toString() })));
            showToast('Lỗi kết nối Firebase, hiển thị dữ liệu mẫu', '⚠️');
        }
    };

    const showToast = (msg: string, icon = '✅') => {
        setToastMsg(msg);
        setToastIcon(icon);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.currentTarget;
        if (id.startsWith('opt-')) {
            const idx = parseInt(id.split('-')[1]);
            const newOptions = [...formData.options];
            newOptions[idx] = value;
            setFormData({ ...formData, options: newOptions });
        } else if (id === 'image') {
            setFormData({ ...formData, image: value });
        } else if (id === 'title') {
            setFormData({ ...formData, title: value });
        } else if (id === 'question') {
            setFormData({ ...formData, question: value });
        } else if (id === 'correct') {
            setFormData({ ...formData, correct: value });
        } else if (id === 'explanation') {
            setFormData({ ...formData, explanation: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newQuestion: Omit<Question, 'id'> = {
            title: formData.title,
            image: formData.image,
            question: formData.question,
            options: formData.options,
            correct: parseInt(formData.correct),
            explanation: formData.explanation,
        };

        try {
            if (isEditing && editingIndex >= 0) {
                const id = quizQuestions[editingIndex].id!;
                await updateQuestion(id, newQuestion);
                showToast('Cập nhật câu hỏi thành công! ✨');
            } else {
                await addQuestion(newQuestion);
                showToast('Đã tạo câu hỏi mới! 🚀');
            }
            loadQuestions();
            resetForm();
        } catch (error) {
            console.error('Error saving question:', error);
            showToast('Lỗi khi lưu câu hỏi.', '❌');
        }
    };

    const handleEdit = (index: number) => {
        const q = quizQuestions[index];
        setFormData({
            title: q.title,
            image: q.image,
            question: q.question,
            options: q.options,
            correct: q.correct.toString(),
            explanation: q.explanation || '',
        });
        setIsEditing(true);
        setEditingIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (index: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
            try {
                const id = quizQuestions[index].id!;
                await deleteQuestionFromDb(id);
                loadQuestions();
                showToast('Đã xóa câu hỏi. 🗑️', '❌');
            } catch (error) {
                console.error('Error deleting question:', error);
                showToast('Lỗi khi xóa câu hỏi.', '❌');
            }
        }
    };

    const handleSync = async () => {
        if (confirm('Bạn có muốn bổ sung thêm các câu hỏi mẫu mới vào hệ thống không?')) {
            setIsSyncing(true);
            try {
                await migrateDefaultData(defaultQuizData, true);
                showToast('Đã đồng bộ câu hỏi mẫu thành công! ✨');
                loadQuestions();
            } catch (error) {
                console.error('Sync error:', error);
                showToast('Lỗi khi đồng bộ dữ liệu.', '❌');
            } finally {
                setIsSyncing(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            image: '',
            question: '',
            options: ['', '', '', ''],
            correct: '0',
            explanation: '',
        });
        setIsEditing(false);
        setEditingIndex(-1);
    };

    const handleLogout = () => {
        if (confirm('Bạn có muốn đăng xuất không?')) {
            signOut(auth);
        }
    };

    if (!currentUser) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
                <div className="animate-fade-in">
                    <span className="text-6xl mb-6 block">🌊</span>
                    <h1 className="text-3xl font-bold mb-4">Quản Trị OceanGuard</h1>
                    <p className="text-gray-600 mb-8 max-w-md">Vui lòng đăng nhập bằng tài khoản Admin để quản lý câu hỏi.</p>
                    <button
                        onClick={async () => {
                            try {
                                const provider = new GoogleAuthProvider();
                                await signInWithPopup(auth, provider);
                            } catch (err: any) {
                                console.error('Login error:', err);
                                alert('Đăng nhập thất bại: ' + err.message);
                            }
                        }}
                        className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all"
                    >
                        Đăng nhập với Google
                    </button>
                </div>
            </div>
        );
    }

    const userEmail = (currentUser.email || '').toLowerCase();
    const isAdmin = userEmail === ADMIN_EMAIL;

    if (!isAdmin) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
                <span className="text-6xl mb-6 block">🚫</span>
                <h1 className="text-3xl font-bold mb-4 text-red-600">Truy cập bị từ chối</h1>
                <p className="text-gray-600 mb-2 max-w-md">
                    Tài khoản <strong>{userEmail}</strong> không có quyền quản trị.
                </p>
                <p className="text-gray-500 mb-8 text-sm">
                    Vui lòng sử dụng tài khoản: <strong>TruongKhoa231999@gmail.com</strong>
                </p>
                <button
                    onClick={handleLogout}
                    className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all"
                >
                    Đăng nhập bằng tài khoản khác
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
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
                            <Link to="/quiz" className="hover:text-green-500 transition-colors">
                                Trò chơi Quiz
                            </Link>
                            <Link to="/admin" className="text-green-500 font-bold transition-colors">
                                Quản lý câu hỏi
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Toast */}
            {toastMsg && (
                <div
                    className="fixed bottom-8 right-8 bg-white p-4 rounded-xl shadow-xl border border-gray-200 flex items-center space-x-3 z-40
            translate-y-0 opacity-100 transition-all duration-300"
                >
                    <span className="text-2xl">{toastIcon}</span>
                    <p className="font-medium">{toastMsg}</p>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Quản Lý Câu Hỏi Trò Chơi</h1>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center space-x-2 border border-red-100"
                        >
                            <span>🚪</span>
                            <span className="text-sm">Đăng xuất</span>
                        </button>
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`${isSyncing ? 'opacity-50' : ''
                                } bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center space-x-2 border border-blue-100`}
                        >
                            <span>🔄</span>
                            <span className="text-sm">Đồng bộ mẫu</span>
                        </button>
                        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
                            <span className="text-gray-500 text-sm uppercase font-bold tracking-wider">Tổng số câu hỏi</span>
                            <div className="text-3xl font-bold text-green-500">{quizQuestions.length}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="text-2xl font-bold mb-6">
                                {isEditing ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">URL hình ảnh</label>
                                    <input
                                        type="url"
                                        id="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề hình ảnh</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ví dụ: Chai nhựa trôi nổi"
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nội dung câu hỏi</label>
                                    <textarea
                                        id="question"
                                        value={formData.question}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        placeholder="Nhập câu hỏi tại đây..."
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    ></textarea>
                                </div>

                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i}>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Đáp án {String.fromCharCode(65 + i)}
                                        </label>
                                        <input
                                            type="text"
                                            id={`opt-${i}`}
                                            value={formData.options[i]}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Đáp án đúng</label>
                                    <select
                                        id="correct"
                                        value={formData.correct}
                                        onChange={handleInputChange}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    >
                                        {[0, 1, 2, 3].map((i) => (
                                            <option key={i} value={i}>
                                                Đáp án {String.fromCharCode(65 + i)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Giải thích</label>
                                    <textarea
                                        id="explanation"
                                        value={formData.explanation}
                                        onChange={handleInputChange}
                                        rows={2}
                                        placeholder="Giải thích câu trả lời..."
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                                >
                                    {isEditing ? 'Cập nhật câu hỏi' : 'Tạo câu hỏi'}
                                </button>

                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Questions List Section */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {quizQuestions.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>Chưa có câu hỏi nào.</p>
                                </div>
                            ) : (
                                quizQuestions.map((q, index) => (
                                    <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-4 flex-1">
                                                <img src={q.image} alt={q.title} className="w-32 h-24 object-cover rounded-lg" />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-800 mb-1">{q.title}</h3>
                                                    <p className="text-gray-700 text-sm mb-3">{q.question}</p>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        {q.options.map((opt, i) => (
                                                            <div
                                                                key={i}
                                                                className={`flex items-center space-x-1 ${i === q.correct ? 'text-green-600 font-bold' : 'text-gray-500'
                                                                    }`}
                                                            >
                                                                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-current text-[8px]">
                                                                    {String.fromCharCode(65 + i)}
                                                                </span>
                                                                <span>{opt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
