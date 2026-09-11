import { SprintModel, ISprint } from '../models/Sprint';

export class SprintRepository {
    async create(data: Partial<ISprint>): Promise<ISprint> {
        const sprint = new SprintModel(data);
        return await sprint.save();
    }

    async findByGroup(groupId: string): Promise<ISprint[]> {
        return await SprintModel.find({ groupId }).sort({ createdAt: -1});
    }

    async findById(id: string): Promise<ISprint | null > {
        return await SprintModel.findById(id);
    }
    
    async update(id: string, updateData: Partial<ISprint>): Promise<ISprint | null>{
        return await SprintModel.findByIdAndUpdate(id, updateData, {new:true});
    }
}