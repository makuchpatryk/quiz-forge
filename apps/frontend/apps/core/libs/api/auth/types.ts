export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthMessageResponse {
  message: string;
}

export interface UserResponse {
  role: string;
  id: string;
  email: string;
  updatedAt: string;
  createdAt: string;
}
