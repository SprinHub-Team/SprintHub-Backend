import { BoardModel, IBoard } from "../models/Board";
import mongoose from "mongoose";

export class BoardRepository {

  async findByGroupId(groupId: mongoose.Types.ObjectId): Promise<IBoard[]> {
    return BoardModel.find({ groupId }).lean().exec();
  }

  async create(data: Omit<IBoard,'_id' | 'createdAt' | 'updateAt'>): Promise<IBoard> {
    
    const newBoard = await BoardModel.create(data);
    return newBoard.toObject();

  }

  async update(
    idActualizar: mongoose.Types.ObjectId,
    data: Partial<Omit<IBoard,'_id' | 'createdAt' | 'updateAt'>>
  ): Promise<IBoard | null> {

    const updateBoard = await BoardModel.findByIdAndUpdate(idActualizar, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updateBoard ? updateBoard.toObject() : null;
  
  }

  async delete(idEliminar: mongoose.Types.ObjectId): Promise<boolean> {
   
    const resultado = await BoardModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }

  async existById(id: mongoose.Types.ObjectId): Promise<boolean> {

    const existe = await BoardModel.exists({_id: id}).exec();
    return existe !== null;

  }
  
}
