import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description?: string;
  listId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  position: number;
  assignedTo?: mongoose.Types.ObjectId;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    listId: { type: Schema.Types.ObjectId, ref: 'List', required: true },
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    position: { type: Number, required: true, default: 0 },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<ICard>('Card', CardSchema);
