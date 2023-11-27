import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Itinerary = {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  stops: string;
};

export type RowIdData = {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  stops: string;
  userId: string;
  userAdmin: string;
  userEmail: string;
};

type TravelState = {
  itineraries: Itinerary[];
  rowIdData: RowIdData;
  animatedButtonIndex: number;
  isRowIdModalOpen: boolean;
  isBulkCreateModalOpen: boolean;
  socketOrAxios: string;
  changeSocketOrAxios: boolean;
};

const initialState: TravelState = {
  itineraries: [],
  rowIdData: {
    id: '',
    name: '',
    departure: '',
    arrival: '',
    stops: '',
    userId: '',
    userAdmin: '',
    userEmail: '',
  },
  animatedButtonIndex: 0,
  isRowIdModalOpen: false,
  isBulkCreateModalOpen: false,
  socketOrAxios: 'socket',
  changeSocketOrAxios: false,
};

const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    setItineraries(state, action: PayloadAction<Itinerary[]>) {
      state.itineraries = action.payload;
    },
    setRowIdData(state, action: PayloadAction<RowIdData>) {
      state.rowIdData = action.payload;
    },
    setAnimatedButtonIndex(state, action: PayloadAction<number>) {
      state.animatedButtonIndex = action.payload;
    },
    setIsRowIdModalOpen(state, action: PayloadAction<boolean>) {
      state.isRowIdModalOpen = action.payload;
    },
    setIsBulkCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isBulkCreateModalOpen = action.payload;
    },
    setSocketOrAxios(state, action: PayloadAction<string>) {
      state.socketOrAxios = action.payload;
    },
    setChangeSocketOrAxios(state, action: PayloadAction<boolean>) {
      state.changeSocketOrAxios = action.payload;
    },
  },
});
export const travelActions = travelSlice.actions;
export default travelSlice.reducer;
