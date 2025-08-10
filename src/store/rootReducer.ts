import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../features/auth/login';
import { profileReducer } from '../features/profile/redux/profileSlice';

export const rootReducer = combineReducers({
  login: loginReducer,
  profile: profileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
