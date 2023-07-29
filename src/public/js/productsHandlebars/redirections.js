async function goToCart (userId, cartId){
    const url = "/cart/" + userId + "/" + cartId;
  
    const response = await fetch(url, {
        method: 'GET'
    });

    if(response.ok) {
        window.location.href = url;
    }else if(response.status === 403) {
        const responseToJson = await response.json();
        Swal.fire({
            icon: 'error',
            text: responseToJson.message,
          });
    }
}

/*go to details*/

async function goDetails(id) {
    const url = "/products/" + id;
    const response = await fetch(url, {
        method: 'GET',
    });

    if(response.ok){
        window.location.href = url;
    }else if(response.status === 403){
        const responseToJson = await response.json();
        Swal.fire({
            icon: 'error',
            text: responseToJson.message,
          })
    }
}