import { configureStore, createSlice } from '@reduxjs/toolkit';
import { rememberEnhancer, rememberReducer } from 'redux-remember';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    
  },
  reducers: {
    
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    }
  }
})

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    username: null,
    email: null,
    balance: 0,
    isAdmin: false
  },
  reducers: {
    setSession: (state, action) => {
      state.username = action.payload.username;
      state.balance = action.payload.balance;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
    }
  }
})

const reducers = {
  data: dataSlice.reducer,
  auth: authSlice.reducer,
  session: sessionSlice.reducer
};

export const actions = {
  ...dataSlice.actions,
  ...authSlice.actions,
  ...sessionSlice.actions
}

const rememberedKeys = [ 'auth' ];
const reducer = rememberReducer(reducers);
const store = configureStore({
  reducer,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(
    rememberEnhancer(
      window.localStorage,
      rememberedKeys
    )
  )
});

export default store;