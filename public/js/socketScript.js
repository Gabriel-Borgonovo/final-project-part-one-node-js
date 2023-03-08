console.log('Hola desde socketScript.js');

const socket = io(); 

socket.on('mensaje_individual', (data) => {
        console.log('mensaje_individual: ', data);
});

socket.on('Product', (product) => {
        const cardContainer = document.querySelector('.cards-container');
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="/img/${product.thumbnail}" alt="${product.thumbnail}" class="product-img"/>
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-price">$${product.price}</p>
          </div>
        `;
        cardContainer.appendChild(card);
});

socket.on('Productdelete', (productToDelete) => {
        
        console.log('producto eliminado via socket: ', productToDelete)
        
        const cards = document.querySelectorAll('.card');
        console.log('cards: ', cards);
        cards.forEach((card) => {
          if (card.dataset.id === productToDelete.id) {
                console.log('card: ', card);
            card.remove();
          }
        });
});