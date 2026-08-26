import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupMember {
  user: mongoose.Types.ObjectId;
  role: 'admin' | 'collaborator' | 'visitor';
}

export interface IGroup extends Document {
  name: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  members: IGroupMember[];
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'collaborator', 'visitor'], default: 'collaborator' }
      }
    ],
  },
  { timestamps: true }
);

export const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);
