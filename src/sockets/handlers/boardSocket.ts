import { Server } from "socket.io";
import { AuthSocket } from "../socketAuthMiddleware";
import { services } from '../../dependencies/serviceDependency';
import { mongoIdSchema } from "../../utils/idValidator";

const { board: boardService, group: groupService } = services;

export function registerBoardHandlers(io: Server, socket: AuthSocket){

    socket.on('board:join', async(boardId: string, callback) => {
        
        try{

			const boardIdParsed = mongoIdSchema.parse(boardId);

            const board = await boardService.getBoardWhitDetails(boardIdParsed);

            const isMember = await groupService.isMember(board.groupId.toString(), socket.data.userId);
            if(!isMember){
				return callback?.({ok: false, error: 'No tienes acceso a este tablero'});
            }

			socket.join(`board:${boardIdParsed}`);
			callback?.({ok: true, board});

		}catch(err: any){
			callback?.({ok: false, error: err.message });
		}

    });

	socket.on('board:leave', (boardIdParsed: string) => {
		socket.leave(`board:${boardIdParsed}`);
	});

}
