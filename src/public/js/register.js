

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
    const premiumRole = document.getElementById('prem').checked;

    if (userRole) {
        role = 'user';
      } else if (adminRole) {
        role = 'admin';
      } else if (premiumRole) {
        role = 'premium'
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
        // document.getElementById('form-name').value = '';
        // document.getElementById('form-lastName').value = '';
        // document.getElementById('form-email').value = '';
        // document.getElementById('form-age').value = '';
        // document.getElementById('form-password').value = '';

        window.location.href = '/login';
    });

}