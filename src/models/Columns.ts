import mongoose, { Schema, Document } from "mongoose";

export interface IColumn extends Document {
  name: string;
  groupId: mongoose.Types.ObjectId;
  cardsId: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema: Schema = new Schema(
  {
    name:{ type: String, required:true},
    cardsId:[{type: Schema.Types.ObjectId, ref: 'Card', required: true}],
    groupId:{type: Schema.Types.ObjectId, ref: 'Group', required: true}
  },
  {timestamps: true}
);

export const ColumnModel = mongoose.model<IColumn>('Column', ColumnSchema);