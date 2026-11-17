import { CardModel } from "../models/Card";
import mongoose from "mongoose";
import { CardPBModel } from "../models/CardPB";
import { SprintModel } from "../models/Sprint";
import { getIo } from "../sockets/realtime";
import { SprintRepository } from "../repository/sprintRepository";
import { CardPBRepository } from "../repository/cardPBRepository";
import { CardRepository } from "../repository/cardRepository";
import { ColumnRepository } from "../repository/columnRepository";
import { GroupRepository } from "../repository/groupRepository";
import { SprintResponse } from "../dtos/response/sprintResponseDto";
import { CardPbResponse } from "../dtos/response/cardPbResponseDto";
import { CardDetailsResponse } from "../dtos/response/cardResponseDto";
import {
  CreateSprintInput,
  MoveCardToSprintInput,
  ExportToBoardInput,
} from "../dtos/input/sprintInputDto";
import { SprintMapper } from "../mappers/sprintMapper";
import { CardPbMapper } from "../mappers/cardPbMapper";
import { CardMapper } from "../mappers/cardMapper";
import AppError from "../errors/AppError";
export class SprintService {
  constructor(
    private sprintRepository: SprintRepository,
    private cardPBRepository: CardPBRepository,
    private cardRepository: CardRepository,
    private readonly groupRepository: GroupRepository,
    private readonly columnRepository: ColumnRepository,
  ) {}

  async createSprint(
    data: CreateSprintInput,
    userId: string,
  ): Promise<SprintResponse> {
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
    const sprint = await this.sprintRepository.create({
      ...data,
      status: "planificado",
    });
    return SprintMapper.toResponse(sprint);
  }

  async deleteSprint(id: string, userId: string): Promise<void> {
    const sprint = await this.sprintRepository.findById(id);
    if (!sprint) throw new AppError("Sprint no encontrado", 404);

    const groupId = sprint.groupId.toString();
    if (
      !(await this.groupRepository.isMemberAndRoleValid(groupId, userId, [
        "admin",
      ]))
    ) {
      throw new AppError(
        "Solo un administrador del grupo puede eliminar un sprint",
        403,
      );
    }

    await mongoose.connection.transaction(async (session) => {
      const deleted = await this.sprintRepository.delete(id, groupId, session);
      if (!deleted) throw new AppError("Sprint no encontrado", 404);
      await this.cardPBRepository.returnSprintIssuesToBacklog(
        groupId,
        id,
        session,
      );
    });
  }

  async getSprintsByGroup(
    groupId: string,
    userId: string,
  ): Promise<SprintResponse[]> {
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
    const sprints = await this.sprintRepository.findByGroup(groupId);
    return sprints.map((sprint) => SprintMapper.toResponse(sprint));
  }

  async moveCardToSprint(
    data: MoveCardToSprintInput,
    userId: string,
  ): Promise<CardPbResponse> {
    const cardPb = await this.cardPBRepository.findById(data.cardId);
    if (!cardPb) throw new AppError("Actividad no encontrada", 404);
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      cardPb.groupId.toString(),
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
      cardPb.sprintId &&
      (await this.sprintRepository.findById(cardPb.sprintId.toString()))
        ?.status === "completado"
    )
      throw new AppError("El sprint de origen ya está cerrado", 409);
    if (data.sprintId) {
      const sprint = await this.sprintRepository.findById(data.sprintId);
      if (!sprint) throw new AppError("El sprint destino no existe", 404);
      if (sprint.status === "completado")
        throw new AppError("El sprint destino ya está cerrado", 409);
      if (sprint.groupId.toString() !== cardPb.groupId.toString()) {
        throw new AppError(
          "El sprint destino no pertenece al grupo de la actividad",
          400,
        );
      }
    }
    const updatedCard = await this.cardPBRepository.updateSprint(
      data.cardId,
      data.sprintId,
    );
    if (!updatedCard) throw new AppError("Actividad no encontrada", 404);
    return CardPbMapper.toResponse(updatedCard);
  }

  async getCardsInSprint(
    sprintId: string,
    userId: string,
  ): Promise<CardPbResponse[]> {
    const sprint = await this.sprintRepository.findById(sprintId);
    if (!sprint) throw new AppError("El sprint consultado no existe", 404);
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      sprint.groupId.toString(),
      userId,
      ["admin", "collaborator"],
    );
    if (!hasPermission) {
      throw new AppError(
        "El usuario no tiene permiso para realizar esta acción o el grupo no existe",
        403,
      );
    }
    const cards = await this.cardPBRepository.findBySprint(sprintId);
    return cards.map((card) => CardPbMapper.toResponse(card));
  }

  async exportToBoard(
    data: ExportToBoardInput,
    userId: string,
  ): Promise<CardDetailsResponse> {
    const cardPb = await this.cardPBRepository.findById(data.cardId);
    if (!cardPb)
      throw new AppError("La actividad no existe en el Sprint/Backlog", 404);
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      cardPb.groupId.toString(),
      userId,
      ["admin", "collaborator"],
    );
    if (!hasPermission) {
      throw new AppError(
        "El usuario no tiene permiso para realizar esta acción o el grupo no existe",
        403,
      );
    }
    const columnContext = await this.columnRepository.getColumnContext(
      data.columnId,
    );
    if (!columnContext) throw new AppError("La columna destino no existe", 404);
    if (columnContext.groupId !== cardPb.groupId.toString()) {
      throw new AppError(
        "La columna destino no pertenece al grupo de la actividad",
        400,
      );
    }
    if (
      cardPb.sprintId &&
      (await this.sprintRepository.findById(cardPb.sprintId.toString()))
        ?.status === "completado"
    )
      throw new AppError("El sprint ya está cerrado", 409);
    const assignedToId = cardPb.assignedTo
      ? cardPb.assignedTo._id.toString()
      : undefined;
    // An idempotent link keeps the backlog and board as two views of the same task.
    const linked = await CardModel.findOneAndUpdate(
      { sourceBacklogId: data.cardId },
      {
        $setOnInsert: {
          sourceBacklogId: data.cardId,
          title: cardPb.title,
          description: cardPb.description,
          columnId: data.columnId,
          assignedTo: assignedToId,
          dueDate: cardPb.dueDate,
          priority: cardPb.priority,
          status: cardPb.status,
        },
      },
      { upsert: true, new: true, runValidators: true },
    );
    const newCard = await this.cardRepository.findById(linked.id);
    if (!newCard) throw new AppError("No se pudo vincular la tarjeta", 500);
    const linkedContext = await this.cardRepository.getCardContext(linked.id);
    getIo()
      .to("board:" + (linkedContext?.boardId ?? columnContext.boardId))
      .emit("card:created", CardMapper.toDetailsResponse(newCard));
    return CardMapper.toDetailsResponse(newCard);
  }

  async transition(
    id: string,
    status: "activo" | "completado",
    userId: string,
    columnId?: string,
  ) {
    const sprint = await this.sprintRepository.findById(id);
    if (!sprint) throw new AppError("Sprint no encontrado", 404);
    const groupId = sprint.groupId.toString();
    if (
      !(await this.groupRepository.isMemberAndRoleValid(groupId, userId, [
        "admin",
        "collaborator",
      ]))
    )
      throw new AppError("Sin acceso al grupo", 403);
    if (status === "activo") {
      if (sprint.status !== "planificado")
        throw new AppError("Solo puedes iniciar un sprint planificado", 409);
      if (await SprintModel.exists({ groupId, status: "activo" }))
        throw new AppError("Completa primero el sprint activo", 409);
      const cards = await this.cardPBRepository.findBySprint(id);
      if (!cards.length)
        throw new AppError("Añade al menos una incidencia al sprint", 400);
      if (!columnId)
        throw new AppError("Selecciona una columna de destino", 400);
      const context = await this.columnRepository.getColumnContext(columnId);
      if (!context || context.groupId !== groupId)
        throw new AppError("Destino inválido", 400);
      for (const card of cards)
        await this.exportToBoard(
          { cardId: card._id.toString(), columnId },
          userId,
        );
    } else {
      if (sprint.status !== "activo")
        throw new AppError("Solo puedes completar un sprint activo", 409);
      await CardPBModel.updateMany(
        { sprintId: id, status: { $ne: "completada" } },
        { $set: { sprintId: null } },
      );
    }
    const updated = await this.sprintRepository.update(id, { status });
    if (!updated) throw new AppError("Sprint no encontrado", 404);
    return SprintMapper.toResponse(updated);
  }
}
