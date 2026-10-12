import { User } from './user.entity';

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    emailVerifiedAt: user.emailVerifiedAt
      ? user.emailVerifiedAt.toISOString()
      : null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
