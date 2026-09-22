import { ColumnDetailsResponse, ColumnResponse, ColumnWithDetails } from "../dtos/response/columnResponseDto";
import { IColumn } from "../models/Column";
import { CardMapper } from "./cardMapper";

export class ColumnMapper {

  public static toResponse(column: IColumn): ColumnResponse
   {
    return {
      id: column._id.toString(),
      name: column.name,
      boardId: column.boardId.toString(),
    };
  }

  public static toDetailsResponse(column: ColumnWithDetails): ColumnDetailsResponse {
    return {
      id: column._id.toString(),
      name: column.name,
      boardId: column.boardId.toString(),
      cards: (column.cards || []).map(card => CardMapper.toResponse(card)),
    };
  }
}
