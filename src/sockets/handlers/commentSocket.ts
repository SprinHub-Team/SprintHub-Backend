import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { services } from '../../dependencies/serviceDependency';
import { CreateCommentInput, createCommentInputSchema, DeleteCommentInput, deleteCommentInputSchema, UpdateCommentInput, updateCommentInputSchema } from '../../dtos/input/commentInputDto';

const commentService = services.comment;


export function registerCommentHandlers(io: Server, socket: AuthSocket){

  socket.on('comment:create', async(data: CreateCommentInput, callback)=>{

      try{

			const commentData = createCommentInputSchema.parse(data);

			const {comment, boardId } = await commentService.create(commentData, socket.data.userId);
			io.to(`board:${boardId}`).emit('comment:created', comment);
			callback?.({ok: true, comment});

		}catch(err: any){
			callback?.({ok: false, error: err.message});
		}

  });

	socket.on('comment:update', async(data: UpdateCommentInput, callback)=>{

		try{

			const commentData = updateCommentInputSchema.parse(data);

			const {comment, boardId} = await commentService.update(commentData, socket.data.userId);
			socket.to(`board:${boardId}`).emit('comment:updated', comment);
			callback?.({ok: true, comment });

		}catch(err: any){
			callback?.({ok: false, error: err.message});
		}

	});

	socket.on('comment:delete', async(data: DeleteCommentInput, callback)=>{

		try{

			const commentId = deleteCommentInputSchema.parse(data);

			const boardId = await commentService.delete(commentId, socket.data.userId);
			io.to(`board:${boardId}`).emit('comment:deleted', commentId);
			callback?.({ok: true});

		}catch(err: any){
			callback?.({ok: false, error: err.message});
		}

	});

}