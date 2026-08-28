import mongoose, { Schema, InferSchemaType } from 'mongoose';

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'collaborator', 'visitor'], default: 'collaborator', required: true }
      }
    ]
  },
  { 
    timestamps: true,
    versionKey: false
  }
);

export type IGroup = Omit<InferSchemaType<typeof GroupSchema>, 'members'> & {
  _id: mongoose.Types.ObjectId;
  members: {
    user: mongoose.Types.ObjectId;
    role: 'admin' | 'collaborator' | 'visitor';
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type IGroupMember = IGroup['members'][number];

export const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);
