'use client';

import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { insuranceApi } from '../services/api';
import {
  setSubmissions,
  setLoading,
  setError,
} from '../store/slices/submissionsSlice';
import { RootState } from '../store';
import { useMemo } from 'react';

/**
 * Custom hook for fetching and managing submissions data
 * @returns Object with submissions data and related functions
 */
export const useSubmissionsData = () => {
  const dispatch = useDispatch();

  const {
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    searchTerm,
  } = useSelector((state: RootState) => state.submissions);

  // Query for fetching submissions
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const response = await insuranceApi.getSubmissions();

        dispatch(setSubmissions({
          data: response.data,
          columns: response.columns,
          totalItems: response.totalItems,
        }));

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch submissions';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  const processedData = useMemo(() => {
    if (!data?.data) return { submissions: [], totalItems: 0 };

    let filteredData = [...data.data];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        return Object.entries(item).some(([key, value]) => {
          if (key === 'id') return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    if (sortBy) {
      filteredData.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }

        const strA = String(valueA).toLowerCase();
        const strB = String(valueB).toLowerCase();

        return sortDirection === 'asc'
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    const totalFilteredItems = filteredData.length;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return {
      submissions: paginatedData,
      totalItems: totalFilteredItems,
    };
  }, [data, searchTerm, sortBy, sortDirection, currentPage, itemsPerPage]);

  return {
    submissions: processedData.submissions,
    columns: data?.columns || [],
    totalItems: processedData.totalItems,
    isLoading,
    error,
    refetch,
  };
};

export default useSubmissionsData; 