import { CommentDetailsResponse, CommentResponse, CommentWithDetails } from "../dtos/response/commentResponseDto";
import { IComment } from "../models/Comment";

export class CommentMapper {

  public static toResponse(comment: IComment): CommentResponse {
    return {
      id: comment._id.toString(),
      name: comment.name,
      description: comment.description,
      cardId: comment.cardId.toString(),
      createdBy: comment.createdBy.toString(),
    };
  }

  public static toDetailsResponse(comment: CommentWithDetails): CommentDetailsResponse {
    return {
      id: comment._id.toString(),
      name: comment.name,
      description: comment.description,
      cardId: comment.cardId.toString(),
      createdAt: comment.createdAt.toISOString(),
      author: {
        id: comment.createdBy._id.toString(),
        name: comment.createdBy.name,
        email: comment.createdBy.email,
        profilePicture: comment.createdBy.profilePicture || '',
      },
    };
  }
}
