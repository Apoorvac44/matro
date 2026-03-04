import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, ArrowLeft, Loader2, X, Check, Sparkles } from 'lucide-react';

const Gallery = () => {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const { data } = await api.getProfile();
                setPhotos(data.photos || []);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch profile photos:', err);
                setLoading(false);
            }
        };
        fetchPhotos();
    }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (photos.length >= 6) {
            showMessage('Only 6 frames can resonate in your sanctuary.', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showMessage('The image essence must be under 2MB.', 'error');
            return;
        }

        setUploading(true);

        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });

            const newPhotos = [...photos, base64];
            await api.updateProfile({ photos: newPhotos });
            setPhotos(newPhotos);
            showMessage('A new resonance has been captured.');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || err.message;
            console.error('Upload error details:', errorMsg);
            showMessage(`Silence: ${typeof errorMsg === 'string' ? errorMsg.substring(0, 100) : 'Fusion failed'}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = async (index) => {
        try {
            const newPhotos = photos.filter((_, i) => i !== index);
            await api.updateProfile({ photos: newPhotos });
            setPhotos(newPhotos);
            showMessage('A frame has dissolved.');
        } catch (err) {
            console.error('Delete error:', err);
            showMessage('Failed to dissolve frame.', 'error');
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FFFDD0]/20">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="mb-6"
            >
                <ImageIcon size={48} className="text-[#D4AF37] opacity-20" />
            </motion.div>
            <p className="text-[#800020] text-[10px] font-bold uppercase tracking-[0.4em]">Loading Gallery...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFDD0]/10 flex flex-col font-sans">
            {/* Premium Header - Same as Matches Page */}
            <div className="bg-gradient-to-br from-[#800020] via-[#600318] to-[#4a0404] pt-32 px-6 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] -ml-24 -mb-24"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="flex items-center gap-8">
                            <motion.button
                                whileHover={{ scale: 1.05, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/dashboard')}
                                className="w-16 h-16 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D4AF37] hover:bg-white hover:text-[#800020] transition-all group shadow-xl"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="space-y-2 text-left">
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[#D4AF37] font-bold uppercase tracking-[0.5em] text-[10px] block"
                                >
                                    My Gallery
                                </motion.span>
                                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-none italic">
                                    Photo <span className="text-[#D4AF37] not-italic">Gallery</span>
                                </h1>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col items-end gap-2"
                        >
                            <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-3">
                                <Sparkles size={14} className="text-[#D4AF37]" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                    {photos.length} / 6 Photos Uploaded
                                </span>
                            </div>
                            <p className="text-[9px] text-[#D4AF37]/60 font-medium uppercase tracking-tight italic">Quality checks applied</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto w-full px-6 -mt-10 relative z-20 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 md:p-16 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(10,25,47,0.12)] border border-[#800020]/5"
                >
                    <AnimatePresence mode="wait">
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                className={`px-8 py-5 rounded-3xl mb-12 font-bold uppercase tracking-widest text-[10px] flex items-center gap-4 shadow-xl ${message.type === 'error' ? 'bg-gray-900 text-white' : 'bg-[#800020] text-[#D4AF37]'}`}
                            >
                                {message.type === 'error' ? <X size={18} /> : <Check size={18} />} {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group relative"
                            >
                                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 p-1.5 bg-gradient-to-br from-[#D4AF37] via-[#FFFDD0] to-[#D4AF37] shadow-xl relative">
                                    <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white relative">
                                        <img
                                            src={photo}
                                            alt={`Resonance ${index + 1}`}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
                                        />

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#800020]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemovePhoto(index)}
                                                className="bg-white text-[#800020] w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                                                title="Delete Photo"
                                            >
                                                <Trash2 size={24} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white border border-[#D4AF37]/30 rounded-full flex items-center justify-center shadow-lg z-20 group-hover:rotate-12 transition-transform">
                                    <span className="text-[10px] font-serif italic text-[#800020] font-bold">0{index + 1}</span>
                                </div>
                            </motion.div>
                        ))}

                        {photos.length < 6 && (
                            <motion.label
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="aspect-[4/5] cursor-pointer rounded-[2.5rem] border-2 border-dashed border-[#D4AF37]/30 bg-[#F8F9FA]/5 hover:bg-[#F8F9FA]/20 transition-all duration-500 flex flex-col items-center justify-center text-[#800020] group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {uploading ? (
                                    <div className="flex flex-col items-center gap-6 relative z-10">
                                        <Loader2 size={40} className="animate-spin text-[#D4AF37]" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#800020] animate-pulse">Uploading...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center relative z-10 text-center px-10">
                                        <div className="w-20 h-20 rounded-3xl bg-[#F8F9FA] flex items-center justify-center mb-8 border border-[#D4AF37]/20 shadow-sm group-hover:rotate-12 transition-transform">
                                            <Plus size={32} className="text-[#D4AF37]" />
                                        </div>
                                        <span className="font-bold uppercase tracking-[0.4em] text-[10px] mb-2 text-[#800020]">Add Photo</span>
                                        <span className="text-[8px] opacity-40 font-medium uppercase tracking-widest italic leading-relaxed text-[#800020]">Limit 2MB • JPG/PNG</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </motion.label>
                        )}
                    </div>

                    {photos.length === 0 && !uploading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-40 bg-[#F8F9FA]/10 rounded-[4rem] mt-12 border border-[#D4AF37]/20 border-dashed"
                        >
                            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-[#D4AF37]/40 shadow-xl border border-[#D4AF37]/10">
                                <ImageIcon size={48} />
                            </div>
                            <h3 className="text-3xl font-serif italic text-gray-900 mb-4">No photos yet</h3>
                            <p className="text-gray-400 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                                Please upload photos to show on your profile.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Gallery;
