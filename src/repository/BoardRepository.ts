import {BoardModel} from '../models/Board';
import mongoose from 'mongoose';

export class BoardRepository {
    async findByUserId(id: string){
        const idBuscado = new mongoose.Types.ObjectId(id);
    }
}
