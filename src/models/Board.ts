import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
  title: string;
  description?: string;
  groupId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}




const BoardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const BoardModel = mongoose.model<IBoard>('Board', BoardSchema);
