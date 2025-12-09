// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest } = effects;
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

function* handleFetchWishlist(): Generator {
  try {
    const res = yield call(() => wishlistApiService.getWishlist());
    if (res.success) {
      yield put(fetchWishlistSuccess(res.data || []));
    } else {
      yield put(fetchWishlistFailure(res.message || 'Failed to load wishlist'));
    }
  } catch (e: unknown) {
    yield put(fetchWishlistFailure(e instanceof Error ? e.message : 'Failed to load wishlist'));
  }
}

function* handleToggleWishlist(action: ReturnType<typeof toggleWishlistRequest>): Generator {
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
  } catch (e: unknown) {
    yield put(toggleWishlistFailure(e instanceof Error ? e.message : 'Failed to toggle wishlist'));
  }
}

function* handleClearWishlist(): Generator {
  try {
    const res = yield call(() => wishlistApiService.clearAll());
    if (!res.success) {
      yield put(clearWishlistFailure(res.message || 'Failed to clear wishlist'));
      return;
    }
    // After successful clear, set items to []
    yield put(clearWishlistSuccess());
  } catch (e: unknown) {
    yield put(clearWishlistFailure(e instanceof Error ? e.message : 'Failed to clear wishlist'));
  }
}

export function* wishlistSaga() {
  yield takeLatest(fetchWishlistRequest.type, handleFetchWishlist);
  yield takeLatest(toggleWishlistRequest.type, handleToggleWishlist);
  yield takeLatest(clearWishlistRequest.type, handleClearWishlist);
}


