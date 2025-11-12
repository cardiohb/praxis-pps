import { useState, useMemo } from 'react';

/**
 * Custom hook for searching and filtering processes
 * @param {Array} processes - Array of processes to search
 * @returns {Object} { filteredProcesses, searchTerm, setSearchTerm, filters, setFilters }
 */
export const useSearch = (processes) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'active', 'draft'
    category: 'all', // 'all' or specific category
    sortBy: 'name', // 'name', 'created', 'updated'
    sortOrder: 'asc', // 'asc', 'desc'
  });

  // Filter and search processes
  const filteredProcesses = useMemo(() => {
    if (!processes) return [];

    let filtered = [...processes];

    // Search by name, category, or description
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((process) => {
        const name = process.name?.toLowerCase() || '';
        const category = process.category?.toLowerCase() || '';
        const description = process.description?.toLowerCase() || '';
        return name.includes(search) || category.includes(search) || description.includes(search);
      });
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter((process) => process.status === filters.status);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter((process) => process.category === filters.category);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'created':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case 'updated':
          aValue = new Date(a.updated_at || 0);
          bValue = new Date(b.updated_at || 0);
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [processes, searchTerm, filters]);

  return {
    filteredProcesses,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
  };
};

export default useSearch;
