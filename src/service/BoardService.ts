import {CreateBoardDto, UpdateBoardDto } from "../dtos/BoardDto";
import {BoardRepository} from "../repository/BoardRepository";
import { ColumnRepository } from "../repository/ColumnRepository"; 
import AppError from "../errors/AppError";
import {IBoard} from "../models/Board";
import { UserRepository } from "../repository/UserRepository";
import mongoose from "mongoose";
import { group } from "node:console";

export class BoardService{

    constructor(
        private boardRepository: BoardRepository,
        private columnRepository: ColumnRepository,
        private userRepository: UserRepository
    ){}

    async findByGroupId(groupId: string): Promise<IBoard[]>{

        //FALTA CREACION DE REPOSITORY PARA VALIDAR ESPACIO DE TRABAJO

        const boards = await this.boardRepository.findByGroupId(groupId);

        if(boards.length === 0){
            throw new AppError("Tablero/s no encontrado/s",404);
        }
        return boards;

    }

    async create(data: CreateBoardDto): Promise<IBoard>{

        const ownerExist = this.userRepository.existById(data.ownerId);
        if(!ownerExist){
            throw new AppError("El usuario reacionado no existe", 404);
        }

        // FALTA CREACION DE REPOSITORY PARA VALIDAR ESPACIOS

        let columnsIds: string[] = [];
        if(data.columnsIds && data.columnsIds.length>0){
        
        columnsIds = data.columnsIds;

        const columsExist = this.columnRepository.existManyByIds(columnsIds);
        if(!columsExist){
            new AppError("Una o varias de las columnas relacionadas no existen", 404);
        }

        }

        return this.boardRepository.create({
            title: data.title,
            description: data.description,
            groupId: data.groupId,
            ownerId: data.ownerId,
            columnsIds: columnsIds,
        });

    }

    async update(id: string, data: UpdateBoardDto): Promise<IBoard | null>{

        const boardExist = await this.boardRepository.existById(id);
        if(!boardExist){
            throw new AppError("El tablero que se intenta actualizar no existe", 404);
        }

        let columnsIds: string[] = [];
        if(data.columnsIds && data.columnsIds.length>0){

        columnsIds = data.columnsIds;

        const columsExist = this.columnRepository.existManyByIds(columnsIds);
        if(!columsExist){
            new AppError("Una o varias de las columnas relacionadas no existen", 404);
        }

        }

        return this.boardRepository.update(id,
            {title: data.title,
            description: data.description,
            columnsIds: columnsIds
        });
    }

    // async delete(id: string): Promise<boolean>{
        
    //     const eliminarColumns = await 

    //     return this.boardRepository.delete(id);
    
    // }
}

