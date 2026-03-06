import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Globe, Moon, Sun, Save, CheckCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

const Settings = () => {
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'Milana',
        siteEmail: 'admin@milana.com',
        autoApprove: false,
        emailNotifications: true,
        smsNotifications: false,
        maintenanceMode: false,
        maxPhotos: 5,
        minAge: 18,
        maxAge: 60,
        darkMode: false,
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const ToggleSwitch = ({ enabled, onChange, label }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <span className="text-sm font-bold text-gray-700">{label}</span>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${enabled ? 'bg-[#800020]' : 'bg-gray-200'}`}
            >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${enabled ? 'left-8' : 'left-1'}`}></div>
            </button>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <p className="text-[#800020] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Configuration</p>
                <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tighter italic">Platform Settings</h1>
            </div>

            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 text-green-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 border border-green-100"
                >
                    <CheckCircle size={20} /> Settings saved successfully!
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-[#800020]/5 border border-[#800020]/5 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#FFFDD0] rounded-xl flex items-center justify-center">
                            <Globe size={20} className="text-[#800020]" />
                        </div>
                        <h2 className="text-lg font-serif font-bold text-gray-900 italic">General</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleChange('siteName', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:border-[#800020]/30 focus:ring-2 focus:ring-[#800020]/5 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Admin Email</label>
                            <input
                                type="email"
                                value={settings.siteEmail}
                                onChange={(e) => handleChange('siteEmail', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:border-[#800020]/30 focus:ring-2 focus:ring-[#800020]/5 transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Min Age</label>
                                <input
                                    type="number"
                                    value={settings.minAge}
                                    onChange={(e) => handleChange('minAge', parseInt(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:border-[#800020]/30 focus:ring-2 focus:ring-[#800020]/5 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Max Age</label>
                                <input
                                    type="number"
                                    value={settings.maxAge}
                                    onChange={(e) => handleChange('maxAge', parseInt(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:border-[#800020]/30 focus:ring-2 focus:ring-[#800020]/5 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Max Photos Per User</label>
                            <input
                                type="number"
                                value={settings.maxPhotos}
                                onChange={(e) => handleChange('maxPhotos', parseInt(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:border-[#800020]/30 focus:ring-2 focus:ring-[#800020]/5 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications & Moderation */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-[#800020]/5 border border-[#800020]/5 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#FFFDD0] rounded-xl flex items-center justify-center">
                                <Bell size={20} className="text-[#800020]" />
                            </div>
                            <h2 className="text-lg font-serif font-bold text-gray-900 italic">Notifications</h2>
                        </div>
                        <ToggleSwitch label="Email Notifications" enabled={settings.emailNotifications} onChange={(v) => handleChange('emailNotifications', v)} />
                        <ToggleSwitch label="SMS Notifications" enabled={settings.smsNotifications} onChange={(v) => handleChange('smsNotifications', v)} />
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl shadow-[#800020]/5 border border-[#800020]/5 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#FFFDD0] rounded-xl flex items-center justify-center">
                                <Shield size={20} className="text-[#800020]" />
                            </div>
                            <h2 className="text-lg font-serif font-bold text-gray-900 italic">Moderation</h2>
                        </div>
                        <ToggleSwitch label="Auto-Approve New Profiles" enabled={settings.autoApprove} onChange={(v) => handleChange('autoApprove', v)} />
                        <ToggleSwitch label="Maintenance Mode" enabled={settings.maintenanceMode} onChange={(v) => handleChange('maintenanceMode', v)} />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full md:w-auto px-16 py-5 bg-[#800020] text-[#D4AF37] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 justify-center"
            >
                <Save size={16} /> Save Settings
            </button>
        </div>
    );
};

export default Settings;
