import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, ArrowLeft, Loader2, X, Check, Camera, ShieldCheck, Maximize2 } from 'lucide-react';

const Gallery = () => {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [selectedPhoto, setSelectedPhoto] = useState(null);

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
            showMessage('Maximum 6 photos allowed.', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showMessage('File size must be under 2MB.', 'error');
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
            showMessage('Photo uploaded successfully.');
        } catch (err) {
            console.error('Upload error:', err);
            showMessage('Failed to upload photo.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = async (index, e) => {
        e.stopPropagation();
        try {
            const newPhotos = photos.filter((_, i) => i !== index);
            await api.updateProfile({ photos: newPhotos });
            setPhotos(newPhotos);
            showMessage('Photo removed.');
        } catch (err) {
            console.error('Delete error:', err);
            showMessage('Failed to remove photo.', 'error');
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-[#800020]" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans">
            {/* Simple Header */}
            <div className="bg-[#800020] text-white pt-8 pb-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="text-sm font-medium">Back to Dashboard</span>
                        </button>
                        <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                            <span className="text-xs font-bold uppercase tracking-wider">{photos.length} / 6 Photos</span>
                            <Camera size={16} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold italic mb-2">Photo Gallery</h1>
                    <p className="text-white/60 text-sm max-w-md">Manage your profile photos. Tap a photo to view it full screen.</p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto w-full px-6 -mt-16 pb-20">
                {/* Alert Message */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mb-8 p-4 rounded-xl flex items-center gap-3 shadow-sm border ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'
                                }`}
                        >
                            {message.type === 'error' ? <X size={18} /> : <Check size={18} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-4 md:p-8 border border-gray-100">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-4 sm:pb-0">
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedPhoto(photo)}
                                className="relative group w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer"
                            >
                                <img
                                    src={photo}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <div className="bg-white/90 p-3 rounded-full text-gray-800 shadow-lg">
                                        <Maximize2 size={20} />
                                    </div>
                                    <button
                                        onClick={(e) => handleRemovePhoto(index, e)}
                                        className="bg-white p-3 rounded-full text-red-600 shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className="sm:hidden absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full backdrop-blur-sm">
                                    <button onClick={(e) => handleRemovePhoto(index, e)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {photos.length < 6 && (
                            <label className="relative w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#800020] hover:bg-gray-50 transition-all cursor-pointer flex flex-col items-center justify-center p-2 sm:p-8 text-center group">
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="animate-spin text-[#800020]" size={32} />
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors mb-4 border border-gray-100">
                                            <Plus className="text-gray-400 group-hover:text-[#800020]" size={28} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-800 mb-1">Add Photo</span>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Limit 2MB • JPG/PNG</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </label>
                        )}
                    </div>

                    {photos.length === 0 && !uploading && (
                        <div className="py-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ImageIcon size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No photos yet</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">Upload your first photo to complete your profile and attract more matches.</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Storage</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                        <Check size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protected</span>
                    </div>
                </div>
            </main>

            {/* Full Screen Lightbox */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.button
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-2 bg-white/10 rounded-full"
                        >
                            <X size={32} />
                        </motion.button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={selectedPhoto}
                            alt="Full View"
                            className="w-full h-auto max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @font-face {
                    font-family: 'Playfair Display';
                    src: url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default Gallery;
