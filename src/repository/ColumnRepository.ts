import { ColumnModel, IColumn } from "../models/Column";
import mongoose from "mongoose";

export class ColumnRepository {
  async findByBoardId(boardId: string): Promise<IColumn[]> {
    return ColumnModel.find({ boardId: boardId }).lean().exec();
  }

  async create(data: Omit<IColumn,'_id' | 'createdAt' | 'updateAt'>): Promise<IColumn> {
    
    const newColumn = await ColumnModel.create(data);
    return (await newColumn).toObject();
  
  }

  async update(
    idActualizar: string,
    data: Partial<Omit<IColumn,'_id' | 'createdAt' | 'updateAt'>>
  ): Promise<IColumn | null> {

    const updateColumn = await ColumnModel.findByIdAndUpdate(idActualizar, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updateColumn ? updateColumn.toObject() : null;

  }

  async delete(idEliminar: string): Promise<boolean> {
    
    const resultado = await ColumnModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }

  async existManyByIds(boardsIds: string[]): Promise<boolean>{

    const conteo = await ColumnModel.countDocuments({ _id: { $in: boardsIds } }).exec();
    return conteo === boardsIds.length;

  }

  async existById(id: string): Promise<boolean>{

    const existe = ColumnModel.exists({_id: id}).exec();
    return existe !== null;

  }

}
