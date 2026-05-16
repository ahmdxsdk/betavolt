export type Role = 'super_admin' | 'content_manager' | 'sales';

export const ROLES: Role[] = ['super_admin', 'content_manager', 'sales'];

export const ROLE_LABEL: Record<Role, { en: string; ar: string }> = {
  super_admin:     { en: 'Super Admin',     ar: 'مدير عام'      },
  content_manager: { en: 'Content Manager', ar: 'مدير المحتوى'  },
  sales:           { en: 'Sales',           ar: 'المبيعات'       },
};
