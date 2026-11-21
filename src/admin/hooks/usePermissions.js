/**
 * usePermissions — returns role-based permission helpers for the current admin.
 */
import { useAdminAuth } from './useAdminAuth';
import { hasPermission } from '../lib/permissions';

export function usePermissions() {
  const { admin } = useAdminAuth();
  const role = admin?.role ?? null;

  return {
    role,
    can: (area) => !!role && hasPermission(role, area),
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isSupport: role === 'support',
  };
}
