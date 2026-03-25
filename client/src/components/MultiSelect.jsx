import React, { useState, useRef, useEffect } from 'react';
import { X, Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiSelect = ({ label, options, selectedOptions, onChange, placeholder = "Select options..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    // Ensure selectedOptions is always an array
    const selected = Array.isArray(selectedOptions)
        ? selectedOptions
        : (selectedOptions ? selectedOptions.split(',').map(s => s.trim()).filter(Boolean) : []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option) => {
        let newSelected;
        if (selected.includes(option)) {
            newSelected = selected.filter(item => item !== option);
        } else {
            newSelected = [...selected, option];
        }

        // Return as string or array based on what's expected? 
        // For EditProfile, we'll return a string for now as it's initialized as ''
        onChange(newSelected.join(', '));
    };

    const removeOption = (option, e) => {
        e.stopPropagation();
        const newSelected = selected.filter(item => item !== option);
        onChange(newSelected.join(', '));
    };

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative w-full max-w-md" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`form-input-premium min-h-[50px] py-2 flex flex-wrap gap-2 cursor-pointer transition-all ${isOpen ? 'ring-2 ring-[#800020]/20 border-[#800020]/30' : ''}`}
            >
                {selected.length === 0 && !isOpen && (
                    <span className="text-gray-400 text-sm pl-1">{placeholder}</span>
                )}

                <AnimatePresence>
                    {selected.map(option => (
                        <motion.span
                            key={option}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-[#800020] text-[#D4AF37] px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border border-[#D4AF37]/20"
                        >
                            {option}
                            <X
                                size={12}
                                className="cursor-pointer hover:text-white transition-colors"
                                onClick={(e) => removeOption(option, e)}
                            />
                        </motion.span>
                    ))}
                </AnimatePresence>

                <div className="ml-auto pr-1 flex items-center">
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-[100] mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                            <Search size={14} className="text-gray-400" />
                            <input
                                autoFocus
                                type="text"
                                className="bg-transparent border-none outline-none text-xs w-full font-bold text-gray-700"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(option => {
                                    const isSelected = selected.includes(option);
                                    return (
                                        <div
                                            key={option}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleOption(option);
                                            }}
                                            className={`px-4 py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-between hover:bg-[#FFFDD0] ${isSelected ? 'text-[#800020] bg-[#FFFDD0]/50' : 'text-gray-600'}`}
                                        >
                                            {option}
                                            {isSelected && <Check size={14} className="text-[#800020]" />}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-6 text-center text-gray-400 text-xs italic">No matching languages found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MultiSelect;
