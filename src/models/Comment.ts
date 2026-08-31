import mongoose, { Schema, InferSchemaType } from "mongoose";

const CommentSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    cardId: { type: mongoose.Types.ObjectId, ref: "Colum", required: true },
    createdFor:{type:mongoose.Types.ObjectId, ref:"User", required:true}
  },
  { timestamps: true,
    versionKey: false
   },
);


export type IComment = InferSchemaType<typeof CommentSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
};

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);