import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getStatusColor, getCategoryIcon, formatRelativeTime, truncateText } from '../utils/helpers';

const ProcessCard = ({ process }) => {
  const IconComponent = Icons[getCategoryIcon(process.category)] || Icons.FileText;
  const statusColorClass = getStatusColor(process.status);

  return (
    <Link
      to={`/process/${process.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200"
    >
      <div className="p-6">
        {/* Header with Icon and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <IconComponent className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {process.name}
              </h3>
              <p className="text-sm text-gray-500">{process.category}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColorClass}`}>
            {process.status === 'active' ? 'Aktiv' : 'Entwurf'}
          </span>
        </div>

        {/* Description */}
        {process.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {truncateText(process.description, 120)}
          </p>
        )}

        {/* Footer with Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Icons.List className="h-4 w-4" />
              <span>{process.steps?.length || 0} Schritte</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {formatRelativeTime(process.updated_at)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProcessCard;
