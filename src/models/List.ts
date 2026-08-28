import mongoose, { Schema, InferSchemaType } from 'mongoose';

const ListSchema = new Schema(
  {
    title: { type: String, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    position: { type: Number, required: true, default: 0 },
  },
  { 
    timestamps: true,
    versionKey: false
  }
);

export type IList = InferSchemaType<typeof ListSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const ListModel = mongoose.model<IList>('List', ListSchema);
