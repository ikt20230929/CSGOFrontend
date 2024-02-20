import { configureStore, createSlice } from '@reduxjs/toolkit';
import { rememberEnhancer, rememberReducer } from 'redux-remember';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    profile: [],
    inventory: [],
    cases: []
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setInventory: (state, action) => {
      state.inventory = action.payload;
    },
    setCases: (state, action) => {
      state.cases = action.payload;
    }  
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

const reducers = {
  data: dataSlice.reducer,
  auth: authSlice.reducer
};

export const actions = {
  ...dataSlice.actions,
  ...authSlice.actions
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