import { UserResponse } from '../dtos/response/userResponseDto';
import { IUser } from '../models/User';

export class UserMapper {

  public static toResponse(user: IUser): UserResponse {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      documentId: user.documentId,
      role: user.role,
      profilePicture: user.profilePicture || '',
      createdAt: user.createdAt.toISOString(),
    };
  }
}
