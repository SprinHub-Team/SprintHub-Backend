import {CreateBoardDto, UpdateBoardDto } from "../dtos/BoardDto";
import {BoardRepository} from "../repository/BoardRepository";
import { ColumnRepository } from "../repository/ColumnRepository"; 
import AppError from "../errors/AppError";
import {toObjectId} from "../utils/objectId";
import {IBoard} from "../models/Board";

export class BoardService{

    constructor(
        private boardRepository: BoardRepository,
        private columnRepository: ColumnRepository
    ){}

    async findByGroupId(groupId: string): Promise<IBoard[]>{

        const groupObjectId = toObjectId(groupId,"El id del grupo es invalido");

        //FALTA CREACION DE REPOSITORY PARA VALIDAR ESPACIO DE TRABAJO

        const boards = await this.boardRepository.findByGroupId(groupObjectId);

        if(boards.length === 0){
            throw new AppError("Tablero/s no encontrado/s",404);
        }
        return boards;

    }

    async create(data: CreateBoardDto): Promise<IBoard>{

        const groupObjectId = toObjectId(data.groupId, "El id del grupo es invalido");
        const ownerObjectId = toObjectId(data.ownerId, "El id del administrador es invalido");
        const columnsObjectIds = data.columnsIds.map(column => toObjectId(column,"Uno o varios de los ids de la columnas son invalidos"));

        // FALTA CREACION DE REPOSITORY PARA VALIDAR ESPACIOS Y EL ADMINISTRADOR QUE LO CREA

        const columnsExist = await this.columnRepository.existManyByIds(columnsObjectIds);
        if(!columnsExist){
            throw new AppError("Una o varias de las columnas relacionadas no existen", 404);
        } 
        
        return this.boardRepository.create({
            title: data.title,
            description: data.description,
            groupId: groupObjectId,
            ownerId: ownerObjectId,
            columnsIds: columnsObjectIds,
        });

    }

    async update(id: string, data: UpdateBoardDto): Promise<IBoard | null>{

        const boardObjectId = toObjectId(id, "El id del tablero es invalido");
        const columnsObjectIds = data.columnsIds.map(column => toObjectId(column,"Uno o varios de los ids de la columnas son invalidos"));

        const boardExist = await this.boardRepository.existById(boardObjectId);
        if(!boardExist){
            throw new AppError("El tablero que se intenta actualizar no existe", 404);
        }

        const columnsExist = await this.columnRepository.existManyByIds(columnsObjectIds);
        if(!columnsExist){
            throw new AppError("Una o varias de las columnas relacionadas no existen", 404);
        }

        return this.boardRepository.update(boardObjectId,{
            title: data.title,
            description: data.description,
            columnsIds: columnsObjectIds
        });

    }

    async delete(id: string): Promise<boolean>{
        
        const boardObjectId = toObjectId(id, "El id del tablero es invalido");
        return this.boardRepository.delete(boardObjectId);
    
    }
}

