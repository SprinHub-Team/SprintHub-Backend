import mongoose from "mongoose";
import AppError from "../errors/AppError";

export const toObjectId = (
    id: string,
    message: string
): mongoose.Types.ObjectId =>{
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new AppError(message,400);
    }
    return new mongoose.Types.ObjectId(id);
};

export const toObjectIds = (
    ids: string[],
    message: string
): mongoose.Types.ObjectId[] => {

    return ids.map(
        id => toObjectId(id, message)
    );
};