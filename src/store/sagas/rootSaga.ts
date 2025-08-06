import { all, fork } from 'redux-saga/effects';
import { loginSaga } from '../../features/auth/login';

export function* rootSaga() {
  yield all([
    fork(loginSaga),
  ]);
}
