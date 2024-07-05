import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import locales from '~api/locales';

const LocaleSelector = ({ onSelectLocale }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocale, setSelectedLocale] = useState({"locale": "zh-CN", "country": "China", "flag": "🇨🇳"});

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelect = (locale) => {
        setSelectedLocale(locale);
        onSelectLocale(locale);
        setSearchTerm('');
    };

    const filteredLocales = locales.filter(locale =>
        locale.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-md mx-auto mt-2 relative group">
            <input
                type="text"
                placeholder={selectedLocale ? `${selectedLocale.flag} ${selectedLocale.country}` : "Select or search country"}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ul className="max-h-48 overflow-y-auto">
                    {filteredLocales.map((locale, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 cursor-pointer flex justify-between hover:bg-blue-100"
                            onClick={() => handleSelect(locale)}
                        >
                            <span>{locale.flag} {locale.country}</span>
                            {/* <span>{locale.locale}</span> */} 
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

LocaleSelector.propTypes = {
    onSelectLocale: PropTypes.func.isRequired,
};

export default LocaleSelector;
