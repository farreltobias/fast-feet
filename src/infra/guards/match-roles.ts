export const matchRoles = (roles: string[], userRole: string): boolean => {
  return roles.some((role) => userRole === role)
}
