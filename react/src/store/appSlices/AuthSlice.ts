import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
  id?: string;
  name?: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
};

type AuthState = {
  isSignedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User;
};

const data = window.localStorage.getItem('TRAVEL_APP_USER');
const hasData = data !== null;

const initialState: AuthState = {
  isSignedIn: false,
  token: null,
  refreshToken: null,
  user: {
    id: hasData ? JSON.parse(data).id : '',
    name: hasData ? JSON.parse(data).name : '',
    email: hasData ? JSON.parse(data).email : '',
    isAdmin: hasData ? JSON.parse(data).isAdmin : '',
    password: hasData ? JSON.parse(data).password : '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsSignedIn(state, action: PayloadAction<boolean>) {
      state.isSignedIn = action.payload;
    },
    setAuthTokens(state, action: PayloadAction<{ token: string; refreshToken: string }>) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setUserId(state, action: PayloadAction<string>) {
      state.user.id = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.user.name = action.payload;
    },
    setUserEmail(state, action: PayloadAction<string>) {
      state.user.email = action.payload;
    },
    setUserIsAdmin(state, action: PayloadAction<boolean>) {
      state.user.isAdmin = action.payload;
    },
    setUserPassword(state, action: PayloadAction<string>) {
      state.user.password = action.payload;
    },
    logout() {
      return initialState;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
