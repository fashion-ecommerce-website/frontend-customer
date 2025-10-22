import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { 
  getUserOrdersRequest,
  selectOrders,
  selectIsOrdersLoading,
  selectOrdersError,
  selectOrdersPagination,
  selectCurrentQuery
} from '@/features/order/redux/orderSlice';
import { OrderQueryParams } from '@/features/order/types';
import { useCallback } from 'react';

export const useOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => selectOrders(state));
  const loading = useSelector((state: RootState) => selectIsOrdersLoading(state));
  const error = useSelector((state: RootState) => selectOrdersError(state));
  const pagination = useSelector((state: RootState) => selectOrdersPagination(state));
  const currentQuery = useSelector((state: RootState) => selectCurrentQuery(state));

  const fetchOrders = useCallback((params?: OrderQueryParams) => {
    dispatch(getUserOrdersRequest(params));
  }, [dispatch]);

  return {
    orders,
    loading,
    error,
    pagination,
    currentQuery,
    fetchOrders
  };
};
