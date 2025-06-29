/**
 * Redux Store Configuration
 * 
 * - Combines all reducers (currently only userReducer).
 * - Configures redux-persist to persist the Redux state in localStorage.
 * - Disables serializableCheck middleware warning for redux-persist compatibility.
 * - Exports both the Redux store and persistor for use in the app.
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userReducer } from '../redux/user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Combine all reducers (add more as needed)
const rootReducer = combineReducers({
  user: userReducer,
});

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

// Create a persisted reducer using redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with persisted reducer and middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
