import { useState, useEffect } from 'react';
import { processApi, getErrorMessage } from '../services/api';

/**
 * Custom hook to fetch and manage a single process
 * @param {string} id - Process ID
 * @returns {Object} { process, loading, error, refetch, updateProcess, deleteProcess }
 */
export const useProcess = (id) => {
  const [process, setProcess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProcess = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await processApi.getById(id);
      setProcess(data.process || data);
    } catch (err) {
      console.error('Error fetching process:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateProcess = async (processData) => {
    try {
      setError(null);
      const data = await processApi.update(id, processData);
      setProcess(data.process || data);
      return { success: true, data };
    } catch (err) {
      console.error('Error updating process:', err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const deleteProcess = async () => {
    try {
      setError(null);
      await processApi.delete(id);
      return { success: true };
    } catch (err) {
      console.error('Error deleting process:', err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    fetchProcess();
  }, [id]);

  return {
    process,
    loading,
    error,
    refetch: fetchProcess,
    updateProcess,
    deleteProcess,
  };
};

export default useProcess;
