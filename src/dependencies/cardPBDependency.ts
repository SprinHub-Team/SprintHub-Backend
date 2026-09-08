import { CardPBRepository } from '../repository/CardPBRepository';
import { CardPBService } from '../service/CardPBService';
import { CardPBController } from '../controllers/cardPBController';

const cardPBRepository = new CardPBRepository();
const cardPBService = new CardPBService(cardPBRepository);
export const cardPBController = new CardPBController(cardPBService);
