import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search for spiritual vitamins..." }) => {
  return (
    <div className="max-w-xl mx-auto relative">
      <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden pl-5 pr-2 py-2">
        <Search className="text-red-400 h-5 w-5 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-none outline-none pl-3 py-2 text-gray-700 placeholder-gray-400"
        />
        {value && (
          <button 
            onClick={() => onChange({ target: { value: '' } })}
            className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;