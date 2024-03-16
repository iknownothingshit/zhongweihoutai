/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser; permissions?: string[] } | undefined,
) {
  const { currentUser, permissions } = initialState ?? {};
  const hasRight = (right: string) => {
    return permissions?.includes(right);
    // return true;
  };
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canViewUser: hasRight('user:view'),

    canViewSystem: hasRight('system:view'),
    canViewSystemUser: hasRight('systemUser:view'),
    canViewSystemRole: hasRight('systemRole:view'),
    canViewSystemRights: hasRight('systemRights:view'),
    canViewSystemDept: hasRight('systemDept:view'),
    canViewSystemClient: hasRight('systemClient:view'),
    canViewSystemLog: hasRight('monitorSystemLog:view'),

    hasRight,
  };
}
