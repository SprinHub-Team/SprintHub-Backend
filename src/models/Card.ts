import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';

const CardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    listId: { type: Schema.Types.ObjectId, ref: 'List', required: true },
    columnId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    position: { type: Number, required: true, default: 0 },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dueDate: { type: Date }
  },
  { timestamps: true,
    versionKey: false
  }
);

export type ICard = InferSchemaType<typeof CardSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
}

export const CardModel = mongoose.model<ICard>('Card', CardSchema);
