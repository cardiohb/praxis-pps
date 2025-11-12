import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, Copy, CheckCircle, FileEdit, Calendar, Clock } from 'lucide-react';
import { useProcess } from '../hooks/useProcess';
import { formatDate, formatRelativeTime, getStatusColor } from '../utils/helpers';
import ProcessStepsList from '../components/ProcessStepsList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProcessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { process, loading, error, refetch, deleteProcess } = useProcess(id);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    const result = await deleteProcess();
    if (result.success) {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner text="Prozess wird geladen..." />
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

  if (!process) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage error="Prozess nicht gefunden" />
      </div>
    );
  }

  const statusColorClass = getStatusColor(process.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/" className="hover:text-blue-600">Prozesse</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{process.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{process.name}</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusColorClass}`}>
                {process.status === 'active' ? 'Aktiv' : 'Entwurf'}
              </span>
              {process.category && (
                <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                  {process.category}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Link
              to={`/edit/${process.id}`}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              <span>Bearbeiten</span>
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Löschen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Prozess löschen?</h3>
            <p className="text-gray-600 mb-6">
              Möchten Sie den Prozess "{process.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'steps'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Schritte ({process.steps?.length || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Beschreibung</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {process.description || 'Keine Beschreibung verfügbar'}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Erstellt</span>
                  </div>
                  <p className="text-gray-700">{formatDate(process.created_at)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Letzte Änderung</span>
                  </div>
                  <p className="text-gray-700">
                    {formatRelativeTime(process.updated_at)} ({formatDate(process.updated_at)})
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Prozessschritte</h3>
                <Link
                  to={`/edit/${process.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Schritte bearbeiten
                </Link>
              </div>
              <ProcessStepsList steps={process.steps} />
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Zurück zur Übersicht</span>
      </Link>
    </div>
  );
};

export default ProcessDetail;
