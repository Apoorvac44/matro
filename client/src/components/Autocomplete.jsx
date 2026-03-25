import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Autocomplete = ({
    label,
    value,
    onChange,
    options = [],
    placeholder,
    required,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState(value || '');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        setSearch(value || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsFocused(false);
                // Reset search to original value if no selection was made
                setSearch(value || '');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredOptions([]);
        } else {
            const filtered = options.filter(option =>
                option.toLowerCase().includes(search.toLowerCase())
            ).slice(0, 8); // Limit to top 8 suggestions
            setFilteredOptions(filtered);
        }
    }, [search, options]);

    const handleSelect = (option) => {
        onChange(option);
        setSearch(option);
        setIsOpen(false);
        setIsFocused(false);
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        setIsOpen(true);
        if (val === '') {
            onChange(''); // Clear value if input is empty
        }
    };

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            {/* Input Container */}
            <div
                className={`relative flex items-center transition-all duration-300 rounded-xl border-2 ${isFocused || isOpen ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg' : 'border-gray-100 bg-gray-50/30'
                    }`}
            >
                {/* Floating Label */}
                <label
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${isFocused || isOpen || search ? '-top-2.5 left-3 text-[10px] font-black bg-white px-2 text-blue-500 uppercase tracking-widest' : 'top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm font-bold'
                        }`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <input
                    type="text"
                    value={search}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setIsFocused(true);
                        if (search.length > 0) setIsOpen(true);
                    }}
                    placeholder={isFocused ? placeholder : ""}
                    className="w-full h-12 px-4 pt-1 bg-transparent text-sm sm:text-base font-bold text-gray-900 outline-none placeholder:text-gray-300 placeholder:font-normal"
                />

                <div className="flex items-center gap-1 pr-3">
                    {search && (
                        <button
                            onClick={() => { setSearch(''); onChange(''); }}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                </div>
            </div>

            {/* Dropdown Suggestions */}
            <AnimatePresence>
                {isOpen && filteredOptions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto">
                            {filteredOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelect(option)}
                                    className="w-full px-5 py-3.5 text-left text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-50 last:border-0 transition-all flex items-center justify-between group"
                                >
                                    <span>{option}</span>
                                    <Search size={14} className="text-gray-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Autocomplete;
