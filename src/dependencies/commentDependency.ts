import { CommentRepository } from '../repository/commentRepository';
import { CommentService } from '../service/commentService';
import { UserRepository } from '../repository/userRepository';
import { CommentController } from '../controllers/commentController';
import { CardRepository } from '../repository/cardRepository';


export const commentRepository = new CommentRepository();

export const commentService = new CommentService(
    commentRepository,
    new CardRepository(),
    new UserRepository()
);

export const commentController = new CommentController(commentService);