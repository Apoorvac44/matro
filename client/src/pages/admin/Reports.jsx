import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Download, Filter, FileText, Share2 } from 'lucide-react';

const Reports = () => {
    const genderData = [
        { name: 'Male', value: 742, color: '#800020' },
        { name: 'Female', value: 542, color: '#D4AF37' },
    ];

    const monthlyRev = [
        { name: 'Jan', amount: 45000 },
        { name: 'Feb', amount: 52000 },
        { name: 'Mar', amount: 48000 },
        { name: 'Apr', amount: 61000 },
        { name: 'May', amount: 59000 },
        { name: 'Jun', amount: 72000 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <p className="text-[#800020] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Intelligence</p>
                    <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tighter italic">Analytical Reports</h1>
                </div>

                <div className="flex gap-3">
                    <button className="p-4 bg-white border border-[#800020]/5 rounded-2xl text-[#800020] hover:bg-[#800020] hover:text-white transition-all shadow-xl">
                        <Share2 size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 bg-[#800020] text-[#D4AF37] rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                        <Download size={16} /> Export Dossier
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white p-8 rounded-[3rem] border border-[#800020]/5 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-gray-900 italic">Revenue Accrual</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly gross earnings</p>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyRev}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 800 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 800 }} />
                                <Tooltip cursor={{ fill: '#F8F9FA' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="amount" fill="#800020" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demographics Pie */}
                <div className="bg-white p-8 rounded-[3rem] border border-[#800020]/5 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#FFFDD0] text-[#800020] rounded-2xl flex items-center justify-center">
                            <Filter size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-gray-900 italic">Community Balance</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gender distribution</p>
                        </div>
                    </div>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-4 pr-10">
                            {genderData.map((d) => (
                                <div key={d.name} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-md" style={{ backgroundColor: d.color }}></div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">{d.name}</p>
                                    <p className="text-sm font-serif font-bold italic">{d.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
