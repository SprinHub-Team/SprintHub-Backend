import { CardRepository } from '../repository/cardRepository';
import { CardService } from '../service/cardService';
import { columnRepository } from '../dependencies/columnDependency';
import { userRepository } from '../dependencies/userDependency';
import { commentRepository } from '../dependencies/commentDependency';
import { CardController } from '../controllers/cardController';

export const cardRepository = new CardRepository();

export const cardService = new CardService(
    cardRepository,
    columnRepository,
    userRepository,
    commentRepository
);

export const cardController = new CardController(cardService);