import {ColumnModel, IColumn} from '../models/Column';
import mongoose from 'mongoose';
import ColumnRequest from '../dtos/ColumnRequest';

export class ColumnRepository{

    async findByBoardId(boardId: string): Promise<IColumn[]>{
        const idBuscado = new mongoose.Types.ObjectId(boardId);
        return ColumnModel.find({boardId: idBuscado}).exec();
    }

    async create(data: ColumnRequest): Promise<IColumn>{
        const boardId = new mongoose.Types.ObjectId(data.boardId);
        const cardsId: mongoose.Types.ObjectId[] = data.cardsId.map(data => new mongoose.Types.ObjectId(data));

        return ColumnModel.create({
            name: data.name,
            boardId: boardId,
            cardsId: cardsId
        });
    }
}