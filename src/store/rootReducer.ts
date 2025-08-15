import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../features/auth/login';
import { homeReducer } from '../features/home';

export const rootReducer = combineReducers({
  login: loginReducer,
  home: homeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
