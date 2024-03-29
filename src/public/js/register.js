

async function send(event){
    event.preventDefault();
    const nombre = document.getElementById('form-name').value;
    const apellido = document.getElementById('form-lastName').value;
    const email = document.getElementById('form-email').value;
    const edad = document.getElementById('form-age').value;
    const password = document.getElementById('form-password').value;

    let role;

    const userRole = document.getElementById('use').checked;
    const adminRole = document.getElementById('adm').checked;

    if (userRole) {
        role = 'user';
      } else if (adminRole) {
        role = 'admin';
      } 

    api.post('/api/auth/register', {
        nombre,
        apellido,
        email,
        edad,
        password,
        role
    }).then((d) => {
        alert('Usuario Registrado');
        
        window.location.href = '/login';
    });

}