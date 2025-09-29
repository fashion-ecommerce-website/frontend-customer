import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../features/auth/login';
import { homeReducer } from '../features/home';
import { profileReducer } from '../features/profile/redux/profileSlice';
import { productDetailReducer } from '../features/product-detail';
import { addressReducer } from '../features/profile/redux/addressSlice';
import { cartReducer } from '../features/cart/redux/cartSlice';
import { wishlistReducer } from '../features/profile/redux/wishlistSlice';

export const rootReducer = combineReducers({
  login: loginReducer,
  home: homeReducer,
  profile: profileReducer,
  productDetail: productDetailReducer,
  address: addressReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
