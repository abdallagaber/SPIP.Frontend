export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersPerRole: Record<string, number>;
    totalRoles: number;
    totalPermissions: number;
}
