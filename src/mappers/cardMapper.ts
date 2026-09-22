import { CardDetailsResponse, CardResponse, CardWithDetails } from "../dtos/response/cardResponseDto";
import { ICard } from "../models/Card";

export class CardMapper {

  public static toResponse(card: ICard): CardResponse {
    return {
      id: card._id.toString(),
      title: card.title,
      description: card.description || '',
      columnId: card.columnId.toString(),
      assignedTo: card.assignedTo ? card.assignedTo.toString() : null,
      dueDate: card.dueDate ? card.dueDate.toISOString() : null,
      priority: card.priority,
      files: (card.files || []).map(f => ({
        fileName: f.fileName,
        url: f.url,
        path: f.path,
      })),
    };
  }

  public static toDetailsResponse(card: CardWithDetails): CardDetailsResponse {
    return {
      id: card._id.toString(),
      title: card.title,
      description: card.description || '',
      columnId: card.columnId.toString(),
      priority: card.priority,
      dueDate: card.dueDate ? card.dueDate.toISOString() : null,
      assignedTo: card.assignedTo ? {
        id: card.assignedTo._id.toString(),
        name: card.assignedTo.name,
        email: card.assignedTo.email,
      } : null,
      files: (card.files || []).map(f => ({
        fileName: f.fileName,
        url: f.url,
        path: f.path,
      })),
      comments: (card.comments || []).map(comment => ({
        id: comment._id.toString(),
        name: comment.name,
        description: comment.description,
        createdAt: comment.createdAt.toISOString(),
        createdBy: comment.createdBy.toString(),
      })),
    };
  }
}
