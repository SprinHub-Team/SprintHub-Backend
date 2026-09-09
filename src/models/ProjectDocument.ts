import mongoose, { Schema, InferSchemaType } from 'mongoose';

const ProjectDocumentSchema = new Schema({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, versionKey: false });

export type IProjectDocument = InferSchemaType<typeof ProjectDocumentSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ProjectDocumentModel = mongoose.model<IProjectDocument>('ProjectDocument', ProjectDocumentSchema);
