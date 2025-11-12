import { ChevronDown, ChevronUp, Clock, User } from 'lucide-react';
import { useState } from 'react';

const ProcessStepItem = ({ step, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Step Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {step.order || index + 1}
          </div>
          <div className="text-left">
            <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
            {step.responsible && (
              <p className="text-sm text-gray-500 mt-1">
                <User className="inline h-4 w-4 mr-1" />
                {step.responsible}
              </p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Step Details (Expanded) */}
      {isExpanded && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {step.description && (
            <p className="text-gray-700 mb-4">{step.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm">
            {step.duration && (
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{step.duration} min</span>
              </div>
            )}
            {step.critical && (
              <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Kritischer Schritt
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProcessStepsList = ({ steps = [] }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Keine Schritte definiert</p>
      </div>
    );
  }

  // Sort steps by order
  const sortedSteps = [...steps].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-3">
      {sortedSteps.map((step, index) => (
        <ProcessStepItem key={index} step={step} index={index} />
      ))}
    </div>
  );
};

export default ProcessStepsList;
