export const USERS_PATTERNS = {
  ASSIGN_ROLES: 'auth.users.assignRoles',
  REMOVE_ROLES: 'auth.users.removeRoles',
  GET_ROLES: 'auth.users.getRoles',
  GET_PERMISSIONS: 'auth.users.getPermissions',
  FIND_ALL: 'auth.users.findAll',
  FIND_ONE: 'auth.users.findOne',
  CREATE: 'auth.users.create',
  UPDATE: 'auth.users.update',
  DELETE: 'auth.users.delete',
  ACTIVATE: 'auth.users.activate',
  DEACTIVATE: 'auth.users.deactivate',
} as const;
