import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { CommentModel } from './Comment';

const CardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    columnId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },// se coloco que este en false porque cuando se haga la validacion de la columna en el product backlog mongodb lanzaria un error de validacion y no se podria crear la tarjeta, ya que en el product backlog no hay columnas pero si se puede crear una tarjeta sin columna en pocas palabras no se debe de poner el true porque lanzaria error de validacion 
    position: { type: Number, required: true, default: 0 },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    priority: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
    tasks: [{ title: { type: String, required: true }, completed: { type: Boolean, default: false } }]
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
