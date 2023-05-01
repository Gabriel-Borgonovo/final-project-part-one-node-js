

async function login(event){
    event.preventDefault();
    
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;

    // Obtener el token de la cookie
    //const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {   
            'Content-Type': 'application/json',      
        },
    });

    //console.log('response', response)
    
    if (response.ok) {
        if (response.redirected) {
            window.location.replace(response.url);
            //console.log('response', response)
        } else {
            const data = await response.json();
            console.log('data ', data)
            const token = data.token;
            //console.log('token', token);
            
        }
    } else {
        const errorData = await response.json();
        console.log(errorData.error);
    }
}