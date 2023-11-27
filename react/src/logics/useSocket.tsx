import React, { useCallback, useEffect } from 'react';
import { User, authActions } from '../store/appSlices/AuthSlice';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { travelActions } from '../store/appSlices/TravelSlice';
import { socketActions } from '../store/appSlices/SocketSlice';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import socketIOClient from 'socket.io-client';
import useSWR from 'swr';

const PORT = process.env.API_SOCKET || 'http://localhost:5000';
export const socket = socketIOClient(PORT);

export const useSocket = () => {
  const { t } = useTranslation(['home', 'form', 'travel']);
  const textSuccesFullSignIn = t('textSuccessFullSignIn', { ns: ['form'] });
  const textSuccesFullSignOut = t('textSuccessFullSignOut', { ns: ['form'] });
  const textSuccesFullSignUp = t('textSuccessFullSignUp', { ns: ['form'] });
  const dispatch = useReduxDispatch();
  const token = useReduxSelector((state) => state.auth.token);

  const addToken = useCallback(
    (data: any) => {
      if (token) {
        const response = { token, data: data };
        return response;
      } else {
        return data;
      }
    },
    [token],
  );

  const fetchData = useCallback(async () => {
    try {
      socket.emit('fetchData');
      socket.on('responseFetchData', (data) => {
        dispatch(travelActions.setItineraries(data));
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  }, [dispatch]);

  const {
    data: fetchedDataSocket = [],
    error: isLoadingDataErrorSocket,
    isLoading: isLoadingDataSocket,
    isValidating: isFetchingDataSocket,
    mutate,
  } = useSWR('swrKey', fetchData);

  useEffect(() => {
    dispatch(socketActions.setIsConnected(socket.connected));
    dispatch(socketActions.setConnectedId(socket.id));

    const onConnect = (id: string) => {
      dispatch(socketActions.setIsConnected(true));
      dispatch(socketActions.setConnectedId(id));
    };

    const onDisconnect = () => {
      dispatch(socketActions.setIsConnected(false));
      dispatch(socketActions.setConnectedId(''));
    };

    socket.on('connected', onConnect);
    socket.on('disconnected', onDisconnect);
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [dispatch, mutate]);

  useEffect(() => {
    return () => {
      socket.off('responseCreate');
      socket.off('responseUpdate');
      socket.off('responseDelete');
      socket.off('responseListId');
      socket.off('responseBulkDelete');
      socket.off('responseBulkCreate');
      socket.off('responseSignIn');
      socket.off('responseSignOut');
      socket.off('responseSignUp');
    };
  }, []);

  const createData = async (data: any) => {
    try {
      socket.emit('create', addToken(data));
      socket.on('responseCreate', async () => {
        await mutate();
        socket.off('responseCreate');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const updateData = async (id: string, data: any) => {
    try {
      socket.emit('update', addToken({ id, data }));
      socket.on('responseUpdate', async () => {
        await mutate();
        socket.off('responseUpdate');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const deleteData = async (id: string) => {
    try {
      socket.emit('delete', addToken(id));
      socket.on('responseDelete', async () => {
        await mutate();
        socket.off('responseDelete');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const deleteBulkData = async (data: string[]) => {
    try {
      socket.emit('bulkDelete', addToken(JSON.stringify(data)));
      socket.on('responseBulkDelete', async () => {
        await mutate();
        socket.off('responseBulkDelete');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const createBulkData = async (data: string) => {
    const number = {
      number: data,
    };
    try {
      socket.emit('bulkCreate', addToken(number));
      socket.on('responseBulkCreate', (data) => {
        dispatch(travelActions.setItineraries(data));
        dispatch(travelActions.setIsBulkCreateModalOpen(false));
        socket.off('responseBulkCreate');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const listIdData = async (id: string) => {
    try {
      socket.emit('listId', addToken(id));
      socket.on('responseListId', (data) => {
        dispatch(travelActions.setRowIdData(data));
        dispatch(travelActions.setIsRowIdModalOpen(true));
        socket.off('responseListId');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignIn = async (data: User) => {
    try {
      socket.emit('signIn', data);
      socket.on('responseSignIn', (token) => {
        dispatch(authActions.setAuthTokens({ token: token, refreshToken: '' }));
        dispatch(authActions.setIsSignedIn(true));
        toast.success(`${textSuccesFullSignIn}`);
        socket.off('responseSignIn');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignOut = async (data: User) => {
    try {
      socket.emit('signOut', data);
      socket.on('responseSignOut', () => {
        dispatch(authActions.setIsSignedIn(false));
        dispatch(authActions.setAuthTokens({ token: '', refreshToken: '' }));
        dispatch(authActions.logout());
        toast.success(`${textSuccesFullSignOut}`);
        socket.off('responseSignOut');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignUp = async (data: User) => {
    try {
      socket.emit('signUp', data);
      socket.on('responseSignUp', (token) => {
        dispatch(authActions.setAuthTokens({ token: token, refreshToken: '' }));
        toast.success(`${textSuccesFullSignUp} token: ${JSON.stringify(token.token)}`);
        socket.off('responseSignUp');
      });
    } catch (error) {
      const err = error as any;
      toast.error(`${err.response?.statusText}`);
    }
  };

  return {
    fetchData,
    fetchedDataSocket,
    isLoadingDataErrorSocket,
    isLoadingDataSocket,
    isFetchingDataSocket,
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
