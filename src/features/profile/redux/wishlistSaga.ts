import { call, put } from 'redux-saga/effects';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { takeLatest } = require('redux-saga/effects');
import { wishlistApiService } from '@/services/api/wishlistApi';
import {
  fetchWishlistRequest,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  toggleWishlistRequest,
  toggleWishlistFailure,
  clearWishlistRequest,
  clearWishlistSuccess,
  clearWishlistFailure,
} from './wishlistSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* handleFetchWishlist(): Generator<any, void, any> {
  try {
    const res = yield call(() => wishlistApiService.getWishlist());
    if (res.success) {
      yield put(fetchWishlistSuccess(res.data || []));
    } else {
      yield put(fetchWishlistFailure(res.message || 'Failed to load wishlist'));
    }
  } catch (e) {
    yield put(fetchWishlistFailure((e as Error).message || 'Failed to load wishlist'));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* handleToggleWishlist(action: ReturnType<typeof toggleWishlistRequest>): Generator<any, void, any> {
  const detailId = action.payload;
  try {
    const res = yield call(() => wishlistApiService.toggle(detailId));
    if (!res.success) {
      yield put(toggleWishlistFailure(res.message || 'Failed to toggle wishlist'));
      return;
    }
    const current = yield call(() => wishlistApiService.getWishlist());
    if (current.success) {
      yield put(fetchWishlistSuccess(current.data || []));
    } else {
      yield put(toggleWishlistFailure(current.message || 'Failed to refresh wishlist'));
    }
  } catch (e) {
    yield put(toggleWishlistFailure((e as Error).message || 'Failed to toggle wishlist'));
  }
}

export function* wishlistSaga() {
  yield takeLatest(fetchWishlistRequest.type, handleFetchWishlist);
  yield takeLatest(toggleWishlistRequest.type, handleToggleWishlist);
  yield takeLatest(clearWishlistRequest.type, handleClearWishlist);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* handleClearWishlist(): Generator<any, void, any> {
  try {
    const res = yield call(() => wishlistApiService.clearAll());
    if (!res.success) {
      yield put(clearWishlistFailure(res.message || 'Failed to clear wishlist'));
      return;
    }
    // After successful clear, set items to []
    yield put(clearWishlistSuccess());
  } catch (e) {
    yield put(clearWishlistFailure((e as Error).message || 'Failed to clear wishlist'));
  }
}


