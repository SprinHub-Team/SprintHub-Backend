import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { CommentModel } from './Comment';

const CardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    columnId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    position: { type: Number, required: true, default: 0 },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date }
  },
  { timestamps: true,
    versionKey: false
  }
);

CardSchema.pre('findOneAndDelete', async function(){

  const cardId = this.getQuery()._id;
  await CommentModel.findByIdAndDelete({cardId});

});

export type ICard = InferSchemaType<typeof CardSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CardModel = mongoose.model<ICard>('Card', CardSchema);
