import { AuthLoginResponse, AuthRegisterResponse } from "../dtos/response/authResponseDto";
import { IUser } from "../models/User";
import { profilePictureUrl } from '../utils/profilePicture';

export class AuthMapper {

  public static toAuthLoginResponse(user: IUser, token: string): AuthLoginResponse {
    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profilePicture: profilePictureUrl(user.profilePicture),
      },
    };
  }

  public static toAuthRegisterResponse(user: IUser): AuthRegisterResponse {
    return {
      name: user.name,
      email: user.email,
    };
  }
}
