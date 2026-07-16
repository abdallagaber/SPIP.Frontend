export interface RegisterRequestDto {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
}
