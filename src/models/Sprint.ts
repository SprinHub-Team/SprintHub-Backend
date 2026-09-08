import moongose, { Schema, InferSchemaType } from 'mongoose';

const SprintSchema = new Schema(
  {
    name: { type: String, required: true },
    goal: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['planificado', 'activo', 'completado'],
        default: 'planificado'
    },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type ISprint = InferSchemaType<typeof SprintSchema> & {
  _id: moongose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const SprintModel = moongose.model<ISprint>('Sprint', SprintSchema);