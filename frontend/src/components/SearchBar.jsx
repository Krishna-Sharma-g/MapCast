import { useEffect } from 'react';
import useDebounce from '../hooks/useDebounce.js';

const SearchBar = ({
  query,
  onQueryChange,
  suggestions = [],
  onSelect,
  onSearch,
  loading,
}) => {
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch?.(debouncedQuery);
    } else {
      onSearch?.('');
    }
  }, [debouncedQuery, onSearch]);

  return (
    <div className="bg-white/90 rounded-2xl shadow-lg p-4">
      <label className="block text-sm font-medium text-slate-600">
        Search for a city
      </label>
      <div className="relative mt-2">
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="Start typing (e.g. London)..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center text-brand">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="mt-3 max-h-56 space-y-2 overflow-y-auto">
          {suggestions.map((location) => (
            <li key={location.id}>
              <button
                type="button"
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-left text-sm text-slate-700 hover:border-brand hover:bg-white"
                onClick={() => onSelect(location)}
              >
                {location.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
