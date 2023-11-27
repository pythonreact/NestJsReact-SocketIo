import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FormState = {
  initAnim: boolean;
  refreshAnim: boolean;
};

const initialState: FormState = {
  initAnim: false,
  refreshAnim: false,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setInitAnim(state, action: PayloadAction<boolean>) {
      state.initAnim = action.payload;
    },
    setRefreshAnim(state, action: PayloadAction<boolean>) {
      state.refreshAnim = action.payload;
    },
  },
});

export const formActions = formSlice.actions;
export default formSlice.reducer;
