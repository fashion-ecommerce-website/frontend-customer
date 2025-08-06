import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../features/auth/login';

export const rootReducer = combineReducers({
  login: loginReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
