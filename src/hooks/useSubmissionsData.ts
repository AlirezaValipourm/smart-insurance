'use client';

import { useState } from 'react';

/**
 * Custom hook for fetching and managing submissions data (mock implementation)
 * @returns Object with submissions data and related functions
 */
export const useSubmissionsData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock submissions data
  const submissions = [
    {
      id: '1',
      'Full Name': 'John Doe',
      'Age': 28,
      'Insurance Type': 'Health',
      'City': 'New York',
      'Status': 'Pending',
      'Email': 'john@example.com',
      'Phone': '123-456-7890',
    },
    {
      id: '2',
      'Full Name': 'Jane Smith',
      'Age': 32,
      'Insurance Type': 'Life',
      'City': 'Los Angeles',
      'Status': 'Approved',
      'Email': 'jane@example.com',
      'Phone': '987-654-3210',
    },
  ];
  
  // Mock columns
  const columns = ['Full Name', 'Age', 'Insurance Type', 'City', 'Status', 'Email', 'Phone'];
  
  // Mock refetch function
  const refetch = () => {
    console.log('Refetching submissions data');
  };
  
  return {
    submissions,
    columns,
    totalItems: submissions.length,
    isLoading,
    error,
    refetch,
  };
};

export default useSubmissionsData; 