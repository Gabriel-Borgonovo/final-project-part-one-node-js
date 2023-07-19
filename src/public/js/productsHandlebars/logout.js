async function logout() {
    const response = await fetch('/api/auth/logout', {
            method: 'POST',
            body: JSON.stringify({}), // cuerpo vacío
            headers: {   
                'Content-Type': 'application/json',       
            },
        });
        
        if(response.redirected){
            console.log(response);
            window.location.replace(response.url);
        }
    
        if(response.ok){
            return response.json();
            }
        response.json().then( d => alert(JSON.stringify(d)));
  }