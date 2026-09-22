import { GroupDetailsResponse, GroupResponse, GroupWithDetailsResponse } from "../dtos/response/groupResponseDto";
import { IGroup } from "../models/Group";

export class GroupMapper {

  public static toResponse(group: IGroup): GroupResponse {
    return {
      id: group._id.toString(),
      name: group.name,
      description: group.description || '',
      visibility: group.visibility,
      profilePicture: group.profilePicture || '',
      ownerId: group.ownerId.toString(),
    };
  }


  public static toDetailsResponse(group: GroupWithDetailsResponse): GroupDetailsResponse {
    return {
      id: group._id.toString(),
      name: group.name,
      description: group.description || '',
      visibility: group.visibility,
      profilePicture: group.profilePicture || '',
      owner: {
        id: group.ownerId._id.toString(),
        name: group.ownerId.name,
        email: group.ownerId.email,
      },
      members: (group.members || []).map(member => ({
        id: member.user._id.toString(),
        name: member.user.name,
        email: member.user.email,
        role: member.role,
      })),
    };
  }
}
