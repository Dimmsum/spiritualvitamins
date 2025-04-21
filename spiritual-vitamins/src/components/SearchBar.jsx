import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="flex justify-center w-full">
            <div className="relative w-full max-w-md">
                <div className="flex items-center border border-[#FF2C2C] rounded-xl overflow-hidden">
                    <div className="pl-3 text-[#FF2C2C]">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder="Search for your vitamins"
                        className="w-full py-2 px-3 outline-none text-gray-700 placeholder-[#FF2C2C]/60"
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;