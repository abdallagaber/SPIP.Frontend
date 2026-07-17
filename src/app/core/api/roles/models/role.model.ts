export interface Role {
    id: string;
    name: string;
    permissionIds?: number[];
}

export interface AssignPermissionsDto {
    permissionIds: number[];
}
