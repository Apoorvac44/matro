import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Loader2, Home, Heart, MessageSquare, Settings } from 'lucide-react';
import * as api from '../services/api';

const ChatInbox = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All Messages');
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await api.getConversations();
                setConversations(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching conversations:', err);
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    const formatTime = (dateString) => {
        if (!dateString) return '10:00 AM';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col pb-20 md:pb-0">
            {/* Maroon Header */}
            <div className="bg-[#800020] pt-28 px-6 pb-16 shrink-0 relative overflow-hidden">
                {/* Subtle Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl font-serif font-bold text-[#D4AF37] tracking-tight italic">Messages</h1>
                    <p className="text-[#FFFDD0]/60 text-xs mt-3 uppercase tracking-[0.3em] font-bold">Your Conversations</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 py-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="max-w-4xl mx-auto flex gap-4">
                    {['All Messages', 'Unread Messages', 'Calls'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 px-4 rounded-2xl text-[12px] uppercase tracking-[0.2em] font-serif font-bold transition-all ${activeTab === tab
                                ? 'bg-[#800020] text-[#D4AF37] shadow-xl shadow-[#800020]/20 scale-[1.02] border border-[#D4AF37]/30'
                                : 'text-gray-400 hover:bg-gray-50 border border-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30">
                <div className="max-w-4xl mx-auto py-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 size={40} className="animate-spin text-[#800020] mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Conversations...</p>
                        </div>
                    ) : conversations.length > 0 ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                            {conversations.map((chat) => (
                                <div
                                    key={chat.id || chat._id}
                                    onClick={() => navigate(`/chat/${chat.id || chat._id}`)}
                                    className="flex items-center gap-5 p-6 md:p-8 hover:bg-gray-50 cursor-pointer transition-all active:scale-[0.99] group"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md shrink-0">
                                            {chat.avatar || chat.profilePicture ? (
                                                <img
                                                    src={chat.avatar || chat.profilePicture}
                                                    alt={chat.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-gray-900 truncate">{chat.name}</h3>
                                            <span className="text-[10px] text-gray-400 font-bold">{formatTime(chat.time || chat.updatedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <img src="https://img.icons8.com/color/48/double-tick.png" className="w-3 h-3 grayscale opacity-30" alt="read" />
                                            </div>
                                            <p className="text-sm text-gray-500 truncate font-medium">
                                                {chat.lastMessage || 'pls send me your details'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No messages yet</h3>
                            <p className="text-gray-500 text-sm">Start a conversation with your matches to see them here.</p>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation for Mobile */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-50 md:hidden">
                    <Link to="/" className="flex flex-col items-center gap-1 text-gray-400">
                        <Home size={24} />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>
                    <Link to="/explore" className="flex flex-col items-center gap-1 text-gray-400">
                        <Heart size={24} />
                        <span className="text-[10px] font-bold">Matches</span>
                    </Link>
                    <Link to="/chat/inbox" className="flex flex-col items-center gap-1 text-[#800020]">
                        <div className="relative">
                            <MessageSquare size={24} />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <span className="text-[10px] font-bold">Chat</span>
                    </Link>
                    <Link to="/dashboard" className="flex flex-col items-center gap-1 text-gray-400">
                        <User size={24} />
                        <span className="text-[10px] font-bold">Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ChatInbox;
