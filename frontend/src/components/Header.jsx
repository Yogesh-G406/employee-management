import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Header = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <div className="header flex items-center justify-between px-8">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
                <div className="search-bar">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search employees, departments..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="flex-1"
                    />
                </div>
            </div>

            {/* Right Section - Empty for now */}
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                    Employee Management System
                </div>
            </div>
        </div>
    );
};

export default Header;
