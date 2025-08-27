import { loginSaga } from '../../features/auth/login';
import { profileSaga } from '../../features/profile/redux/profileSaga';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { all, fork } = effects;

export function* rootSaga(): Generator<unknown, void, unknown> {
  yield all([
    fork(loginSaga),
    fork(profileSaga),
  ]);
}
