import React from 'react';
import { Bell, ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif italic text-gray-900">Notifications</h1>
                        <p className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-widest">Stay updated with your latest profile activity</p>
                    </div>
                    <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <div className="space-y-4">
                    {[
                        { title: 'Welcome to Milana!', desc: 'Complete your profile to get more matches.', time: '2h ago', icon: <Bell className="text-blue-500" /> },
                        { title: 'New Match Found', desc: 'A new profile matches your preferences.', time: '5h ago', icon: <Mail className="text-[#800020]" /> },
                        { title: 'Message Received', desc: 'You have a new message from a potential match.', time: '1d ago', icon: <MessageSquare className="text-green-500" /> },
                    ].map((n, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-[#800020]/20 transition-all cursor-pointer group">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#800020]/5 transition-colors">
                                {n.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-gray-900 text-sm">{n.title}</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">{n.desc}</p>
                            </div>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{n.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
