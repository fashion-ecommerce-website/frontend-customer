import { loginSaga } from '../../features/auth/login';
import { profileSaga } from '../../features/profile/redux/profileSaga';

const effects = require('redux-saga/effects');
const { all, fork } = effects;

export function* rootSaga(): Generator<any, void, unknown> {
  yield all([
    fork(loginSaga),
    fork(profileSaga),
  ]);
}
