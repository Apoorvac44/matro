import React, { useState, useEffect } from 'react';
import { Bell, ArrowLeft, Mail, MessageSquare, Heart, UserCheck, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        // Generate realistic notifications
        const stored = localStorage.getItem('notifications_v1');
        if (stored) {
            setNotifications(JSON.parse(stored));
        } else {
            const initial = [
                { id: 1, type: 'interest', title: 'New Interest Received!', desc: 'Someone new is interested in your profile. View their profile now.', time: '2m ago', read: false, icon: 'heart' },
                { id: 2, type: 'match', title: 'New Match Found', desc: 'A profile matching your preferences has joined Milana. Check them out!', time: '1h ago', read: false, icon: 'star' },
                { id: 3, type: 'message', title: 'Message Received', desc: 'You have a new message from a potential match in your inbox.', time: '3h ago', read: true, icon: 'message' },
                { id: 4, type: 'profile', title: 'Profile Viewed', desc: 'Someone viewed your profile. Upgrade to see who!', time: '5h ago', read: true, icon: 'eye' },
                { id: 5, type: 'system', title: 'Welcome to Milana!', desc: 'Complete your profile to get 3x more matches. Upload a photo and add your details.', time: '1d ago', read: true, icon: 'check' },
                { id: 6, type: 'interest', title: 'Interest Accepted', desc: 'Your interest was accepted! Say hello and start a conversation.', time: '2d ago', read: true, icon: 'heart' },
                { id: 7, type: 'system', title: 'Subscription Reminder', desc: 'Your free plan allows 5 interests per day. Upgrade to send unlimited interests.', time: '3d ago', read: true, icon: 'bell' },
            ];
            localStorage.setItem('notifications_v1', JSON.stringify(initial));
            setNotifications(initial);
        }
    }, []);

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        localStorage.setItem('notifications_v1', JSON.stringify(updated));
    };

    const markAsRead = (id) => {
        const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        setNotifications(updated);
        localStorage.setItem('notifications_v1', JSON.stringify(updated));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'heart': return <Heart size={18} className="text-red-400" />;
            case 'star': return <Star size={18} className="text-[#D4AF37]" />;
            case 'message': return <MessageSquare size={18} className="text-blue-400" />;
            case 'check': return <CheckCircle size={18} className="text-green-500" />;
            case 'eye': return <UserCheck size={18} className="text-purple-400" />;
            default: return <Bell size={18} className="text-[#800020]" />;
        }
    };

    const filters = ['All', 'Interests', 'Messages', 'System'];
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'All') return true;
        if (filter === 'Interests') return n.type === 'interest' || n.type === 'match';
        if (filter === 'Messages') return n.type === 'message';
        if (filter === 'System') return n.type === 'system' || n.type === 'profile';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-serif italic text-gray-900">Notifications</h1>
                            {unreadCount > 0 && <p className="text-xs text-[#800020] font-bold">{unreadCount} unread</p>}
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs font-bold text-[#800020] uppercase tracking-widest hover:text-[#600018] transition-colors">
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Filter Pills */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === f
                                ? 'bg-[#800020] text-white shadow-md'
                                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                            <Bell size={40} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold text-sm">No notifications here</p>
                        </div>
                    ) : (
                        filteredNotifications.map((n, i) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => markAsRead(n.id)}
                                className={`bg-white p-4 rounded-2xl border flex items-start gap-4 cursor-pointer group transition-all hover:shadow-md ${!n.read ? 'border-[#800020]/20 bg-[#FFFDD0]/20' : 'border-gray-100'}`}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center transition-colors ${!n.read ? 'bg-[#800020]/5' : 'bg-gray-50'}`}>
                                    {getIcon(n.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className={`text-sm font-bold ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</h3>
                                        {!n.read && <div className="w-2 h-2 bg-[#800020] rounded-full shrink-0 mt-1.5" />}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.desc}</p>
                                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1 block">{n.time}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
