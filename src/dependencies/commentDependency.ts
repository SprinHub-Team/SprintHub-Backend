import { CommentRepository } from '../repository/commentRepository';
import { CommentService } from '../service/commentService';
import { userRepository } from '../dependencies/userDependency';
import { CommentController } from '../controllers/commentController';
import { cardRepository } from '../dependencies/cardDependency';


export const commentRepository = new CommentRepository();

export const commentService = new CommentService(
    commentRepository,
    cardRepository,
    userRepository
);

export const commentController = new CommentController(commentService);