import { CardRepository } from '../repository/cardRepository';
import { CardService } from '../service/CardService';
import { ColumnRepository } from '../repository/columnRepository';
import { UserRepository } from '../repository/userRepository';
import { CommentRepository } from '../repository/commentRepository';
import { CardController } from '../controllers/cardController';

export const cardRepository = new CardRepository();

export const cardService = new CardService(
    cardRepository,
    new ColumnRepository(),
    new UserRepository(),
    new CommentRepository()
);

export const cardController = new CardController(cardService);