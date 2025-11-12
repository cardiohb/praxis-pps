import { Link } from 'react-router-dom';
import { Plus, FileText, CheckCircle, FileEdit, Clock } from 'lucide-react';
import { useProcesses } from '../hooks/useProcesses';
import { useSearch } from '../hooks/useSearch';
import { getUniqueCategories } from '../utils/helpers';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import StatCard from '../components/StatCard';
import ProcessCard from '../components/ProcessCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProcessList = () => {
  const { processes, loading, error, refetch } = useProcesses();
  const { filteredProcesses, searchTerm, setSearchTerm, filters, setFilters } = useSearch(processes);

  // Calculate statistics
  const stats = {
    total: processes.length,
    active: processes.filter(p => p.status === 'active').length,
    draft: processes.filter(p => p.status === 'draft').length,
    lastUpdated: processes.length > 0
      ? new Date(Math.max(...processes.map(p => new Date(p.updated_at || p.created_at)))).toLocaleDateString('de-DE')
      : 'N/A',
  };

  // Get unique categories for filter
  const availableCategories = getUniqueCategories(processes);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner text="Prozesse werden geladen..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prozess-Übersicht</h1>
          <p className="text-gray-600 mt-2">
            Dokumentierte Prozesse der Kardiologisch-Angiologischen Praxis Bremen
          </p>
        </div>
        <Link
          to="/new"
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Neuer Prozess</span>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Gesamt"
          value={stats.total}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Aktive Prozesse"
          value={stats.active}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Entwürfe"
          value={stats.draft}
          icon={FileEdit}
          color="yellow"
        />
        <StatCard
          title="Zuletzt aktualisiert"
          value={stats.lastUpdated}
          icon={Clock}
          color="gray"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Suche nach Name, Kategorie oder Beschreibung..."
        />
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Sortierung</h2>
        <FilterChips
          filters={filters}
          onFilterChange={setFilters}
          availableCategories={availableCategories}
        />
      </div>

      {/* Process Grid */}
      {filteredProcesses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Keine Prozesse gefunden
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filters.status !== 'all' || filters.category !== 'all'
              ? 'Versuche andere Suchbegriffe oder Filter'
              : 'Erstelle deinen ersten Prozess'}
          </p>
          <Link
            to="/new"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Neuer Prozess</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {filteredProcesses.length} {filteredProcesses.length === 1 ? 'Prozess' : 'Prozesse'} gefunden
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProcesses.map((process) => (
              <ProcessCard key={process.id} process={process} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProcessList;
