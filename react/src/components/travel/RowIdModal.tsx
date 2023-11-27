import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { travelActions } from '../../store/appSlices/TravelSlice';
import { useTranslation } from 'react-i18next';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const RowIdModal: React.FC = () => {
  const { t } = useTranslation(['home', 'form', 'travel', 'header']);
  const textDetailView = t('detailView', { ns: ['travel'] });
  const dispatch = useReduxDispatch();
  const isRowIdModalOpen = useReduxSelector((state) => state.travel.isRowIdModalOpen);
  const rowIdData = useReduxSelector((state) => state.travel.rowIdData);

  const handleClose = () => {
    dispatch(travelActions.setIsRowIdModalOpen(false));
  };

  return (
    <React.Fragment>
      <Dialog
        open={isRowIdModalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        className="w-full"
      >
        <DialogTitle className="text-blue-600" variant="h5">
          {textDetailView}
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
        <DialogContent>
          <DialogContentText id="dialog-slide-description">
            <table className="w-full">
              <tbody>
                {Object.entries(rowIdData).map(([key, value]) => {
                  return (
                    <tr className="px-5 py-1 flex justify-start" key={key}>
                      <td className="w-[100px]">
                        <span className="text-blue-600">{t(`${key}`, { ns: ['header'] })}:</span>
                      </td>
                      <td className="pl-5">
                        <span>{value}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
