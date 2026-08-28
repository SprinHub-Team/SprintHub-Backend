import {CardModel, ICard} from "../models/Card";
import mongoose from 'mongoose';

export class CardRepository{
    async findByColumnId(columnId: mongoose.Types.ObjectId):Promise<ICard[]>{
        return CardModel.find({ columnId }).lean().exec();
    }

    async create(data: Omit<ICard,'_id' | 'createdAt' | 'updatedAt'>): Promise<ICard>{
        
        const newCard = await CardModel.create(data);
        return newCard.toObject();

    }

    async update(
        idActualizar: mongoose.Types.ObjectId,
        data: Partial<Omit<ICard,'_id' | 'createdAt' | 'updatedAt'>>
        ):Promise<ICard | null>{

        const updateCard = await CardModel.findByIdAndUpdate(idActualizar,data,{
            new: true,
            runValidators: true
        }).exec();
        return updateCard ? updateCard.toObject(): null;

    }

    async delete(idEliminar: mongoose.Types.ObjectId): Promise<boolean>{
        
        const resultado = await CardModel.findByIdAndDelete(idEliminar);
        return resultado !== null;
        
    }

    async existById(id: mongoose.Types.ObjectId){

        const existe = await CardModel.exists({_id: id});
        return existe !== null;
    }

    async existManyByIds(ids: mongoose.Types.ObjectId[]): Promise<boolean>{
        const conteo = await CardModel.countDocuments({_id:{$in: ids}}).exec();
        return conteo === ids.length;
    }

}