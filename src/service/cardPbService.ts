import { CardModel } from "../models/Card";
import { SprintModel } from "../models/Sprint";
import { getIo } from "../sockets/realtime";
import { CardRepository } from "../repository/cardRepository";
import { CardMapper } from "../mappers/cardMapper";
import { UpdateCardPbInput } from "../dtos/input/cardPbInputDto";
import { CardPBRepository } from "../repository/cardPBRepository";
import { GroupRepository } from "../repository/groupRepository";
import { CardPbResponse } from "../dtos/response/cardPbResponseDto";
import {
  CreateCardPbInput,
  GetBacklogInput,
} from "../dtos/input/cardPbInputDto";
import { CardPbMapper } from "../mappers/cardPbMapper";
import AppError from "../errors/AppError";
export class CardPBService {
  constructor(
    private cardPBRepository: CardPBRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async getPlanning(groupId: string, userId: string) {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      groupId,
      userId,
      ["admin", "collaborator"],
    );
    if (!hasPermission) throw new AppError("No tienes acceso a este grupo", 403);
    return this.cardPBRepository.planning(groupId);
  }

  async reorder(
    groupId: string,
    sprintId: string | null,
    ids: string[],
    userId: string,
  ) {
    if (!(await this.groupRepository.isMember(groupId, userId)))
      throw new AppError("Sin acceso al grupo", 403);
    if (sprintId) {
      const sprint = await SprintModel.findById(sprintId);
      if (
        !sprint ||
        sprint.groupId.toString() !== groupId ||
        sprint.status === "completado"
      )
        throw new AppError("Sprint inválido o cerrado", 409);
    }
    const current = sprintId
      ? await this.cardPBRepository.findBySprint(sprintId)
      : await this.cardPBRepository.findBacklogByGroup(groupId);
    const existing = new Set(current.map((c) => c._id.toString()));
    if (existing.size !== ids.length || ids.some((id) => !existing.has(id)))
      throw new AppError(
        "El backlog cambió. Actualiza la vista antes de reordenar",
        409,
      );
    await this.cardPBRepository.reorder(groupId, sprintId, ids);
  }
  async create(
    data: CreateCardPbInput,
    userId: string,
  ): Promise<CardPbResponse> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      data.groupId,
      userId,
      ["admin", "collaborator"],
    );
    if (!hasPermission) {
      throw new AppError(
        "El usuario no tiene permiso para realizar esta acción o el grupo no existe",
        403,
      );
    }
    if (
      data.assignedTo &&
      !(await this.groupRepository.isMember(data.groupId, data.assignedTo))
    )
      throw new AppError("El responsable debe pertenecer al grupo", 400);
    const card = await this.cardPBRepository.create({
      ...data,
      rank: data.rank ?? Date.now(),
    });
    return CardPbMapper.toResponse(card);
  }
  async update(
    id: string,
    data: UpdateCardPbInput,
    userId: string,
  ): Promise<CardPbResponse> {
    const previous = await this.cardPBRepository.findById(id);
    if (!previous) throw new AppError("Actividad no encontrada", 404);
    const groupId = previous.groupId.toString();
    if (!(await this.groupRepository.isMember(groupId, userId)))
      throw new AppError("Sin acceso al grupo", 403);
    if (
      previous.sprintId &&
      (await SprintModel.findById(previous.sprintId))?.status === "completado"
    )
      throw new AppError("El sprint ya está cerrado", 409);
    if (
      data.assignedTo &&
      !(await this.groupRepository.isMember(groupId, data.assignedTo))
    )
      throw new AppError("El responsable debe pertenecer al grupo", 400);
    const card = await this.cardPBRepository.update(id, data);
    if (!card) throw new AppError("Actividad no encontrada", 404);
    const linked = await CardModel.findOneAndUpdate(
      { sourceBacklogId: id },
      {
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
        status: data.status,
        ...(data.status
          ? { completedAt: data.status === "completada" ? new Date() : null }
          : {}),
      },
      { new: true },
    );
    if (linked) {
      const repository = new CardRepository();
      const context = await repository.getCardContext(linked.id);
      const details = await repository.findById(linked.id);
      if (context && details)
        getIo()
          .to("board:" + context.boardId)
          .emit("card:updated", CardMapper.toDetailsResponse(details));
    }
    return CardPbMapper.toResponse(card);
  }
  async getBacklog(
    data: GetBacklogInput,
    userId: string,
  ): Promise<CardPbResponse[]> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      data.groupId,
      userId,
      ["admin", "collaborator"],
    );
    if (!hasPermission) {
      throw new AppError(
        "El usuario no tiene permiso para realizar esta acción o el grupo no existe",
        403,
      );
    }
    const cards = await this.cardPBRepository.findBacklogByGroup(
      data.groupId,
      data.search,
      data.assignedTo,
    );
    return cards.map((card) => CardPbMapper.toResponse(card));
  }

  async delete(id: string, userId: string): Promise<CardPbResponse> {
    const cardPb = await this.cardPBRepository.findById(id);
    if (!cardPb) throw new AppError("Actividad no encontrada", 404);
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      cardPb.groupId.toString(),
      userId,
      ["admin"],
    );
    if (!hasPermission) {
      throw new AppError(
        "El usuario no tiene permiso para realizar esta acción o el grupo no existe",
        403,
      );
    }
    if (await CardModel.exists({ sourceBacklogId: id }))
      throw new AppError(
        "Elimina primero la tarjeta vinculada del tablero",
        409,
      );
    const deleted = await this.cardPBRepository.delete(id);
    if (!deleted) throw new AppError("Actividad no encontrada", 404);
    return CardPbMapper.toResponse(deleted);
  }

  async exportBacklogToCsv(groupId: string, userId: string): Promise<string> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      groupId,
      userId,
      ["admin", "collaborator"],
    );
    if (!hasPermission) {
      throw new AppError(
        "El usuario no tiene permiso para realizar esta acción o el grupo no existe",
        403,
      );
    }
    const cards = await this.cardPBRepository.findBacklogByGroup(groupId);
    const cell = (value: string) =>
      '"' +
      (/^[=+@\-\t\r]/.test(value) ? "'" : "") +
      value.replace(/"/g, '""') +
      '"';
    const header =
      "Titulo,Descripcion,Prioridad,Asignado,Fecha de Vencimiento\n";
    const rows = cards.map((card) =>
      [
        card.title,
        card.description ?? "",
        card.priority,
        card.assignedTo?.name ?? "Sin asignar",
        card.dueDate?.toISOString() ?? "",
      ]
        .map(cell)
        .join(","),
    );
    return header + rows.join("\n");
  }
}
