import { GroupDetailsResponse, GroupResponse, GroupWithDetailsResponse } from "../dtos/response/groupResponseDto";
import { IGroup } from "../models/Group";
import { profilePictureUrl } from '../utils/profilePicture';

export class GroupMapper {

  public static toResponse(group: IGroup): GroupResponse {
    return {
      id: group._id.toString(),
      name: group.name,
      description: group.description || '',
      profilePicture: group.profilePicture?.url || '',
    };
  }


  public static toDetailsResponse(group: GroupWithDetailsResponse): GroupDetailsResponse {
    return {
      id: group._id.toString(),
      name: group.name,
      description: group.description || '',
      profilePicture: group.profilePicture?.url || '',
      members: (group.members || []).filter(member => member.user).map(member => ({
        id: member.user._id.toString(),
        name: member.user.name,
        email: member.user.email,
        profilePicture: profilePictureUrl(member.user.profilePicture),
        role: member.role,
      })),
    };
  }
}
