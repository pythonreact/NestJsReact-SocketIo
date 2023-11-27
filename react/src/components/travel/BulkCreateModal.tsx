import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Button, DialogActions, IconButton, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { travelActions } from '../../store/appSlices/TravelSlice';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../logics/useAPI';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useSocket } from '../../logics/useSocket';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});
const bulkNumbers = [5, 10, 20, 50, 100, 500, 1000, 5000, 10000];

export const BulkCreateModal: React.FC = () => {
  const { t } = useTranslation(['home', 'form', 'travel']);
  const textBulkCreateModal = t('bulkCreateModal', { ns: ['travel'] });
  const textBulkCreate = t('bulkCreate', { ns: ['travel'] });
  const textNumber = t('number', { ns: ['travel'] });
  const textGenerate = t('generate', { ns: ['travel'] });
  const [value, setValue] = React.useState(5);
  const dispatch = useReduxDispatch();
  const isBulkCreateModalOpen = useReduxSelector((state) => state.travel.isBulkCreateModalOpen);
  const socketOrAxios = useReduxSelector((state) => state.travel.socketOrAxios);

  const { createBulkData } = useAPI();
  const { createBulkData: createBulkSocket } = useSocket();

  const handleClose = () => {
    dispatch(travelActions.setIsBulkCreateModalOpen(false));
  };

  const handleGenerate = async () => {
    try {
      if (socketOrAxios !== 'socket') {
        await createBulkData(value.toString());
        dispatch(travelActions.setIsBulkCreateModalOpen(false));
      } else {
        await createBulkSocket(value.toString());
      }
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const onChangeField = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <React.Fragment>
      <Dialog
        open={isBulkCreateModalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        className="w-full"
      >
        <div className="flex w-[400px]">
          <DialogTitle className="text-blue-600" variant="h5">
            {textBulkCreateModal}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'blue',
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <div className="flex flex-column justify-center items-center w-full">
            <div className="items center">
              <div className="items-center mb-1">{textNumber}</div>
              <Select id="select" value={value} label={textNumber} onChange={onChangeField} autoWidth>
                {bulkNumbers.map((item) => {
                  return (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className="mt-5">
            <DialogContentText id="dialog-slide-description">{textBulkCreate}</DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="m-3">
            <Button variant="contained" onClick={handleGenerate}>
              {textGenerate}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
