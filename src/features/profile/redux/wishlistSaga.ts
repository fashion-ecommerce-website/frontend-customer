import { call, put, takeLatest } from 'redux-saga/effects';
import { wishlistApiService } from '@/services/api/wishlistApi';
import {
  fetchWishlistRequest,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  toggleWishlistRequest,
  toggleWishlistFailure,
} from './wishlistSlice';

function* handleFetchWishlist(): any {
  try {
    const res = yield call([wishlistApiService, wishlistApiService.getWishlist]);
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
    const res = yield call([wishlistApiService, wishlistApiService.toggle], detailId);
    if (!res.success) {
      yield put(toggleWishlistFailure(res.message || 'Failed to toggle wishlist'));
      return;
    }
    const current = yield call([wishlistApiService, wishlistApiService.getWishlist]);
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
  yield takeLatest(fetchWishlistRequest.type, handleFetchWishlist);
  yield takeLatest(toggleWishlistRequest.type, handleToggleWishlist);
}


