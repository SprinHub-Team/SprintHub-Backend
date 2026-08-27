import { BoardModel, IBoard } from "../models/Board";
import mongoose from "mongoose";

export class BoardRepository {
  async findByGroupId(
    groupId: mongoose.Types.ObjectId,
  ): Promise<IBoard[] | null> {
    return BoardModel.find({ groupId: groupId }).exec();
  }

  async create(data: {
    title: string;
    description?: string;
    groupId: mongoose.Types.ObjectId;
    ownerId: mongoose.Types.ObjectId;
  }): Promise<IBoard> {
    return BoardModel.create(data);
  }

  async update(
    data: {
      title: string;
      description?: string;
      groupId: mongoose.Types.ObjectId;
      ownerId: mongoose.Types.ObjectId;
    },
    idActualizar: mongoose.Types.ObjectId,
  ): Promise<IBoard | null> {
    return BoardModel.findByIdAndUpdate(idActualizar, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(idEliminar: mongoose.Types.ObjectId): Promise<boolean | null> {
    const resultado = await BoardModel.findByIdAndDelete(idEliminar).exec();
    return resultado != null;
  }
}
