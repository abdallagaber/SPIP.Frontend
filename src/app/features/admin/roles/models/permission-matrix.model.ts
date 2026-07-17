export interface PermissionCell {
    id: number;
    systemName: string;
    displayName: string;
    action: string;
}

export interface PermissionMatrixRow {
    moduleName: string;
    permissions: PermissionCell[];
}
