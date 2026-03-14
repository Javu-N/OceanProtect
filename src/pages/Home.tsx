import { useEffect, useState } from 'react';
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
}

export default function Home() {
    const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
    const [currentScore] = useState(0);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const questions = await ensureQuestionsExist(defaultQuizData);
                setQuizItems(
                    questions && questions.length > 0
                        ? questions.slice(0, 4)
                        : defaultQuizData.slice(0, 4).map(q => ({ ...q, id: q.id.toString() }))
                );
            } catch (error) {
                console.error('Error loading questions:', error);
                setQuizItems(defaultQuizData.slice(0, 4).map(q => ({ ...q, id: q.id.toString() })));
            }
        };

        loadQuestions();
    }, []);

    return (
        <div className="bg-white text-gray-900">
            {/* Sticky Navbar */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl">🌊</span>
                            <span className="text-2xl font-bold tracking-tight text-green-500">OceanGuard</span>
                        </div>
                        <div className="hidden md:flex space-x-8 font-medium">
                            <a href="#home" className="hover:text-green-500 transition-colors">Trang chủ</a>
                            <a href="#problems" className="hover:text-green-500 transition-colors">Vấn đề đại dương</a>
                            <Link to="/quiz" className="hover:text-green-500 transition-colors">Trò chơi Quiz</Link>
                            <Link to="/admin" className="hover:text-green-500 transition-colors">Quản lý câu hỏi</Link>
                            <a href="#contact" className="hover:text-green-500 transition-colors">Liên hệ</a>
                        </div>
                        <div className="md:hidden text-2xl cursor-pointer">🍔</div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://png.pngtree.com/background/20230401/original/pngtree-coral-reef-sea-turtle-beautiful-ocean-cartoon-background-picture-image_2253111.jpg"
                        alt="Beautiful Ocean"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Bảo Vệ Đại Dương
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-10 font-light">
                        Đại dương là nguồn sống của hành tinh chúng ta. Hãy cùng nhau chống lại ô nhiễm biển và bảo tồn hành tinh xanh cho thế hệ mai sau.
                    </p>
                    <a
                        href="#problems"
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 inline-block shadow-xl"
                    >
                        Tìm hiểu cách giúp đỡ 🐠
                    </a>
                </div>
            </section>

            {/* Ocean Problems Section */}
            <section id="problems" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Các mối đe dọa chính</h2>
                        <div className="h-1 w-20 bg-orange-500 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Ô nhiễm nhựa",
                                image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=800",
                                desc: "Hơn 8 triệu tấn nhựa đổ vào đại dương mỗi năm, tàn phá sinh vật biển và hệ sinh thái."
                            },
                            {
                                title: "Tràn dầu",
                                image: "https://images.unsplash.com/photo-1620206343767-7da98185edd4?auto=format&fit=crop&q=80&w=800",
                                desc: "Các vụ tràn dầu giải phóng hóa chất độc hại làm ngạt thở sinh vật biển và phá hủy môi trường sống ven biển."
                            },
                            {
                                title: "Đánh bắt quá mức",
                                image: "https://cdn1.tuoitre.vn/thumb_w/1200/2021/11/21/merlin151396335285c7898-5cc8-49a9-8883-31bf58687dc8-superjumbo-16374837260211579844905-crop-1637484070303273371792.jpeg",
                                desc: "Đánh bắt công nghiệp làm cạn kiệt nguồn cá nhanh hơn khả năng phục hồi, làm đảo lộn chuỗi thức ăn."
                            },
                            {
                                title: "Biến đổi khí hậu",
                                image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&q=80&w=800",
                                desc: "Nhiệt độ tăng gây ra axit hóa đại dương và tẩy trắng san hô, đe dọa những môi trường sống đa dạng nhất."
                            }
                        ].map((problem, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                                <img src={problem.image} alt={problem.title} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3 text-green-500">{problem.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{problem.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quiz Gallery Section */}
            <section id="quiz" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Thư viện Quiz</h2>
                            <p className="text-gray-600 max-w-xl">Nhấp vào các hình ảnh bên dưới để kiểm tra kiến thức của bạn về bảo vệ đại dương. Mỗi câu trả lời đúng sẽ giúp bạn học hỏi thêm!</p>
                        </div>
                        <div className="mt-6 md:mt-0 bg-green-500/10 px-6 py-3 rounded-xl border border-green-500/20">
                            <span className="text-sm uppercase tracking-wider font-bold text-green-500">Điểm của bạn</span>
                            <div className="text-3xl font-bold text-green-500">{currentScore}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {quizItems.map((item) => (
                            <div key={item.id} className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                                <img src={item.image} alt={item.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                                    <span className="font-bold text-lg mb-2">{item.title}</span>
                                    <span className="bg-orange-500 px-4 py-1 rounded-full text-sm font-bold">Làm Quiz 📝</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            to="/quiz"
                            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105"
                        >
                            Chơi Quiz đầy đủ 🎮
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call To Action Section */}
            <section className="py-24 bg-green-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-8">Hành động ngay hôm nay 🌍</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        {[
                            { icon: "♻️", title: "Giảm thiểu nhựa", desc: "Nói không với nhựa dùng một lần và chọn các giải pháp thay thế bền vững." },
                            { icon: "🧹", title: "Dọn dẹp bãi biển", desc: "Tham gia các sáng kiến địa phương để dọn rác khỏi bờ biển của chúng ta." },
                            { icon: "🤝", title: "Hỗ trợ các tổ chức", desc: "Quyên góp hoặc tình nguyện cho các tổ chức chuyên bảo tồn biển." }
                        ].map((action, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="text-4xl">{action.icon}</div>
                                <h3 className="text-xl font-bold">{action.title}</h3>
                                <p className="text-white/80">{action.desc}</p>
                            </div>
                        ))}
                    </div>
                    <button className="bg-white text-green-500 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-xl">
                        Tham gia phong trào
                    </button>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-8">Liên hệ với chúng tôi 📧</h2>
                    <p className="text-gray-600 mb-12">Bạn có thắc mắc hoặc muốn hợp tác với chúng tôi? Hãy liên hệ và cùng nhau cứu đại dương.</p>
                    <form className="space-y-4">
                        <input type="email" placeholder="Email của bạn" className="w-full p-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all" />
                        <textarea placeholder="Tin nhắn của bạn" rows={4} className="w-full p-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"></textarea>
                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition-colors">
                            Gửi tin nhắn
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl">🌊</span>
                            <span className="text-2xl font-bold tracking-tight text-green-500">OceanGuard</span>
                        </div>
                        <div className="flex space-x-6 text-2xl">
                            <a href="#" className="hover:text-green-500 transition-colors">🐦</a>
                            <a href="#" className="hover:text-green-500 transition-colors">📸</a>
                            <a href="#" className="hover:text-green-500 transition-colors">📘</a>
                        </div>
                        <div className="text-gray-400 text-sm">
                            <p>hello@oceanguard.org</p>
                            <p className="mt-2">&copy; 2026 OceanGuard. Bảo lưu mọi quyền. 🐚</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
