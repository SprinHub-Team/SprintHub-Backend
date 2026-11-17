import { BoardModel } from '../models/Board';
import { ColumnModel } from '../models/Column';
import { CardModel } from '../models/Card';
import { SprintModel } from '../models/Sprint';
import { CardPbMapper } from '../mappers/cardPbMapper';
import { SprintMapper } from '../mappers/sprintMapper';
import { CardPBModel } from '../models/CardPB';
import type { ClientSession } from 'mongoose';
import { CardPbWithUser } from '../dtos/response/cardPbResponseDto';
import { CreateCardPbInput, UpdateCardPbInput } from '../dtos/input/cardPbInputDto';
export class CardPBRepository {
  async planning(groupId: string) {
    const [cards, sprints, boards] = await Promise.all([
      CardPBModel.find({ groupId })
        .populate("assignedTo", "name email")
        .sort({ rank: 1, createdAt: 1, _id: 1 }),
      SprintModel.find({ groupId }).sort({ createdAt: -1 }),
      BoardModel.find({ groupId }).select("title").lean(),
    ]);
    const columns = await ColumnModel.find({
      boardId: { $in: boards.map((b) => b._id) },
    }).lean();
    const links = await CardModel.find({
      sourceBacklogId: { $in: cards.map((c) => c._id) },
    })
      .select("sourceBacklogId columnId")
      .lean();
    return {
      cards: cards.map((c) => {
        const link = links.find(
          (l) => l.sourceBacklogId?.toString() === c._id.toString(),
        );
        return {
          ...CardPbMapper.toResponse(c as unknown as CardPbWithUser),
          linkedCardId: link?._id.toString() ?? null,
          boardId:
            columns
              .find((col) => col._id.equals(link?.columnId))
              ?.boardId.toString() ?? null,
        };
      }),
      sprints: sprints.map(SprintMapper.toResponse),
      destinations: columns.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        boardId: c.boardId.toString(),
        boardName: boards.find((b) => b._id.equals(c.boardId))?.title ?? "",
      })),
    };
  }


  async returnSprintIssuesToBacklog(groupId: string, sprintId: string, session: ClientSession): Promise<void> {
    await CardPBModel.updateMany({ groupId, sprintId }, { $set: { sprintId: null } }, { session });
  }

  
  async reorder(groupId: string, sprintId: string | null, ids: string[]) {
    await CardPBModel.bulkWrite(ids.map((id, index) => ({ updateOne: { filter: { _id: id, groupId, sprintId }, update: { $set: { rank: (index + 1) * 1024 } } } })));
  }
  async update(id: string, data: UpdateCardPbInput): Promise<CardPbWithUser | null> {
    return await CardPBModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('assignedTo', 'name email') as unknown as CardPbWithUser | null;
  }
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
        { title: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$regex: search'), $options: 'i' } },
        { description: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$regex: search'), $options: 'i' } }
      ];
    }
    return (await CardPBModel.find(filter).sort({ rank: 1, createdAt: 1, _id: 1 }).populate('assignedTo', 'name email')) as unknown as CardPbWithUser[];
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
