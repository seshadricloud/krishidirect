import { useState, useEffect } from 'react';
import api from '../services/apiClient';

/**
 * Custom hook for fetching data from an API.
 * 
 * @param {string} url - The endpoint to fetch data from.
 * @param {object} options - Optional configuration for the fetch request.
 * @returns {object} - An object containing the data, loading state, and error.
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(url, options);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, loading, error };
};

export default useFetch;