import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    LogIn,
    Eye,
    UserPlus,
    MessageSquare,
    AlertCircle,
    Clock
} from 'lucide-react';

const ActivityMonitor = () => {
    const activities = [
        { id: 1, type: 'login', user: 'Priya Sharma', detail: 'Logged in from Mumbai, IN', time: '2 mins ago', icon: LogIn, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 2, type: 'view', user: 'Amit Patel', detail: 'Viewed profile of Anjali Reddy', time: '15 mins ago', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 3, type: 'report', user: 'System', detail: 'Reported profile: Vikram Singh (Spam)', time: '1 hour ago', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 4, type: 'register', user: 'Rohan Deshmukh', detail: 'New registration complete', time: '3 hours ago', icon: UserPlus, color: 'text-green-500', bg: 'bg-green-50' },
        { id: 5, type: 'message', user: 'Sneha Iyer', detail: 'Sent interest to Rahul Mehta', time: '5 hours ago', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <p className="text-[#800020] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Live Logs</p>
                <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tighter italic">Activity Stream</h1>
            </div>

            <div className="bg-white rounded-[3rem] border border-[#800020]/5 shadow-xl p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#800020]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <div className="relative space-y-6">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-[#F8F9FA] transition-colors group cursor-default"
                        >
                            <div className={`w-14 h-14 ${activity.bg} ${activity.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <activity.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-serif font-extrabold text-gray-900 italic text-lg">{activity.user}</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                                        <Clock size={12} /> {activity.time}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-gray-500 mt-1">{activity.detail}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="w-full mt-10 py-5 bg-[#F8F9FA] hover:bg-[#800020] text-[#800020] hover:text-[#D4AF37] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all">
                    Load Historical Archives
                </button>
            </div>

            {/* Global Activity Map Placeholder */}
            <div className="bg-[#1A1A1A] rounded-[3rem] p-12 text-white relative overflow-hidden h-80 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="relative text-center space-y-4">
                    <Activity size={48} className="mx-auto text-[#D4AF37] animate-pulse" />
                    <h3 className="text-2xl font-serif font-black italic">Global Traffic Map</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Real-time Node Monitoring Active</p>
                </div>
            </div>
        </div>
    );
};

export default ActivityMonitor;
