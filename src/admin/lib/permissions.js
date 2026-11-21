/**
 * Admin permissions map — single source of truth for role-based access.
 * Used by both UI (usePermissions hook) and server middleware.
 */
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPPORT: 'support',
};

export const PERMISSIONS = {
  overview: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPPORT],
  products: [ROLES.ADMIN, ROLES.MANAGER],
  categories: [ROLES.ADMIN, ROLES.MANAGER],
  orders: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPPORT],
  transactions: [ROLES.ADMIN, ROLES.MANAGER],
  customers: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPPORT],
  coupons: [ROLES.ADMIN, ROLES.MANAGER],
  reviews: [ROLES.ADMIN, ROLES.MANAGER],
  messages: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPPORT],
  siteContent: [ROLES.ADMIN],
  settings: [ROLES.ADMIN],
  team: [ROLES.ADMIN],
};

export function hasPermission(role, area) {
  return PERMISSIONS[area]?.includes(role) ?? false;
}
