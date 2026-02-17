'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { queryChatbot } from '@/services/api';

interface Message {
    text: string;
    sender: 'user' | 'bot';
    type?: 'text' | 'quiz' | 'analysis';
    data?: any;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Namaste! 🙏 Ask me about herbs, diet, or type "1" to check your Dosha.', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Quiz State
    const [quizActive, setQuizActive] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<number[][]>([]); // [[qIdx, oIdx]]

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, quizActive, currentQuestionIndex]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        const userMsg = text.trim();
        // Only add user message if it's not a quiz selection (handled separately in UI)
        if (!quizActive) {
            setMessages((prev) => [...prev, { text: userMsg, sender: 'user' }]);
        }

        setInput('');
        setLoading(true);

        try {
            const res = await queryChatbot(userMsg);
            const botMsg: Message = {
                text: res.data.response,
                sender: 'bot',
                type: res.data.type || 'text',
                data: res.data.data
            };

            setMessages((prev) => [...prev, botMsg]);

            if (botMsg.type === 'quiz' && botMsg.data?.questions) {
                setQuizActive(true);
                setQuizQuestions(botMsg.data.questions);
                setCurrentQuestionIndex(0);
                setQuizAnswers([]);
            }
        } catch {
            setMessages((prev) => [...prev, { text: 'Sorry, connection to Dhara brain failed.', sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuizOption = (optionIndex: number) => {
        // Record answer: [questionIndex, optionIndex]
        const newAnswers = [...quizAnswers, [currentQuestionIndex, optionIndex]];
        setQuizAnswers(newAnswers);

        // Show user selection as a message
        const optionText = quizQuestions[currentQuestionIndex].options[optionIndex];
        setMessages((prev) => [...prev, { text: optionText, sender: 'user' }]);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            // Next question
            setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 500);
        } else {
            // Submit quiz
            setQuizActive(false);
            setLoading(true);
            submitQuizResults(newAnswers);
        }
    };

    const submitQuizResults = async (answers: number[][]) => {
        try {
            // Use queryChatbot with specific context for quiz submission
            const res = await queryChatbot("QUIZ_SUBMISSION", { answers });
            const botMsg: Message = {
                text: res.data.response,
                sender: 'bot',
                type: res.data.type,
                data: res.data.data
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch {
            setMessages((prev) => [...prev, { text: 'Error calculating results.', sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    boxShadow: '5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light)',
                }}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] flex flex-col rounded-2xl overflow-hidden"
                        style={{
                            background: 'var(--bg-primary)',
                            boxShadow: '10px 10px 20px var(--shadow-dark), -10px -10px 20px var(--shadow-light)',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="px-5 py-4 flex items-center gap-2"
                            style={{ background: 'var(--accent)', color: '#fff' }}
                        >
                            <MessageCircle size={20} />
                            <span className="font-semibold text-lg">Dhara AI</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '420px' }}>
                            {messages.map((msg, i) => (
                                <div key={i}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'ml-auto' : ''}`}
                                        style={{
                                            background: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                                            color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                                            boxShadow: msg.sender === 'bot'
                                                ? 'inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light)'
                                                : 'none',
                                        }}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </motion.div>

                                    {/* Analysis Card */}
                                    {msg.type === 'analysis' && msg.data && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-2 p-4 rounded-2xl neu-card max-w-[90%]"
                                        >
                                            <div className="mb-2 font-bold text-lg" style={{ color: 'var(--accent)' }}>
                                                {msg.data.imbalance} Imbalance
                                            </div>

                                            {/* Scores */}
                                            <div className="flex gap-2 mb-3 text-xs">
                                                {Object.entries(msg.data.scores || {}).map(([key, val]: any) => (
                                                    <div key={key} className="px-2 py-1 rounded bg-white/20">
                                                        {key}: {val}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-2 text-xs">
                                                <p><strong>🥗 Diet:</strong> {msg.data.advice.diet}</p>
                                                <p><strong>🧘 Lifestyle:</strong> {msg.data.advice.lifestyle}</p>
                                                <p><strong>❌ Avoid:</strong> {msg.data.advice.avoid}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ))}

                            {/* Quiz UI */}
                            {quizActive && quizQuestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 rounded-2xl neu-card mx-auto w-[90%]"
                                >
                                    <p className="text-sm font-semibold mb-3">
                                        {quizQuestions[currentQuestionIndex].question}
                                    </p>
                                    <div className="space-y-2">
                                        {quizQuestions[currentQuestionIndex].options.map((opt: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleQuizOption(idx)}
                                                className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all hover:bg-black/5"
                                                style={{ border: '1px solid var(--accent)' }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-xs text-right opacity-60">
                                        {currentQuestionIndex + 1} / {quizQuestions.length}
                                    </div>
                                </motion.div>
                            )}

                            {loading && (
                                <div className="px-4 py-2 rounded-2xl text-sm max-w-[80%] opacity-50">
                                    Thinking...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input - Disable during quiz */}
                        <div className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--shadow-dark)' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !quizActive && handleSend()}
                                placeholder={quizActive ? "Quiz in progress..." : "Ask about herbs, diet..."}
                                disabled={quizActive}
                                className="neu-input text-sm flex-1"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={quizActive}
                                className="p-3 rounded-xl cursor-pointer disabled:opacity-50"
                                style={{
                                    background: 'var(--accent)',
                                    color: '#fff',
                                    boxShadow: '3px 3px 6px var(--shadow-dark), -3px -3px 6px var(--shadow-light)',
                                }}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
