import {CardModel, ICard} from "../models/Card";

export class CardRepository{
    async findByColumnId(columnId: string):Promise<ICard[]>{
        return CardModel.find({ columnId }).lean().exec();
    }

    async create(data: Omit<ICard,'_id' | 'createdAt' | 'updatedAt' | 'commentsIds' | 'columnId' | 'assignedTo'> & {
    commentsIds: string[];
    columnId: string;
    assignedTo: string;
    }): Promise<ICard>{
        
        const newCard = await CardModel.create(data);
        return newCard.toObject();

    }

    async update(
        idActualizar: string,
        data: Partial<Omit<ICard,'_id' | 'createdAt' | 'updatedAt' | 'assignedTo' | 'commentsIds'>> &{
        assignedTo: string;
        commentsIds: string[];
        }):Promise<ICard | null>{

        const updateCard = await CardModel.findByIdAndUpdate(idActualizar,data,{
            new: true,
            runValidators: true
        }).exec();
        return updateCard ? updateCard.toObject(): null;

    }

    async delete(idEliminar: string): Promise<boolean>{
        
        const resultado = await CardModel.findByIdAndDelete(idEliminar);
        return resultado !== null;
        
    }

    async existById(id: string){

        const existe = await CardModel.exists({_id: id});
        return existe !== null;
    }

    async existManyByIds(ids: string[]): Promise<boolean>{
        const conteo = await CardModel.countDocuments({_id:{$in: ids}}).exec();
        return conteo === ids.length;
    }

}