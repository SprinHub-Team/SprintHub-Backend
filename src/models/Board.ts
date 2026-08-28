import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';
import { Column } from '../dtos/ColumnDto';

const BoardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    columnsIds:[{ type: Schema.Types.ObjectId, ref:'Column'}]
  },
  { timestamps: true,
    versionKey: false
  }
);

export type IBoard = InferSchemaType<typeof BoardSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
};

export const BoardModel = mongoose.model<IBoard>('Board', BoardSchema);
