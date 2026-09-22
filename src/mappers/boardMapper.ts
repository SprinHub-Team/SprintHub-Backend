import { BoardDetailsResponse, BoardResponse } from "../dtos/response/boardResponseDto";
import { IBoard } from "../models/Board";
import { BoardWhitDetails } from "../repository/boardRepository";

export class BoardMapper {

  public static toResponse(board: IBoard): BoardResponse {
    return {
      id: board._id.toString(),
      title: board.title,
      description: board.description || '',
      groupId: board.groupId.toString(),
      ownerId: board.ownerId.toString(),
    };
  }


  public static toDetailsResponse(board: BoardWhitDetails): BoardDetailsResponse {
    return {
      id: board._id.toString(),
      title: board.title,
      description: board.description || '',
      groupId: board.groupId.toString(),
      columns: (board.columns || []).map(col => ({
        id: col._id.toString(),
        name: col.name,
        cards: (col.cards || []).map(card => ({
          id: card._id.toString(),
          title: card.title,
          priority: card.priority,
          dueDate: card.dueDate ? card.dueDate.toISOString() : null,
          filesCount: card.files?.length || 0,
        })),
      })),
    };
  }
}
