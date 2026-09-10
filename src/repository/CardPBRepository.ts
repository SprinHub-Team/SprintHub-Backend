import { CardPBModel, ICardPB } from '../models/CardPB';

export class CardPBRepository {
  async create(cardData: Partial<ICardPB>): Promise<ICardPB> {
    const card = new CardPBModel(cardData);
    return await card.save();
  }

  async findBacklogByGroup(groupId: string, search?: string, assignedTo?: string): Promise<ICardPB[]> {
    const filter: any = {
      groupId,
      sprintId: null
    };

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    return await CardPBModel.find(filter).populate('assignedTo', 'name email');
  }

  async delete(id: string): Promise<ICardPB | null> {
    return await CardPBModel.findByIdAndDelete(id);
  }

  async updateSprint(cardId: string , sprintId: string | null){
    return await CardPBModel.findByIdAndUpdate(
        cardId,
        {sprintId : sprintId},
        { new: true }
    ).populate('assignedTo', 'name email');
  }

  async findBySprint(sprintId : string){
    return await CardPBModel.find({ sprintId}).populate('assignedTo', 'name email');
  }

  async findById(id: string): Promise<ICardPB | null> {
    return await CardPBModel.findById(id).populate('assignedTo', 'name email');
  }
}