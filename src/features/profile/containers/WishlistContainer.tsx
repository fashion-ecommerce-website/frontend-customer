"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useToast } from "@/providers/ToastProvider";
import { useMinimumLoadingTime } from "@/hooks/useMinimumLoadingTime";
import { useLanguage } from "@/hooks/useLanguage";
import {
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistError,
  fetchWishlistRequest,
  toggleWishlistRequest,
  clearWishlistRequest,
} from "@/features/profile/redux/wishlistSlice";
import { WishlistPresenter } from "../components/WishlistPresenter";

export const WishlistContainer: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const loading = useAppSelector(selectWishlistLoading);
  const error = useAppSelector(selectWishlistError);
  const { showSuccess, showError } = useToast();
  const { translations } = useLanguage();
  const t = translations.toast;

  // Use minimum loading time hook to ensure skeleton shows for at least 500ms
  const displayLoading = useMinimumLoadingTime(loading, 500);

  useEffect(() => {
    dispatch(fetchWishlistRequest());
  }, [dispatch]);

  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const handleToggleEdit = () => {
    setEditMode((prev) => {
      if (prev) setSelected([]);
      return !prev;
    });
  };

  const handleToggleSelect = (detailId: number) => {
    setSelected((prev) =>
      prev.includes(detailId) ? prev.filter((s) => s !== detailId) : [...prev, detailId]
    );
  };

  const handleClearClick = () => {
    // Check if there are any items to remove
    if (items.length === 0) {
      showError(t.noItemsToRemove);
      return;
    }

    const hasSelection = editMode && selected.length > 0;
    const count = hasSelection ? selected.length : items.length;
    const message = hasSelection
      ? `Are you sure you want to delete ${count} selected items?`
      : 'Are you sure you want to clear all wishlist items?';
    setConfirmConfig({
      message,
      onConfirm: async () => {
        if (hasSelection) {
          selected.forEach((detailId) => dispatch(toggleWishlistRequest(detailId)));
          dispatch(fetchWishlistRequest());
          setSelected([]);
          setEditMode(false);
          showSuccess(t.removedSelectedItems);
        } else {
          dispatch(clearWishlistRequest());
          setSelected([]);
          setEditMode(false);
          showSuccess(t.clearedWishlist);
        }
        setConfirmConfig(null);
      }
    });
  };

  const handleCancelConfirm = () => setConfirmConfig(null);

  const handleProductClick = (detailId: number) => {
    router.push(`/products/${detailId}`);
  };

  const viewItems = useMemo(() => items, [items]);

  return (
    <WishlistPresenter
      items={viewItems}
      loading={displayLoading}
      error={error}
      editMode={editMode}
      selected={selected}
      confirm={confirmConfig}
      onToggleEdit={handleToggleEdit}
      onToggleSelect={handleToggleSelect}
      onClearClick={handleClearClick}
      onCancelConfirm={handleCancelConfirm}
      onProductClick={handleProductClick}
    />
  );
};


