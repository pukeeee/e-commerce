export const APP_ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  ABOUT: "/about",
  CONTACTS: "/contacts",
} as const;

export const API_ROUTES = {
  PRODUCTS: "/api/products",
  ORDERS: "/api/orders",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

export const VALIDATION_LIMITS = {
  PRODUCT_NAME_MIN: 3,
  PRODUCT_NAME_MAX: 200,
  PRODUCT_DESCRIPTION_MAX: 2000,
  PRODUCT_PRICE_MAX: 10_000_000,

  ORDER_CUSTOMER_NAME_MIN: 2,
  ORDER_CUSTOMER_NAME_MAX: 100,
  ORDER_ADDRESS_MIN: 10,
  ORDER_ADDRESS_MAX: 200,
  ORDER_NOTE_MAX: 500,

  CART_MAX_ITEMS: 50,
  CART_ITEM_MAX_QUANTITY: 999,
} as const;

export const CACHE_TIMES = {
  PRODUCTS: 60 * 5, // 5 хвилин
  PRODUCT_DETAIL: 60 * 10, // 10 хвилин
  ORDERS: 60, // 1 хвилина
} as const;
