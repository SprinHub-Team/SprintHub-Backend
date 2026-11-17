import mongoose, { Schema, InferSchemaType } from 'mongoose';

export const CardPbSchema = new Schema(
  {
    rank: { type: Number, default: 0 },
    issueType: { type: String, enum: ['historia', 'tarea', 'error'], default: 'historia' },
    epic: { type: String, default: '' },
    storyPoints: { type: Number, default: 0, min: 0, max: 1000 },
    status: { type: String, enum: ['pendiente', 'en_progreso', 'completada'], default: 'pendiente' },
    title: { type: String, required: true },
    description: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint', default: null }, // Preparado para la H91
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dueDate: { type: Date },
    priority: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
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