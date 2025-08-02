// API Endpoints for Velleta Heritage
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/users/login",
  SIGNUP: "/users/signup",
  LOGOUT: "/users/logout",
  FORGOT_PASSWORD: "/users/forgot-password",
  RESET_PASSWORD: "/users/reset-password",
  REFRESH_TOKEN: "/users/refresh-token",
  VERIFY_TOKEN: "/users/verify-token",

  // Products
  GET_PRODUCTS: "/products",
  GET_PRODUCT_BY_ID: "/products/:id",
  CREATE_PRODUCT: "/products",
  UPDATE_PRODUCT: "/products/:id",
  DELETE_PRODUCT: "/products/:id",
  SEARCH_PRODUCTS: "/products/search",
  GET_PRODUCT_BY_DESIGN_NO: "/products/design/:designNo",

  // Orders
  GET_ORDERS: "/orders",
  GET_ORDER_BY_ID: "/orders/:id",
  CREATE_ORDER: "/orders",
  UPDATE_ORDER: "/orders/:id",
  DELETE_ORDER: "/orders/:id",
  SEARCH_ORDERS: "/orders/search",
  GET_ORDER_BY_ORDER_NO: "/orders/orderNo/:orderNo",
  GET_ORDERS_BY_CUSTOMER: "/orders/customer/:customerName",
  GET_ORDERS_BY_DATE_RANGE: "/orders/date-range",

  // Users
  GET_USER_PROFILE: "/users/profile",
  UPDATE_USER_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/change-password",
  GET_USERS: "/users",
  GET_USER_BY_ID: "/users/:id",
  CREATE_USER: "/users",
  UPDATE_USER: "/users/:id",
  DELETE_USER: "/users/:id",

  // Dashboard
  GET_DASHBOARD_STATS: "/dashboard/stats",
  GET_RECENT_ORDERS: "/dashboard/recent-orders",
  GET_TOP_PRODUCTS: "/dashboard/top-products",
  GET_SALES_CHART: "/dashboard/sales-chart",
  GET_REVENUE_REPORT: "/dashboard/revenue-report",

  // File Upload
  UPLOAD_PRODUCT_IMAGE: "/upload/product-image",
  UPLOAD_ORDER_DOCUMENT: "/upload/order-document",
  UPLOAD_PROFILE_IMAGE: "/upload/profile-image",

  // Export
  EXPORT_PRODUCTS_CSV: "/export/products/csv",
  EXPORT_ORDERS_CSV: "/export/orders/csv",
  EXPORT_ORDERS_PDF: "/export/orders/pdf",
  EXPORT_INVOICE_PDF: "/export/invoice/:orderId/pdf",

  // Backup
  CREATE_BACKUP: "/backup/create",
  RESTORE_BACKUP: "/backup/restore",
  GET_BACKUPS: "/backup/list",
  DOWNLOAD_BACKUP: "/backup/download/:backupId",

  // System
  HEALTH_CHECK: "/health",
  VERSION: "/version",
  CONFIG: "/config",
} as const;
