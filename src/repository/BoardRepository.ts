import { BoardModel, IBoard } from "../models/Board";

export class BoardRepository {

  async findByGroupId(groupId: string): Promise<IBoard[]> {
    return BoardModel.find({ groupId }).lean().exec();
  }

  async create(data: Omit<IBoard,'_id' | 'createdAt' | 'updatedAt' | 'groupId' | 'ownerId' | 'columnsIds'>&{
    groupId: string,
    ownerId: string,
    columnsIds: string[]
  }): Promise<IBoard> {
    
    const newBoard = await BoardModel.create(data);
    return newBoard.toObject();

  }

  async update(
    idActualizar: string,
    data: Partial<Omit<IBoard,'_id' | 'createdAt' | 'updatedAt' | 'columnsIds'>>&{
      columnsIds: string[];
    }
  ): Promise<IBoard | null> {

    const updateBoard = await BoardModel.findByIdAndUpdate(idActualizar, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updateBoard ? updateBoard.toObject() : null;
  
  }

  async delete(idEliminar: string): Promise<boolean> {
   
    const resultado = await BoardModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }

  async existById(id: string): Promise<boolean> {

    const existe = await BoardModel.exists({_id: id}).exec();
    return existe !== null;

  }
  
}
