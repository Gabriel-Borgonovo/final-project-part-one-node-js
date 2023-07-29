const socket = io(); 


/***Chat */

const d = document;
const chatbox = d.getElementById('chat-box');
//const btnSendMsg = d.getElementById('btn-msg');
const mensajes = d.getElementById('mensajes');
const btnClean = d.getElementById('clean-chat');




socket.on("message", function (data) {
    mostrarMensajes(data);
});



function sendMessageChat(email) {
  
      socket.emit("message", {
        user: email,
        message: chatbox.value,
      });
        
      chatbox.value = "";
              
    }



  function mostrarMensajes(messages) {
      let html = '';
      if (Array.isArray(messages)) {
          messages.forEach(message => {
          html += `<p><span class="span-user">${message.user}:<span/> <span class="span-message">${message.message}</span></p>`;
        });
     }
     else {
        html = `<p><span class="span-user">${messages.user}:<span/> <span class="span-message">${messages.message}</span></p>`;
      }
     mensajes.innerHTML += html;
  }

socket.on("history", function (data) {
    const messages = data;
    mostrarMensajes(messages);
  });

  // Emitir el evento 'history' cuando se carga la página

    socket.emit("history");


  // function validarEmail(email) {
  //   // Usar una expresión regular para comprobar el formato del email
  //   const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //   return regex.test(email);
  // }



  