import { CardPBModel } from '../models/CardPB';
import { CardPbWithUser } from '../dtos/response/cardPbResponseDto';
import { CreateCardPbInput } from '../dtos/input/cardPbInputDto';
export class CardPBRepository {
  
  async create(cardData: CreateCardPbInput): Promise<CardPbWithUser> {
    const card = await CardPBModel.create(cardData);
    await card.populate('assignedTo', 'name email');
    return card as unknown as CardPbWithUser;
  }

  async findBacklogByGroup(groupId: string, search?: string, assignedTo?: string): Promise<CardPbWithUser[]> {
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
    return (await CardPBModel.find(filter).populate('assignedTo', 'name email')) as unknown as CardPbWithUser[];
  }

  async delete(id: string): Promise<CardPbWithUser | null> {
    return (await CardPBModel.findByIdAndDelete(id).populate(
      'assignedTo',
      'name email'
    )) as unknown as CardPbWithUser | null;
  }

  async updateSprint(cardId: string, sprintId: string | null): Promise<CardPbWithUser | null> {
    return (await CardPBModel.findByIdAndUpdate(
      cardId,
      { sprintId },
      { new: true }
    ).populate('assignedTo', 'name email')) as unknown as CardPbWithUser | null;
  }

  async findBySprint(sprintId: string): Promise<CardPbWithUser[]> {
    return (await CardPBModel.find({ sprintId }).populate(
      'assignedTo',
      'name email'
    )) as unknown as CardPbWithUser[];
  }

  async findById(id: string): Promise<CardPbWithUser | null> {
    return (await CardPBModel.findById(id).populate(
      'assignedTo',
      'name email'
    )) as unknown as CardPbWithUser | null;
  }

}