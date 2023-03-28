import { Server } from 'socket.io';
import messagesManager from '../dao/messages.manager.js'

export let socketServer;


export default function configureSocket(httpServer){
    socketServer = new Server(httpServer);

    socketServer.on('connection', (socket) => {
        socket.emit(
            'mensaje_individual', 
            'Mensaje solo para el que envía el mensaje'
            );



        //Chat--------------------------------------------

        socket.on("message", async (data) => {
            await messagesManager.addMessage(data);
            socketServer.emit("message", data);
          });


        socket.on("history", async () => {
            const messages = await messagesManager.getAll();
            socket.emit("history", messages);
          });

        });
        
}

