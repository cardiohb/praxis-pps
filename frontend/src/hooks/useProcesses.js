import { useState, useEffect } from 'react';
import { processApi, getErrorMessage } from '../services/api';

/**
 * Custom hook to fetch and manage all processes
 * @returns {Object} { processes, loading, error, refetch }
 */
export const useProcesses = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await processApi.getAll();
      setProcesses(data.processes || []);
    } catch (err) {
      console.error('Error fetching processes:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  return {
    processes,
    loading,
    error,
    refetch: fetchProcesses,
  };
};

export default useProcesses;
