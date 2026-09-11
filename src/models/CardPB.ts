import mongoose, { Schema, InferSchemaType } from 'mongoose';

export const CardPbSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint', default: null }, // Preparado para la H91
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dueDate: { type: Date },
    priority: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
    tasks: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type ICardPB = InferSchemaType<typeof CardPbSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const CardPBModel = mongoose.model<ICardPB>('CardPB', CardPbSchema);