

async function send(event){
    event.preventDefault();
    const nombre = document.getElementById('form-name').value;
    const apellido = document.getElementById('form-lastName').value;
    const email = document.getElementById('form-email').value;
    const edad = document.getElementById('form-age').value;
    const password = document.getElementById('form-password').value;


    api.post('/api/users', {
        nombre,
        apellido,
        email,
        edad,
        password,
    }).then((d) => alert('Usuario Registrado'));

}