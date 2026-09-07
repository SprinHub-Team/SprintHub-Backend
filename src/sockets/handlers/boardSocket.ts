import { Server } from "socket.io";
import { AuthSocket } from "../socketAuthMiddleware";
import { boardService } from "../../dependencies/boardDependency";
import { groupService } from "../../dependencies/groupDependency";

export function registrerBoardHandlers(io: Server, socket: AuthSocket){

    socket.on('board:join', async(boardId: string, callback) => {
        
        try{

            const board = await boardService.getBoardWhitDetails(boardId);

            const isMember = await groupService.isMember(board.groupId.toString(), socket.data.role);
            if(!isMember){
							return callback?.({ok: false, error: 'No tienes acceso a este tablero'});
            }

						socket.join(`board:${boardId}`);
						callback?.({ok: true, board});

					}catch(err: any){
						callback?.({ok: false, error: err.message });
					}

    });

		socket.on('board:leave', (boardId: string) => {
			socket.leave(`board:${boardId}`);
		});

}
