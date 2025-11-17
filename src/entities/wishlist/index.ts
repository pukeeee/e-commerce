/**
 * @file Публічне API для сутності "Список бажань" (wishlist).
 */

export {
  useWishlist,
  useIsFavorite,
  useToggleFavorite,
  useClearWishlist,
  useWishlistStoreBase,
} from "./model/store";
export type { WishlistStoreState } from "./model/types";
