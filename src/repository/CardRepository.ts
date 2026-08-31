import {CardModel, ICard} from "../models/Card";

export class CardRepository{

    async findByColumnId(columnId: string):Promise<ICard[]>{
        return CardModel.find({ columnId }).lean().exec();
    }

    async findByColumnIds(columnIds: string[]): Promise<ICard[]> {
        return CardModel.find({ columnId: { $in: columnIds } }).lean().exec();
    }

    async findById(id: string):Promise<ICard | null>{
        return CardModel.findById(id).lean().exec();
    }

    async create(data: Pick<ICard, 'title' | 'description' | 'position' | 'dueDate'>&{columnId: string, assignedTo?: string }): Promise<ICard>{
        const newCard = await CardModel.create(data);
        return newCard.toObject();
    }

    async update(idActualizar: string, data: Partial<Pick<ICard,'description' |'title' | 'position'>>&{columnId?: string, assignedTo?: string }):Promise<ICard | null>{
        const updateCard = await CardModel.findByIdAndUpdate(idActualizar,data,{
            new: true,
            runValidators: true
        }).exec();
        return updateCard ? updateCard.toObject(): null;
    }

    async delete(idEliminar: string): Promise<boolean>{
        
        const resultado = await CardModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
        
    }

    async existById(id: string){

        const existe = await CardModel.exists({_id: id}).exec();
        return existe !== null;
    }

    async existManyByIds(ids: string[]): Promise<boolean>{
        const conteo = await CardModel.countDocuments({_id:{$in: ids}}).exec();
        return conteo === ids.length;
    }

}