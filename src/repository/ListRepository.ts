import { ListModel, IList } from '../models/List';
import { CreateListDto, UpdateListDto } from '../dtos/ListDto';

export const ListRepository = {
  async findById(id: string): Promise<IList | null> {
    return ListModel.findById(id);
  },

  async findByBoardId(boardId: string): Promise<IList[]> {
    return ListModel.find({ boardId }).sort({ position: 1 });
  },

  async create(data: CreateListDto): Promise<IList> {
    const list = new ListModel(data);
    return list.save();
  },

  async update(id: string, data: UpdateListDto): Promise<IList | null> {
    return ListModel.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<IList | null> {
    return ListModel.findByIdAndDelete(id);
  }
};
