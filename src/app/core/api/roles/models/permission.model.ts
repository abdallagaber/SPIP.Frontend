export interface Permission {
    id: number;
    systemName: string;
    displayName: string;
}

export interface PermissionModule {
    moduleName: string;
    permissions: Permission[];
}
