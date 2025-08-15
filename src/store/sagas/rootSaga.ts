import { all, fork } from 'redux-saga/effects';
import { loginSaga } from '../../features/auth/login';
import { homeSaga } from '../../features/home';

export function* rootSaga() {
  yield all([
    fork(loginSaga),
    fork(homeSaga),
  ]);
}
