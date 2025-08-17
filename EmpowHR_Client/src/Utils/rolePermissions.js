// Role-based permission system for EmpowHR
export const ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  ADMIN: 'admin'
};

export const PERMISSIONS = {
  // User Management
  VIEW_ALL_USERS: 'view_all_users',
  EDIT_USER_PROFILE: 'edit_user_profile',
  VERIFY_USERS: 'verify_users',
  FIRE_USERS: 'fire_users',
  PROMOTE_USERS: 'promote_users',
  
  // Worksheet Management
  CREATE_WORKSHEET: 'create_worksheet',
  VIEW_OWN_WORKSHEETS: 'view_own_worksheets',
  VIEW_ALL_WORKSHEETS: 'view_all_worksheets',
  EDIT_OWN_WORKSHEET: 'edit_own_worksheet',
  DELETE_OWN_WORKSHEET: 'delete_own_worksheet',
  
  // Payment Management
  VIEW_OWN_PAYMENTS: 'view_own_payments',
  VIEW_ALL_PAYMENTS: 'view_all_payments',
  CREATE_PAYROLL_REQUEST: 'create_payroll_request',
  PROCESS_PAYMENTS: 'process_payments',
  
  // Analytics and Reports
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_SYSTEM_STATISTICS: 'view_system_statistics',
  
  // System Settings
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings'
};

// Define employee permissions first
const EMPLOYEE_PERMISSIONS = [
  PERMISSIONS.EDIT_USER_PROFILE,
  PERMISSIONS.CREATE_WORKSHEET,
  PERMISSIONS.VIEW_OWN_WORKSHEETS,
  PERMISSIONS.EDIT_OWN_WORKSHEET,
  PERMISSIONS.DELETE_OWN_WORKSHEET,
  PERMISSIONS.VIEW_OWN_PAYMENTS
];

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.EMPLOYEE]: EMPLOYEE_PERMISSIONS,
  
  [ROLES.HR]: [
    // Employee permissions
    ...EMPLOYEE_PERMISSIONS,
    // HR specific permissions
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.VERIFY_USERS,
    PERMISSIONS.VIEW_ALL_WORKSHEETS,
    PERMISSIONS.CREATE_PAYROLL_REQUEST,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  
  [ROLES.ADMIN]: [
    // All permissions
    ...Object.values(PERMISSIONS)
  ]
};

// Permission checker functions
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
};

// UI Helper functions
export const canEditUserProfile = (userRole) => 
  hasPermission(userRole, PERMISSIONS.EDIT_USER_PROFILE);

export const canViewAllUsers = (userRole) => 
  hasPermission(userRole, PERMISSIONS.VIEW_ALL_USERS);

export const canVerifyUsers = (userRole) => 
  hasPermission(userRole, PERMISSIONS.VERIFY_USERS);

export const canFireUsers = (userRole) => 
  hasPermission(userRole, PERMISSIONS.FIRE_USERS);

export const canPromoteUsers = (userRole) => 
  hasPermission(userRole, PERMISSIONS.PROMOTE_USERS);

export const canCreateWorksheet = (userRole) => 
  hasPermission(userRole, PERMISSIONS.CREATE_WORKSHEET);

export const canViewAllWorksheets = (userRole) => 
  hasPermission(userRole, PERMISSIONS.VIEW_ALL_WORKSHEETS);

export const canCreatePayrollRequest = (userRole) => 
  hasPermission(userRole, PERMISSIONS.CREATE_PAYROLL_REQUEST);

export const canProcessPayments = (userRole) => 
  hasPermission(userRole, PERMISSIONS.PROCESS_PAYMENTS);

export const canViewAnalytics = (userRole) => 
  hasPermission(userRole, PERMISSIONS.VIEW_ANALYTICS);

export const canManageSystemSettings = (userRole) => 
  hasPermission(userRole, PERMISSIONS.MANAGE_SYSTEM_SETTINGS);

// Role hierarchy checker
export const isHigherRole = (userRole, targetRole) => {
  const roleHierarchy = {
    [ROLES.EMPLOYEE]: 0,
    [ROLES.HR]: 1,
    [ROLES.ADMIN]: 2
  };
  
  return roleHierarchy[userRole] > roleHierarchy[targetRole];
};

export const canManageUser = (currentUserRole, targetUserRole) => {
  // Admins can manage everyone
  if (currentUserRole === ROLES.ADMIN) return true;
  
  // HR can manage employees
  if (currentUserRole === ROLES.HR && targetUserRole === ROLES.EMPLOYEE) return true;
  
  // No one else can manage users
  return false;
};

// Dashboard access control
export const getDashboardTabs = (userRole) => {
  const baseTabs = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: 'Person',
      permissions: [PERMISSIONS.EDIT_USER_PROFILE]
    }
  ];

  switch (userRole) {
    case ROLES.EMPLOYEE:
      return [
        { 
          id: 'worksheets', 
          label: 'Work-sheet', 
          icon: 'Assignment',
          permissions: [PERMISSIONS.CREATE_WORKSHEET, PERMISSIONS.VIEW_OWN_WORKSHEETS]
        },
        { 
          id: 'payments', 
          label: 'Payment History', 
          icon: 'Payment',
          permissions: [PERMISSIONS.VIEW_OWN_PAYMENTS]
        },
        ...baseTabs
      ];

    case ROLES.HR:
      return [
        { 
          id: 'employees', 
          label: 'Employee List', 
          icon: 'People',
          permissions: [PERMISSIONS.VIEW_ALL_USERS, PERMISSIONS.VERIFY_USERS]
        },
        { 
          id: 'monitoring', 
          label: 'Progress Monitoring', 
          icon: 'BarChart',
          permissions: [PERMISSIONS.VIEW_ALL_WORKSHEETS, PERMISSIONS.VIEW_ANALYTICS]
        },
        ...baseTabs
      ];

    case ROLES.ADMIN:
      return [
        { 
          id: 'overview', 
          label: 'Overview', 
          icon: 'Dashboard',
          permissions: [PERMISSIONS.VIEW_SYSTEM_STATISTICS]
        },
        { 
          id: 'employee-management', 
          label: 'Employee Management', 
          icon: 'SupervisorAccount',
          permissions: [PERMISSIONS.VIEW_ALL_USERS, PERMISSIONS.FIRE_USERS, PERMISSIONS.PROMOTE_USERS]
        },
        { 
          id: 'payroll', 
          label: 'Payroll Processing', 
          icon: 'AttachMoney',
          permissions: [PERMISSIONS.PROCESS_PAYMENTS]
        },
        { 
          id: 'worksheets', 
          label: 'Worksheet Management', 
          icon: 'Assignment',
          permissions: [PERMISSIONS.VIEW_ALL_WORKSHEETS]
        },
        { 
          id: 'payment-history', 
          label: 'Payment History', 
          icon: 'Payment',
          permissions: [PERMISSIONS.VIEW_ALL_PAYMENTS]
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: 'Analytics',
          permissions: [PERMISSIONS.VIEW_ANALYTICS]
        },
        ...baseTabs
      ];

    default:
      return baseTabs;
  }
};

// Validation helpers
export const validateUserAccess = (currentUser, requiredPermissions) => {
  if (!currentUser || !currentUser.role) {
    return { hasAccess: false, reason: 'User not authenticated' };
  }

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return { hasAccess: true };
  }

  const hasRequiredPermissions = hasAllPermissions(currentUser.role, requiredPermissions);
  
  return {
    hasAccess: hasRequiredPermissions,
    reason: hasRequiredPermissions ? null : 'Insufficient permissions'
  };
};

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getDashboardTabs,
  validateUserAccess,
  canManageUser,
  isHigherRole
};
