import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { GroupModel } from './Group';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    documentId: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre('findOneAndDelete', async function () {
  const userId = this.getQuery()._id;
  if (!userId) return;
  await GroupModel.updateMany(
    { 'members.user': userId },
    { $pull: { members: { user: userId } } }
  );
});

export type IUser = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);