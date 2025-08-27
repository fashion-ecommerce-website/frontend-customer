import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../features/auth/login';
import { homeReducer } from '../features/home';
import { profileReducer } from '../features/profile/redux/profileSlice';

export const rootReducer = combineReducers({
  login: loginReducer,
  home: homeReducer,
  profile: profileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
