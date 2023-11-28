import React, { useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../store/Store';

export const useAxios = () => {
  const { t } = useTranslation(['home', 'form', 'travel']);
  const textAxiosFailed = t('axiosFailed', { ns: ['travel'] });
  const token = useReduxSelector((state) => state.auth.token);
  const isError = useRef(false);

  const fileAPI = async (url: string, method: string, data?: string): Promise<any> => {
    const body = data ? data : null;
    try {
      const response = await axios({
        method: method,
        url: url,
        data: method === 'DELETE' ? { data: body } : body,
        headers: token
          ? {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }
          : {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
      });
      const data = await response.data;
      isError.current = false;
      return data;
    } catch (error) {
      const err = error as AxiosError;
      isError.current = false;
      toast.error(`${textAxiosFailed} ${err.response?.statusText}`);
      throw new Error(`${textAxiosFailed} ${err.response?.statusText}`);
    }
  };
  return { fileAPI };
};
