import { SprintRepository } from "../repository/sprintRepository";
import { CardPBRepository } from "../repository/CardPBRepository";
import { SprintService } from "../service/SprintService";
import { SprintController } from "../controllers/SprintController";
import { CardRepository } from "../repository/cardRepository";

const sprintRepository = new SprintRepository();
const cardPBRepository = new CardPBRepository();
const cardRepository = new CardRepository();
const sprintService = new SprintService(sprintRepository, cardPBRepository, cardRepository);
export const sprintController = new SprintController(sprintService);