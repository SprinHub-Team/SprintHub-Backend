import { ColumnModel, IColumn } from "../models/Column";

export class ColumnRepository {

  async findByBoardId(boardId: string): Promise<IColumn[]> {
    return ColumnModel.find({ boardId }).lean().exec();
  }

  async findById(id: string): Promise<IColumn | null> {
    return ColumnModel.findById(id).lean().exec();
  }

  async create(data: Pick<IColumn, 'name'>&{boardId: string}): Promise<IColumn> {
    
    const newColumn = await ColumnModel.create(data);
    return newColumn.toObject();
  
  }

  async update(idActualizar: string, data: {name: string | undefined}): Promise<IColumn | null> {

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

    const existe = await ColumnModel.exists({_id: id}).exec();
    return existe !== null;

  }

}
