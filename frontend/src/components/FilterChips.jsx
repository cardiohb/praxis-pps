import { X } from 'lucide-react';

const FilterChips = ({ filters, onFilterChange, availableCategories = [] }) => {
  const statuses = [
    { value: 'all', label: 'Alle Status' },
    { value: 'active', label: 'Aktiv' },
    { value: 'draft', label: 'Entwurf' },
  ];

  const categories = [
    { value: 'all', label: 'Alle Kategorien' },
    ...availableCategories.map(cat => ({ value: cat, label: cat })),
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'created', label: 'Erstellt' },
    { value: 'updated', label: 'Aktualisiert' },
  ];

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => onFilterChange({ ...filters, status: status.value })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.status === status.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => onFilterChange({ ...filters, category: category.value })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.category === category.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sortieren nach</label>
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm"
          >
            {filters.sortOrder === 'asc' ? '↑ Aufsteigend' : '↓ Absteigend'}
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.status !== 'all' || filters.category !== 'all') && (
        <button
          onClick={() =>
            onFilterChange({ ...filters, status: 'all', category: 'all' })
          }
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
          Filter zurücksetzen
        </button>
      )}
    </div>
  );
};

export default FilterChips;
