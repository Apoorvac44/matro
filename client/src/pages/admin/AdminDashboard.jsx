import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    UserPlus,
    ShieldCheck,
    Clock,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Users', value: '1,284', icon: Users, change: '+12%', isPositive: true },
        { label: 'Premium Members', value: '342', icon: ShieldCheck, change: '+5%', isPositive: true },
        { label: 'Pending Approvals', value: '18', icon: Clock, change: '-2%', isPositive: false },
        { label: 'Daily Registrations', value: '24', icon: UserPlus, change: '+18%', isPositive: true },
    ];

    const data = [
        { name: 'Mon', registrations: 12 },
        { name: 'Tue', registrations: 19 },
        { name: 'Wed', registrations: 15 },
        { name: 'Thu', registrations: 22 },
        { name: 'Fri', registrations: 30 },
        { name: 'Sat', registrations: 25 },
        { name: 'Sun', registrations: 28 },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <p className="text-[#800020] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Systems Overview</p>
                <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tighter italic">Command Center</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-[2.5rem] border border-[#800020]/5 shadow-xl shadow-[#800020]/5 hover:shadow-2xl hover:shadow-[#800020]/10 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-[#F8F9FA] rounded-2xl flex items-center justify-center text-[#800020] group-hover:bg-[#800020] group-hover:text-[#D4AF37] transition-colors">
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-serif font-bold text-gray-900 italic tracking-tight">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-[#800020]/5 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-gray-900 italic">Registration Growth</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Weekly user acquisition</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 bg-[#800020] rounded-full"></span>
                            <span className="text-[10px] font-black uppercase text-gray-400">New Users</span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#800020" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#800020" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 800 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 800 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '1rem',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="registrations"
                                    stroke="#800020"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorReg)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#800020] p-8 rounded-[3rem] text-[#D4AF37] relative overflow-hidden flex flex-col justify-between shadow-2xl transition-transform hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div>
                        <TrendingUp size={48} className="mb-6" />
                        <h3 className="text-2xl font-serif font-black italic mb-2">Membership Insights</h3>
                        <p className="text-xs opacity-70 leading-relaxed font-bold">Your premium base has grown by 15% this month. Recommend launching the "Early Bird" Elite offer.</p>
                    </div>
                    <button className="w-full bg-[#D4AF37] text-[#800020] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-white transition-all transform active:scale-95">
                        Optimize Strategy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
