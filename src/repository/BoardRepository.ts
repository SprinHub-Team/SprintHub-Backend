import { BoardModel, IBoard } from "../models/Board";
import mongoose from "mongoose";
import BoardRequest from '../dtos/BoardRequest';

export class BoardRepository {

  async findByGroupId(groupId: string): Promise<IBoard[] | null> {
    const idBuscado = new mongoose.Types.ObjectId(groupId);
    return BoardModel.find({ groupId: idBuscado }).exec();
  }

  async create(data: BoardRequest): Promise <IBoard> {
    return BoardModel.create(data);
  }

  async update(data: BoardRequest, id: string): Promise <IBoard | null>{
    const idActualizar = new mongoose.Types.ObjectId(id);
    return BoardModel.findByIdAndUpdate(idActualizar,data,{ new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean | null>{
    const idEliminar = new mongoose.Types.ObjectId(id);
    const resultado = await BoardModel.findByIdAndDelete(idEliminar).exec();
    return resultado!=null;
  }
}
