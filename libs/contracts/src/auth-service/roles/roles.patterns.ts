export const ROLES_PATTERNS = {
  CREATE: 'auth.roles.create',
  FIND_ALL: 'auth.roles.findAll',
  FIND_ONE: 'auth.roles.findOne',
  FIND_BY_NAME: 'auth.roles.findByName',
  UPDATE: 'auth.roles.update',
  DELETE: 'auth.roles.delete',
  ASSIGN_PERMISSIONS: 'auth.roles.assignPermissions',
  REMOVE_PERMISSIONS: 'auth.roles.removePermissions',
} as const;
