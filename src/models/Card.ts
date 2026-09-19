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
    attachments: [{
      fileName: { type: String, required: true },
      fileUrl: { type: String, required: true },
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true,
    versionKey: false
  }
);

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
