import { CardPbResponse, CardPbWithUser } from '../dtos/response/cardPbResponseDto';

export class CardPbMapper {

  public static toResponse(card: CardPbWithUser): CardPbResponse {
    return {
      id: card._id.toString(),
      title: card.title,
      description: card.description || '',
      groupId: card.groupId.toString(),
      sprintId: card.sprintId ? card.sprintId.toString() : null,
      assignedTo: CardPbMapper.toAssignedUser(card.assignedTo),
      dueDate: card.dueDate ? new Date(card.dueDate).toISOString() : null,
      priority: card.priority ?? 'media',
      createdAt: card.createdAt ? new Date(card.createdAt).toISOString() : new Date(0).toISOString(),
      updatedAt: card.updatedAt ? new Date(card.updatedAt).toISOString() : new Date(0).toISOString(),
    };
  }
  
  private static toAssignedUser(assignedTo: CardPbWithUser['assignedTo']): CardPbResponse['assignedTo'] {
    if (!assignedTo) return null;
    const populated = assignedTo as unknown as { _id?: unknown; name?: string; email?: string };
    if (populated._id) {
      return {
        id: populated._id.toString(),
        name: populated.name ?? '',
        email: populated.email ?? '',
      };
    }
    return null;
  }

}