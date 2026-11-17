import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { CommentModel } from './Comment';

const CardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    columnId: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    priority: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
    status: { type: String, enum: ['pendiente', 'en_progreso', 'completada'], default: 'pendiente' },
    completedAt: { type: Date, default: null },
    subtasks: [{ id: { type: String, required: true }, title: { type: String, required: true }, completed: { type: Boolean, default: false }, _id: false }],
    sourceBacklogId: { type: Schema.Types.ObjectId, ref: 'CardPB' },
    files: [{
      path:{ type: String, required: true},
      fileName: { type: String, required:true},
      url: { type: String, required: true},
    }]
  },
  { timestamps: true,
    versionKey: false
  }
);

CardSchema.index({ sourceBacklogId: 1 }, { unique: true, sparse: true });

CardSchema.pre('findOneAndDelete', async function(){

  const cardId = this.getQuery()._id;
  await CommentModel.deleteMany({cardId});

});

export type ICard = InferSchemaType<typeof CardSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CardModel = mongoose.model<ICard>('Card', CardSchema);
