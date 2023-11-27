import React from 'react';
import { API_AUTH, API_ITINERARIES } from './useTravel';
import { useAxios } from './useAxios';
import { User } from '../store/appSlices/AuthSlice';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useSWR from 'swr';

export const useAPI = () => {
  const { fileAPI } = useAxios();
  const {
    data: fetchedData = [],
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
    mutate,
  } = useSWR([API_ITINERARIES, 'GET', ''], ([url, method, body]) => fileAPI(url, method, body));

  const createData = async (data: any) => {
    try {
      const response = await fileAPI(API_ITINERARIES, 'POST', JSON.stringify(data));
      mutate();
      return response;
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const updateData = async (id: string, data: any) => {
    try {
      const response = await fileAPI(`${API_ITINERARIES}/${id}`, 'PATCH', JSON.stringify(data));
      mutate();
      return response;
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const deleteData = async (id: string) => {
    try {
      const response = await fileAPI(`${API_ITINERARIES}/${id}`, 'DELETE');
      mutate();
      return response;
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const deleteBulkData = async (data: string[]) => {
    try {
      const response = await fileAPI(`${API_ITINERARIES}/bulkdelete`, 'DELETE', JSON.stringify(data));
      mutate();
      return response;
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const createBulkData = async (data: string) => {
    try {
      const response = await fileAPI(`${API_ITINERARIES}/bulkcreate`, 'POST', JSON.stringify({ number: data }));
      mutate();
      return response;
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const listIdData = async (id: string) => {
    try {
      const response = await fileAPI(`${API_ITINERARIES}/${id}`, 'GET');
      return response;
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignIn = async (data: User) => {
    try {
      return await fileAPI(API_AUTH + '/signin', 'POST', JSON.stringify(data));
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignOut = async (data: User) => {
    try {
      return await fileAPI(API_AUTH + '/signout', 'POST', JSON.stringify(data));
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignUp = async (data: User) => {
    try {
      return await fileAPI(API_AUTH + '/signup', 'POST', JSON.stringify(data));
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  return {
    fetchedData,
    isLoadingDataError,
    isLoadingData,
    isFetchingData,
    mutate,
    createData,
    updateData,
    deleteData,
    deleteBulkData,
    createBulkData,
    listIdData,
    userSignIn,
    userSignOut,
    userSignUp,
  };
};
