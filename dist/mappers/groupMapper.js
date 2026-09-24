"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMapper = void 0;
class GroupMapper {
    static toResponse(group) {
        return {
            id: group._id.toString(),
            name: group.name,
            description: group.description || '',
            profilePicture: group.profilePicture?.url || '',
            ownerId: group.ownerId.toString(),
        };
    }
    static toDetailsResponse(group) {
        return {
            id: group._id.toString(),
            name: group.name,
            description: group.description || '',
            profilePicture: group.profilePicture?.url || '',
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
exports.GroupMapper = GroupMapper;
