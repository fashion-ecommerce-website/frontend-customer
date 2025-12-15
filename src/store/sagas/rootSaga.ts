import { loginSaga } from '../../features/auth/login';
import { homeSaga } from '../../features/home';
import { profileSaga } from '../../features/profile/redux/profileSaga';
import { productDetailSaga } from '../../features/product-detail';
import { addressSaga } from '../../features/profile/redux/addressSaga';
import { orderSaga } from '../../features/order/redux';
import { cartSaga } from '../../features/cart/redux/cartSaga';
import { wishlistSaga } from '../../features/profile/redux/wishlistSaga';
import { reviewSaga } from '../../features/profile/redux/reviewSaga';
import { sizeRecommendationSaga } from '../../features/size-recommendation/redux';
import { refundSaga } from '../../features/profile/redux/refundSaga';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { all, fork } = effects;

export function* rootSaga(): Generator<unknown, void, unknown> {
  yield all([
    fork(loginSaga),
    fork(homeSaga),
    fork(profileSaga),
    fork(productDetailSaga),
    fork(addressSaga),
    fork(orderSaga),
    fork(cartSaga),
    fork(wishlistSaga),
    fork(reviewSaga),
    fork(sizeRecommendationSaga),
    fork(refundSaga),
  ]);
}
