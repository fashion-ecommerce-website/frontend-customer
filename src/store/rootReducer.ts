import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../features/auth/login';
import { homeReducer } from '../features/home';
import { profileReducer } from '../features/profile/redux/profileSlice';
import { productDetailReducer } from '../features/product-detail';
import { addressReducer } from '../features/profile/redux/addressSlice';

export const rootReducer = combineReducers({
  login: loginReducer,
  home: homeReducer,
  profile: profileReducer,
  productDetail: productDetailReducer,
  address: addressReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
