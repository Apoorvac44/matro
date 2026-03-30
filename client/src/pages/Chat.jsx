import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { Send, User, ChevronLeft, Loader2, Info, Home, Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiver, setReceiver] = useState(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchReceiver = async () => {
            try {
                const { data } = await api.getProfiles();
                const found = data.find(p => (p._id || p.id) === id);
                setReceiver(found);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReceiver();
    }, [id]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await api.getMessages(id);
                setMessages(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.sendMessage({ receiverId: id, content: newMessage });
            setNewMessage('');
            const { data } = await api.getMessages(id);
            setMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-[calc(100dvh-64px-64px)] md:h-[calc(100vh-80px)] bg-white flex flex-col relative">
            {/* Minimal Chat Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/chat/inbox')} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                            <ChevronLeft size={24} className="text-gray-400" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                                {receiver?.profilePicture || receiver?.image ? (
                                    <img src={receiver.profilePicture || receiver.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <User size={24} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 tracking-tight">{receiver?.name || 'Loading...'}</h2>
                                <p className="text-xs text-green-500 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                                    </span>
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>
                    <button className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                        <Info size={22} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50/50">
                <div className="max-w-4xl mx-auto p-2 md:p-4 space-y-3">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 size={32} className="animate-spin text-[#800020]" />
                        </div>
                    ) : messages.length > 0 ? (
                        messages.map((msg, index) => {
                            const isMine = msg.sender === user?._id || msg.sender === 'mock_user_1';
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] md:max-w-[70%] p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${isMine
                                        ? 'bg-[#800020] text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                                        }`}>
                                        {msg.content}
                                        <div className={`text-[8px] mt-2 font-bold opacity-60 text-right`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                            <div className="w-12 h-12 bg-[#FFFDD0] rounded-full flex items-center justify-center text-[#D4AF37] mb-2">
                                <MessageSquare size={24} />
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Connect and start chatting</p>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Input Area - Fixed at bottom of this container */}
            <div className="bg-white border-t border-gray-100 p-3 md:p-4 sticky bottom-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSend} className="flex gap-4 relative">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 px-8 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:bg-white focus:ring-4 focus:ring-[#FFFDD0] transition-all text-sm font-semibold"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-[#800020] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-[#800020]/20 hover:bg-[#600018] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shrink-0"
                        >
                            <Send size={24} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
