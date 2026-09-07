import {ColumnRepository} from '../repository/columnRepository';
import {ColumnService} from '../service/columnService';
import { ColumnController } from '../controllers/columnController';
import { boardrepository } from '../dependencies/boardDependency';
import { cardRepository } from '../dependencies/cardDependency';

export const columnRepository = new ColumnRepository();

export const columnService = new ColumnService(
    columnRepository,
    boardrepository,
    cardRepository );

export const columnController = new ColumnController(columnService);