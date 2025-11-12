/**
 * Format date to German locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';

  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format date to relative time (z.B. "vor 2 Tagen")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';

  const now = new Date();
  const diffMs = now - d;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'gerade eben';
  if (diffMinutes < 60) return `vor ${diffMinutes} Minute${diffMinutes > 1 ? 'n' : ''}`;
  if (diffHours < 24) return `vor ${diffHours} Stunde${diffHours > 1 ? 'n' : ''}`;
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

  return formatDate(date);
};

/**
 * Get status badge color
 * @param {string} status - Process status
 * @returns {string} Tailwind CSS classes for badge
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'aktiv':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'draft':
    case 'entwurf':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'archived':
    case 'archiviert':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

/**
 * Get category icon name
 * @param {string} category - Process category
 * @returns {string} Icon name for lucide-react
 */
export const getCategoryIcon = (category) => {
  const categoryLower = category?.toLowerCase() || '';

  if (categoryLower.includes('anmeld')) return 'UserPlus';
  if (categoryLower.includes('aufnahme')) return 'ClipboardCheck';
  if (categoryLower.includes('untersuch')) return 'Stethoscope';
  if (categoryLower.includes('befund')) return 'FileText';
  if (categoryLower.includes('abrechnung')) return 'CreditCard';
  if (categoryLower.includes('dokumentation')) return 'FolderOpen';

  return 'FileText';
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get unique categories from processes
 * @param {Array} processes - Array of processes
 * @returns {Array} Unique categories
 */
export const getUniqueCategories = (processes) => {
  if (!processes || !Array.isArray(processes)) return [];

  const categories = processes
    .map(p => p.category)
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);

  return categories.sort();
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
