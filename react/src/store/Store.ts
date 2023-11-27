import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import travelReducer from './appSlices/TravelSlice';
import formReducer from './appSlices/FormSlice';
import authReducer from './appSlices/AuthSlice';
import socketReducer from './appSlices/SocketSlice';

export const store = configureStore({
  reducer: {
    travel: travelReducer,
    form: formReducer,
    auth: authReducer,
    socket: socketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useReduxDispatch: () => AppDispatch = useDispatch;
export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;
