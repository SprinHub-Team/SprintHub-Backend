import { UserResponse } from "./userResponseDto";

export type AuthLoginResponse = {
  token: string;
  user: Omit<UserResponse, 'documentId' | 'createdAt'>;
};

export type AuthRegisterResponse = {
    id: string;
    name: string;
    email: string;
};