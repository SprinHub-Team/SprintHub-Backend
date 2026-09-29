import {
  CompletedActivityResponse,
  CompletedCard,
  GroupPerformanceResponse,
  UserPerformanceResponse,
} from '../dtos/response/reportResponseDto';

export class ReportMapper {

  public static toGroupPerformanceResponse(data: {
    created: number;
    completed: number;
    overdue: number;
    pending: number;
  }): GroupPerformanceResponse {
    return {
      created: Number(data.created) || 0,
      completed: Number(data.completed) || 0,
      overdue: Number(data.overdue) || 0,
      pending: Number(data.pending) || 0,
    };
  }

  public static toUserPerformanceResponse(data: {
    userId: string;
    created: number;
    completed: number;
    overdue: number;
    pending: number;
  }): UserPerformanceResponse {
    return {
      ...ReportMapper.toGroupPerformanceResponse(data),
      userId: data.userId,
    };
  }

  public static toCompletedActivitiesResponse(cards: CompletedCard[]): CompletedActivityResponse[] {
    return cards.map(card => ({
      id: card._id.toString(),
      title: card.title,
      description: card.description || '',
      columnId: card.columnId.toString(),
      assignedTo: card.assignedTo ? card.assignedTo.toString() : null,
      dueDate: card.dueDate ? new Date(card.dueDate).toISOString() : null,
      priority: card.priority ?? 'media',
      files: (card.files || []).map(f => ({
        fileName: f.fileName,
        url: f.url,
        path: f.path,
      })),
      createdAt: card.createdAt ? new Date(card.createdAt).toISOString() : null,
    }));
  }
  
}