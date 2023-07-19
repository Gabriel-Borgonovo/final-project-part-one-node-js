async function goToCart (userId, cartId){
    const url = "/cart/" + userId + "/" + cartId;
    window.location.href = url;
  
}

/*go to details*/

async function goDetails(id) {
    const url = "/products/" + id;
    window.location.href = url;
}