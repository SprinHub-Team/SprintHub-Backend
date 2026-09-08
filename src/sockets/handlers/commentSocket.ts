import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { createCommentRequest, CreateCommentRequest, deleteCommentRequest, DeleteCommentRequest, updateCommentRequest, UpdateCommentRequest } from '../../dtos/CommentDto';
import { services } from '../../dependencies/serviceDependency';

const commentService = services.comment;


export function registerCommentHandlers(io: Server, socket: AuthSocket){

  socket.on('comment:create', async(data: CreateCommentRequest, callback)=>{

      try{

				const {commentData, paramData} = createCommentRequest.parse(data);

				const comment = await commentService.create(commentData);
				io.to(`board:${paramData.boardId}`).emit('comment:created', comment);
				callback?.({ok: true, comment});

			}catch(err: any){
				callback?.({ok: false, error: err.message});
			}

  });

	socket.on('comment:update', async(data: UpdateCommentRequest, callback)=>{

		try{

			const {commentData, paramData} = updateCommentRequest.parse(data);

			const comment = await commentService.update(paramData.commentId, commentData);
			socket.to(`board:${paramData.boardId}`).emit('comment:updated', comment);
			callback?.({ok: true, comment });

		}catch(err: any){
			callback?.({ok: false, error: err.message});
		}

	});

	socket.on('comment:delete', async(data: DeleteCommentRequest, callback)=>{

		try{

			const {boardId, commentId} = deleteCommentRequest.parse(data);

			await commentService.delete(commentId);
			io.to(`board:${boardId}`).emit('comment:deleted', commentId);
			callback?.({ok: true});

		}catch(err: any){
			callback?.({ok: false, error: err.message});
		}

	});

}