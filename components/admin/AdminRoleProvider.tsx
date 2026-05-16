'use client';

import { createContext, useContext } from 'react';
import type { Role } from '@/lib/admin-roles';

const AdminRoleContext = createContext<Role>('super_admin');

export function AdminRoleProvider({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return (
    <AdminRoleContext.Provider value={role}>
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole(): Role {
  return useContext(AdminRoleContext);
}
