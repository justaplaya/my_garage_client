import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';
import { garageSlice } from 'Pages/garage/reducer';
import { GarageStateType } from 'Pages/garage/reducer/types';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { CommonStateType } from './types';

const initialState: CommonStateType = {
  theme: 'dark',
  temp: 0,
};
const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['common'],
};
const commonPersistConfig = {
  key: 'common',
  storage,
  blacklist: ['temp'],
};
const rootSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changeTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    changeTemp(state) {
      state.temp = Math.random() * 1000;
    },
  },
});
export const { changeTheme, changeTemp } = rootSlice.actions;
const rootReducer = combineReducers<{ garage: GarageStateType; common: CommonStateType }>({
  garage: garageSlice.reducer,
  common: persistReducer(commonPersistConfig, rootSlice.reducer),
});
export type RootState = ReturnType<typeof rootReducer>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
