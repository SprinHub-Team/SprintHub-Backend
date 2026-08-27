import { ColumnModel, IColumn } from "../models/Column";
import mongoose from "mongoose";

export class ColumnRepository {
  async findByBoardId(boardId: mongoose.Types.ObjectId): Promise<IColumn[]> {
    return ColumnModel.find({ boardId: boardId }).exec();
  }

  async create(data: {
    name: string;
    boardId: mongoose.Types.ObjectId;
    cardsId: mongoose.Types.ObjectId[];
  }): Promise<IColumn> {
    return ColumnModel.create({
      name: data.name,
      boardId: data.boardId,
      cardsId: data.cardsId,
    });
  }

  async update(
    data: {
      name: string;
      boardId: mongoose.Types.ObjectId;
      cardsId: mongoose.Types.ObjectId[];
    },
    idActualizar: mongoose.Types.ObjectId,
  ): Promise<IColumn | null> {
    return ColumnModel.findByIdAndUpdate(idActualizar, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(idEliminar: mongoose.Types.ObjectId): Promise<boolean | null> {
    const resultado = await ColumnModel.findByIdAndDelete(idEliminar).exec();
    return resultado != null;
  }
}
