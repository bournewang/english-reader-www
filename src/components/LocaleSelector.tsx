import React, { useState, useEffect, useRef } from 'react';
import locales from '~api/locales';

const LocaleSelector = ({ onSelectLocale }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocale, setSelectedLocale] = useState({"locale": "zh-CN", "country": "China", "flag": "🇨🇳"});
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        onSelectLocale(selectedLocale);

        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setIsOpen(true);
    };

    const handleSelect = (locale) => {
        setSelectedLocale(locale);
        onSelectLocale(locale);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleKeyDown = (event) => {
        if (!isOpen) return;

        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) =>
                Math.min(prevIndex + 1, filteredLocales.length - 1)
            );
        } else if (event.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) =>
                Math.max(prevIndex - 1, 0)
            );
        } else if (event.key === 'Enter') {
            handleSelect(filteredLocales[highlightedIndex]);
        }
    };

    const filteredLocales = locales.filter(locale =>
        locale.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-md mx-auto mt-2" ref={ref}>
            <div className="relative">
                <input
                    type="text"
                    placeholder={selectedLocale ? `${selectedLocale.flag} ${selectedLocale.country}` : "Select or search country"}
                    value={searchTerm}
                    onChange={handleSearch}
                    onClick={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <ul className="max-h-48 overflow-y-auto">
                            {filteredLocales.map((locale, index) => (
                                <li
                                    key={index}
                                    className={`px-4 py-2 cursor-pointer flex justify-between ${highlightedIndex === index ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleSelect(locale)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    <span>{locale.flag} {locale.country}</span>
                                    <span>{locale.locale}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {/* {selectedLocale && (
                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                    <h2 className="text-lg font-semibold">Selected Locale</h2>
                    <p>{selectedLocale.flag} {selectedLocale.country} - {selectedLocale.locale}</p>
                </div>
            )} */}
        </div>
    );
};

export default LocaleSelector;
