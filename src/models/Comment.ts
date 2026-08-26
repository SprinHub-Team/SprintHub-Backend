import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  name: string;
  description: string;
  columnId: mongoose.Types.ObjectId;
  CreatedFor: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    columId: { type: mongoose.Types.ObjectId, ref: "Colum", required: true },
  },
  { timestamps: true },
);

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);