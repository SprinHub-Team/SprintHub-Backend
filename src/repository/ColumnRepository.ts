import { ColumnModel, IColumn } from "../models/Column";
import mongoose from "mongoose";

export class ColumnRepository {
  async findByBoardId(boardId: mongoose.Types.ObjectId): Promise<IColumn[]> {
    return ColumnModel.find({ boardId: boardId }).lean().exec();
  }

  async create(data: Omit<IColumn,'_id' | 'createdAt' | 'updateAt'>): Promise<IColumn> {
    
    const newColumn = await ColumnModel.create(data);
    return (await newColumn).toObject();
  
  }

  async update(
    idActualizar: mongoose.Types.ObjectId,
    data: Partial<Omit<IColumn,'_id' | 'createdAt' | 'updateAt'>>
  ): Promise<IColumn | null> {

    const updateColumn = await ColumnModel.findByIdAndUpdate(idActualizar, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updateColumn ? updateColumn.toObject() : null;

  }

  async delete(idEliminar: mongoose.Types.ObjectId): Promise<boolean> {
    
    const resultado = await ColumnModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }

  async existManyByIds(boardsIds: mongoose.Types.ObjectId[]): Promise<boolean>{

    const conteo = await ColumnModel.countDocuments({ _id: { $in: boardsIds } }).exec();
    return conteo === boardsIds.length;

  }

  async existById(id: mongoose.Types.ObjectId): Promise<boolean>{

    const existe = ColumnModel.exists({_id: id}).exec();
    return existe !== null;

  }
}
