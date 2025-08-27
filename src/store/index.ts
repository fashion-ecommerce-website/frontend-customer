import { configureStore, Middleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, RootState } from './rootReducer';
import { rootSaga } from './sagas/rootSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store with proper middleware typing
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware as Middleware<Record<string, never>, RootState>),
  devTools: process.env.NODE_ENV !== 'production',
});

// Run saga middleware
sagaMiddleware.run(rootSaga);

// Export types
export type AppDispatch = typeof store.dispatch;
export type { RootState };

// Export store
export default store;
