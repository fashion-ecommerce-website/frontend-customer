import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../features/auth/login';
import { homeReducer } from '../features/home';
import { profileReducer } from '../features/profile/redux/profileSlice';
import { productDetailReducer } from '../features/product-detail';
import { addressReducer } from '../features/profile/redux/addressSlice';
import { orderReducer } from '../features/order/redux';
import { cartReducer } from '../features/cart/redux/cartSlice';
import { wishlistReducer } from '../features/profile/redux/wishlistSlice';
import { default as reviewReducer } from '../features/profile/redux/reviewSlice';

export const rootReducer = combineReducers({
  login: loginReducer,
  home: homeReducer,
  profile: profileReducer,
  productDetail: productDetailReducer,
  address: addressReducer,
  order: orderReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  review: reviewReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
