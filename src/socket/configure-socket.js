import { Server } from 'socket.io';

export let socketServer;

export default function configureSocket(httpServer){
    socketServer = new Server(httpServer);

    socketServer.on('connection', (socket) => {
        socket.emit(
            'mensaje_individual', 
            'Mensaje solo para el que envía el mensaje'
            );
        });
    

}

