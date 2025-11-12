import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Fehler</h3>
          <p className="text-red-700">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Erneut versuchen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
