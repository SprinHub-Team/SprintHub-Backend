import mongoose, { Schema, InferSchemaType } from "mongoose";

const ColumnSchema: Schema = new Schema(
  {
    name:{ type: String, required:true},
    cardsId:[{type: Schema.Types.ObjectId, ref: 'Card', required: true}],
    boardId:{type: Schema.Types.ObjectId, ref: 'Board', required: true}
  },
  {timestamps: true,
    versionKey: false
  }
);

export type IColumn = InferSchemaType<typeof ColumnSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
};

export const ColumnModel = mongoose.model<IColumn>('Column', ColumnSchema);