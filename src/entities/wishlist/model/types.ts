/**
 * @file Типи для стану списку бажань.
 */

export interface WishlistStoreState {
  productIds: string[];
  isHydrated: boolean;
  toggleItem: (productId: string) => void;
  clear: () => void;
  _hasHydrated: () => void;
}
