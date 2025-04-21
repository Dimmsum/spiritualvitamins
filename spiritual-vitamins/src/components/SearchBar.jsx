import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="flex justify-center w-full mt-">
            <div className="relative w-full max-w-md">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <div className="pl-3 text-gray-400">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for your vitamins"
                        className="w-full py-2 px-3 outline-none text-gray-700"
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;