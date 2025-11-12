import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = 'Prozesse durchsuchen...' }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
