import React, { useState } from 'react';
import { Itinerary, travelActions } from '../store/appSlices/TravelSlice';
import { MRT_Row, MRT_RowSelectionState, MRT_TableOptions } from 'material-react-table';
import { useAPI } from './useAPI';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useSocket } from './useSocket';
import { authActions } from '../store/appSlices/AuthSlice';

export const useTable = () => {
  const { t } = useTranslation(['home', 'form', 'travel']);
  const textAreYou = t('areYou', { ns: ['travel'] });
  const textAreYouM = t('areYouM', { ns: ['travel'] });
  const dispatch = useReduxDispatch();
  const socketOrAxios = useReduxSelector((state) => state.travel.socketOrAxios);

  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const { fetchedData, createData, updateData, deleteData, deleteBulkData, listIdData, mutate } = useAPI();
  const {
    createData: createSocket,
    updateData: updateSocket,
    deleteData: deleteSocket,
    deleteBulkData: deleteBulkSocket,
    listIdData: listIdSocket,
  } = useSocket();

  const changeSocketAxios = async () => {
    if (socketOrAxios !== 'socket') {
      dispatch(travelActions.setItineraries(fetchedData));
    } else {
      mutate();
    }
    dispatch(travelActions.setAnimatedButtonIndex(0));
    dispatch(authActions.setIsSignedIn(false));
    dispatch(travelActions.setChangeSocketOrAxios(true));
    dispatch(travelActions.setSocketOrAxios(socketOrAxios !== 'socket' ? 'socket' : 'axios'));
  };

  const openDeleteConfirmModal = (row: MRT_Row<Itinerary>) => {
    if (window.confirm(textAreYou)) {
      if (socketOrAxios !== 'socket') {
        deleteData(row.original.id);
      } else deleteSocket(row.original.id);
    }
  };

  const openDeleteSelectedConfirm = (
    selectedRows: MRT_RowSelectionState,
    setRowSelection: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>,
  ) => {
    dispatch(travelActions.setAnimatedButtonIndex(0));
    const originalRowIds = Object.keys(selectedRows).map((key) => key);
    const isMultiple = originalRowIds.length > 1;
    if (window.confirm(isMultiple ? textAreYouM : textAreYou)) {
      if (socketOrAxios !== 'socket') {
        deleteBulkData(originalRowIds);
      } else deleteBulkSocket(originalRowIds);
      setRowSelection({});
    }
  };

  const openBulkCreateModal = () => {
    dispatch(travelActions.setAnimatedButtonIndex(0));
    dispatch(travelActions.setIsBulkCreateModalOpen(true));
  };

  const openRowIdModal = async (row: MRT_Row<Itinerary>) => {
    try {
      if (socketOrAxios !== 'socket') {
        const response = await listIdData(row.original.id);
        dispatch(travelActions.setIsRowIdModalOpen(true));
        dispatch(travelActions.setRowIdData(response));
      } else {
        listIdSocket(row.original.id);
      }
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const validateEmail = (email: string) => {
    return (
      !!email.length &&
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
    );
  };

  const validateData = (data: Itinerary, setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>) => {
    const newObj: { [key: string]: string } = {};
    Object.entries(data).forEach(([key, value]) => {
      const errorText = key === 'email' ? (!validateEmail ? 'Valid Email is required' : '') : !value.length ? `${key} is required` : '';
      newObj[key] = errorText;
    });
    const isError = Object.values(newObj).some((error) => error);
    setValidationErrors(isError ? newObj : {});
    return isError;
  };

  const handleCreateData: MRT_TableOptions<Itinerary>['onCreatingRowSave'] = async ({ values, table, row, exitCreatingMode }) => {
    if (!validateData(values, setValidationErrors)) {
      if (socketOrAxios !== 'socket') {
        createData(values);
      } else createSocket(values);
      table.setCreatingRow(null);
    }
  };

  const handleUpdateData: MRT_TableOptions<Itinerary>['onEditingRowSave'] = async ({ values, table, row, exitEditingMode }) => {
    if (!validateData(values, setValidationErrors)) {
      if (socketOrAxios !== 'socket') {
        updateData(row.id, values);
      } else updateSocket(row.id, values);
      table.setEditingRow(null);
    }
  };

  return {
    handleCreateData,
    handleUpdateData,
    validationErrors,
    setValidationErrors,
    openDeleteConfirmModal,
    openDeleteSelectedConfirm,
    openBulkCreateModal,
    openRowIdModal,
    changeSocketAxios,
  };
};
