import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SocketState = {
  isConnected: boolean;
  connectedId: string;
};

const initialState: SocketState = {
  isConnected: false,
  connectedId: '',
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setConnectedId(state, action: PayloadAction<string>) {
      state.connectedId = action.payload;
    },
  },
});

export const socketActions = socketSlice.actions;
export default socketSlice.reducer;
