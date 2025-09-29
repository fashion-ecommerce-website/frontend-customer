import { call, put } from 'redux-saga/effects';
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

function* handleFetchWishlist(): any {
  try {
    const res = yield call(() => wishlistApiService.getWishlist());
    if (res.success) {
      yield put(fetchWishlistSuccess(res.data || []));
    } else {
      yield put(fetchWishlistFailure(res.message || 'Failed to load wishlist'));
    }
  } catch (e: any) {
    yield put(fetchWishlistFailure(e.message || 'Failed to load wishlist'));
  }
}

function* handleToggleWishlist(action: ReturnType<typeof toggleWishlistRequest>): any {
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
  } catch (e: any) {
    yield put(toggleWishlistFailure(e.message || 'Failed to toggle wishlist'));
  }
}

export function* wishlistSaga() {
  const effects = require('redux-saga/effects');
  const takeLatest = effects.takeLatest;
  yield takeLatest(fetchWishlistRequest.type, handleFetchWishlist);
  yield takeLatest(toggleWishlistRequest.type, handleToggleWishlist);
  yield takeLatest(clearWishlistRequest.type, handleClearWishlist);
}

function* handleClearWishlist(): any {
  try {
    const res = yield call(() => wishlistApiService.clearAll());
    if (!res.success) {
      yield put(clearWishlistFailure(res.message || 'Failed to clear wishlist'));
      return;
    }
    // After successful clear, set items to []
    yield put(clearWishlistSuccess());
  } catch (e: any) {
    yield put(clearWishlistFailure(e.message || 'Failed to clear wishlist'));
  }
}


