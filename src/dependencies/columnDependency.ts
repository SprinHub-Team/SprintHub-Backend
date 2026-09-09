import {ColumnRepository} from '../repository/columnRepository';
import {ColumnService} from '../service/columnService';
import { ColumnController } from '../controllers/columnController';
import { BoardRepository } from '../repository/BoardRepository';
import { CardRepository } from '../repository/cardRepository';

export const columnRepository = new ColumnRepository();

export const columnService = new ColumnService(
    columnRepository,
    new BoardRepository(),
    new CardRepository()
);

export const columnController = new ColumnController(columnService);