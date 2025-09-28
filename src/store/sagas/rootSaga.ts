import { loginSaga } from '../../features/auth/login';
import { homeSaga } from '../../features/home';
import { profileSaga } from '../../features/profile/redux/profileSaga';
import { productDetailSaga } from '../../features/product-detail';
import { addressSaga } from '../../features/profile/redux/addressSaga';
import { orderSaga } from '../../features/order/redux';

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
  ]);
}
