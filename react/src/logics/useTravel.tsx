import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MuiTable } from '../components/travel/MuiTable';

export const API_AUTH = process.env.API_AUTH || 'http://localhost:5000/auth';
export const API_ITINERARIES = process.env.API_ITINERARIES || 'http://localhost:5000/itineraries';

export const useTravel = () => {
  const queryClient = new QueryClient();

  const Table = () => {
    return (
      <>
        <div className="h-[calc(100vh-(1.7vw+3vh)-7vh)]">
          <div className="mx-10">
            <QueryClientProvider client={queryClient}>
              <MuiTable />
            </QueryClientProvider>
          </div>
        </div>
      </>
    );
  };

  return { Table };
};
