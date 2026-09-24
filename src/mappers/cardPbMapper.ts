import { ICardPB } from '../models/CardPB';
import { CardPbResponse } from '../dtos/response/cardPbResponseDto';

export class CardPbMapper {
  public static toResponse(cardPb: ICardPB): CardPbResponse {
    return {
      id: cardPb._id.toString(),
      title: cardPb.title,
      description: cardPb.description || undefined,
      groupId: cardPb.groupId.toString(),
      sprintId: cardPb.sprintId ? cardPb.sprintId.toString() : undefined,
      assignedTo: cardPb.assignedTo ? cardPb.assignedTo.toString() : undefined,
      dueDate: cardPb.dueDate ? cardPb.dueDate.toISOString() : undefined,
      priority: cardPb.priority as 'alta' | 'media' | 'baja',
      createdAt: cardPb.createdAt.toISOString(),
      updatedAt: cardPb.updatedAt.toISOString(),
    };
  }
}
