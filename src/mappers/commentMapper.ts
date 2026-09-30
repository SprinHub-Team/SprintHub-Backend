import { CommentDetailsResponse, CommentWithDetails } from "../dtos/response/commentResponseDto";

export class CommentMapper {

  public static toDetailsResponse(comment: CommentWithDetails): CommentDetailsResponse {
    return {
      id: comment._id.toString(),
      name: comment.name,
      description: comment.description,
      cardId: comment.cardId.toString(),
      createdAt: comment.createdAt.toISOString(),
      createdBy: {
        id: comment.createdBy._id.toString(),
        name: comment.createdBy.name,
        email: comment.createdBy.email,
        profilePicture: comment.createdBy.profilePicture?.url || '',
      },
    };
  }
  
}
