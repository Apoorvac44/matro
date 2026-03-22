import React from 'react';
import { HelpCircle, ArrowLeft, Book, MessageCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif italic text-gray-900">Help Center</h1>
                        <p className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-widest">How can we assist you today?</p>
                    </div>
                    <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <ContactCard icon={<Phone className="text-green-500" />} label="Call Support" value="+91 98765 43210" desc="Mon-Sat, 9AM-6PM" />
                    <ContactCard icon={<Mail className="text-blue-500" />} label="Email Us" value="support@milana.com" desc="Response within 24h" />
                </div>

                <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 px-2">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: 'How do I upgrade my membership?', a: 'Go to your profile dropdown and click "Upgrade now" to see our premium plans.' },
                        { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption to protect your personal information.' },
                        { q: 'How can I report a profile?', a: 'Click the "Report" button on any profile detail page to notify our moderation team.' },
                    ].map((faq, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-black text-gray-900 text-sm mb-2">{faq.q}</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ContactCard = ({ icon, label, value, desc }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-black text-gray-900">{value}</p>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5">{desc}</p>
        </div>
    </div>
);

export default Help;
