import React, { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_RowSelectionState,
  MRT_SelectCheckbox,
} from 'material-react-table';
import { Box, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Itinerary, travelActions } from '../../store/appSlices/TravelSlice';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { useTable } from '../../logics/useTable';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_HU } from 'material-react-table/locales/hu';
import { useTranslation } from 'react-i18next';
import { usStates } from '../../utils/usStates';
import { ArrowDropDownCircle } from '@mui/icons-material';
import { RowIdModal } from './RowIdModal';
import { BulkCreateModal } from './BulkCreateModal';
import { AnimatedButtons } from '../ui/AnimatedButtons';
import { useAPI } from '../../logics/useAPI';
import { useSocket } from '../../logics/useSocket';
import { Buttons } from '../ui/Buttons';

const dataColumns = [
  {
    accessorKey: 'name',
    type: 'string',
  },
  {
    accessorKey: 'departure',
    type: 'string',
  },
  {
    accessorKey: 'arrival',
    type: 'string',
  },
  {
    accessorKey: 'stops',
    editVariant: 'select',
    editSelectOptions: usStates,
  },
];

type muiColumns = {
  accessorKey: string;
  header: string;
  editVariant: 'select' | 'text' | undefined;
  editSelectOptions: string[] | undefined;
  muiEditTextFieldProps: {
    select: boolean;
    type: string | undefined;
    required: boolean;
    error: boolean;
    helperText: string | undefined;
    onFocus: () => void;
  };
};

export const MuiTable: React.FC = () => {
  const { t, i18n } = useTranslation(['home', 'form', 'travel', 'header']);
  const textEdit = t('edit', { ns: ['travel'] });
  const textDelete = t('delete', { ns: ['travel'] });
  const textDetailView = t('detailView', { ns: ['travel'] });
  const textSignInFirst = t('signInFirst', { ns: ['travel'] });
  const textCreateData = t('createData', { ns: ['travel'] });
  const textEditData = t('editData', { ns: ['travel'] });
  const textErrorLoading = t('muiErrorLoading', { ns: ['travel'] });
  const textCreateBulk = t('createBulk', { ns: ['travel'] });
  const textCreate = t('create', { ns: ['travel'] });
  const textSelected = t('selected', { ns: ['travel'] });
  const textNoData = t('noData', { ns: ['travel'] });
  const textConnected = t('connected', { ns: ['socket'] });
  const textDisconnected = t('disconnected', { ns: ['travel'] });
  const textChangeToSocket = t('changeToSocket', { ns: ['socket'] });
  const textChangeToHttp = t('changeToHttp', { ns: ['socket'] });

  const dispatch = useReduxDispatch();
  const isSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const animatedButtonIndex = useReduxSelector((state) => state.travel.animatedButtonIndex);
  const isRowIdModalOpen = useReduxSelector((state) => state.travel.isRowIdModalOpen);
  const isBulkCreateModalOpen = useReduxSelector((state) => state.travel.isBulkCreateModalOpen);
  const isConnected = useReduxSelector((state) => state.socket.isConnected);
  const connectId = useReduxSelector((state) => state.socket.connectedId);
  const itineraries = useReduxSelector((state) => state.travel.itineraries);
  const socketOrAxios = useReduxSelector((state) => state.travel.socketOrAxios);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const {
    validationErrors,
    setValidationErrors,
    handleCreateData,
    handleUpdateData,
    openDeleteConfirmModal,
    openDeleteSelectedConfirm,
    openBulkCreateModal,
    openRowIdModal,
    changeSocketAxios,
  } = useTable();

  const { fetchedData = [], isLoadingDataError, isLoadingData, isFetchingData } = useAPI();
  const { fetchedDataSocket = [], isLoadingDataErrorSocket, isLoadingDataSocket, isFetchingDataSocket } = useSocket();

  const onCreate = () => {
    dispatch(travelActions.setAnimatedButtonIndex(0));
    table.setCreatingRow(true);
  };

  const columns = useMemo<MRT_ColumnDef<Itinerary>[]>(() => {
    const mui = [] as muiColumns[];
    dataColumns.forEach((item) => {
      const muiData = {
        accessorKey: item.accessorKey,
        header: t(`${item.accessorKey}`, { ns: ['header'] }),
        editVariant: item.editVariant ? (item.editVariant as 'select' | 'text') : undefined,
        editSelectOptions: item.editSelectOptions,
        muiEditTextFieldProps: {
          select: item.editVariant ? true : false,
          type: item.type ? item.type : undefined,
          required: true,
          error: !!validationErrors?.[item.accessorKey],
          helperText: validationErrors?.[item.accessorKey],
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              [item.accessorKey]: undefined,
            }),
        },
      };
      mui.push(muiData);
    });
    return mui;
  }, [setValidationErrors, t, validationErrors]);

  const table = useMaterialReactTable({
    columns,
    data: (socketOrAxios !== 'socket' && fetchedData) || (socketOrAxios === 'socket' && itineraries),
    createDisplayMode: 'modal',
    editDisplayMode: 'row',
    enableEditing: true,
    enablePagination: true,
    enableStickyHeader: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    initialState: { density: 'compact' },
    positionActionsColumn: 'first',

    enableRowNumbers: true,
    rowNumberDisplayMode: 'original',
    getRowId: (row) => row.id,

    muiToolbarAlertBannerProps:
      (socketOrAxios !== 'socket' && isLoadingDataError) || (socketOrAxios === 'socket' && isLoadingDataErrorSocket)
        ? {
            color: 'error',
          }
        : undefined,
    positionToolbarAlertBanner:
      (socketOrAxios !== 'socket' && isLoadingDataError) || (socketOrAxios === 'socket' && isLoadingDataErrorSocket) ? 'top' : 'head-overlay', //top, bottom, head-overlay

    enableRowSelection: true,
    // enableMultiRowSelection: true,
    enableSelectAll: true,
    selectAllMode: 'all',
    muiSelectCheckboxProps: {
      color: 'primary',
    },

    onRowSelectionChange: setRowSelection,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateData,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdateData,

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">{textCreateData}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{internalEditComponents}</DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">{textEditData}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>{internalEditComponents}</DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title={isSignedIn ? textEdit : textSignInFirst}>
          <IconButton onClick={() => (isSignedIn ? table.setEditingRow(row) : '')}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={isSignedIn ? textDelete : textSignInFirst}>
          <IconButton color="error" onClick={() => (isSignedIn ? openDeleteConfirmModal(row) : '')}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={isSignedIn ? textDetailView : textSignInFirst}>
          <IconButton color="primary" onClick={() => (isSignedIn ? openRowIdModal(row) : '')}>
            <ArrowDropDownCircle />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div className="flex">
          <div className="flex gap-5 pb-5">
            <AnimatedButtons
              isCilckAnimate={animatedButtonIndex === 1}
              onClick={() => dispatch(travelActions.setAnimatedButtonIndex(1))}
              onFunction={openBulkCreateModal}
              disabled={animatedButtonIndex === 1 || !isSignedIn}
              size="md"
              className="mt-5"
              spanClassName="text-[calc(2.5vh)] mobile:text-[calc(1vw+1vh)]"
              spanItem={textCreateBulk}
              tooltip={!isSignedIn && textSignInFirst}
            />
            <AnimatedButtons
              isCilckAnimate={animatedButtonIndex === 2}
              onClick={() => dispatch(travelActions.setAnimatedButtonIndex(2))}
              onFunction={onCreate}
              disabled={animatedButtonIndex === 2 || !isSignedIn}
              size="md"
              className="mt-5"
              spanClassName="text-[calc(2.5vh)] mobile:text-[calc(1vw+1vh)]"
              spanItem={textCreate}
              tooltip={!isSignedIn && textSignInFirst}
            />
          </div>
          <div className="flex justify-end items-center gap-5 pb-5 pl-10">
            <AnimatedButtons
              isCilckAnimate={animatedButtonIndex === 8}
              onClick={() => dispatch(travelActions.setAnimatedButtonIndex(8))}
              onFunction={changeSocketAxios}
              size="md"
              className="mt-5"
              spanClassName="text-[calc(2.5vh)] mobile:text-[calc(1vw+1vh)]"
              spanItem={socketOrAxios !== 'socket' ? 'Http' : 'Socket'}
              tooltip={socketOrAxios !== 'socket' ? textChangeToSocket : textChangeToHttp}
            />

            <Buttons
              size="sm"
              className="mt-5"
              spanClassName="text-[calc(2.5vh)] mobile:text-[calc(1vw+1vh)]"
              spanItem={isConnected ? textConnected : textDisconnected}
              tooltip={isConnected && connectId}
              hidden={socketOrAxios !== 'socket'}
            />
          </div>
        </div>
      </>
    ),

    renderToolbarAlertBannerContent: ({ selectedAlert, table }) => (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {!((socketOrAxios !== 'socket' && isLoadingDataError) || (socketOrAxios === 'socket' && isLoadingDataErrorSocket)) ? (
            <>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  gap: '6px',
                  p: '4px 12px',
                  width: '100%',
                }}
              >
                <MRT_SelectCheckbox selectAll table={table} /> {selectedAlert}{' '}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '6px',
                }}
              >
                <AnimatedButtons
                  isCilckAnimate={animatedButtonIndex === 3}
                  onClick={() => dispatch(travelActions.setAnimatedButtonIndex(3))}
                  onFunction={() => openDeleteSelectedConfirm(rowSelection, setRowSelection)}
                  disabled={animatedButtonIndex === 3 || !isSignedIn}
                  size="xs"
                  className="mt-5 text-red-500"
                  spanClassName="flex justify-center items-center text-[calc(2.5vh)] mobile:text-[calc(1vw+1vh)]"
                  spanItem={
                    <>
                      <DeleteIcon />
                      {textSelected}
                    </>
                  }
                  tooltip={!isSignedIn && textSignInFirst}
                  error={true}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ p: '5px' }}>{textErrorLoading}</Box>
          )}
        </Box>
      </>
    ),

    renderEmptyRowsFallback: () => <Typography>{`${textNoData} 😳`}</Typography>,

    state: {
      rowSelection,
      isLoading: (socketOrAxios !== 'socket' && isLoadingData) || (socketOrAxios === 'socket' && isLoadingDataSocket),
      // isSaving: isCreatingData || isUpdatingData || isDeletingData,
      showAlertBanner: (socketOrAxios !== 'socket' && isLoadingDataError) || (socketOrAxios === 'socket' && isLoadingDataErrorSocket),
      showProgressBars: (socketOrAxios !== 'socket' && isFetchingData) || (socketOrAxios === 'socket' && isFetchingDataSocket),
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: {
          xs: '100px',
          sm: '150px',
          md: '300px',
          lg: '500px',
          xl: '1000px',
        },
      },
    },
    localization: i18n.language === 'en' ? MRT_Localization_EN : MRT_Localization_HU,
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {isRowIdModalOpen && <RowIdModal />}
      {isBulkCreateModalOpen && <BulkCreateModal />}
    </>
  );
};
