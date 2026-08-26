import mongoose, { Schema, Document } from 'mongoose';

export interface IList extends Document {
  title: string;
  boardId: mongoose.Types.ObjectId;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const ListModel = mongoose.model<IList>('List', ListSchema);
