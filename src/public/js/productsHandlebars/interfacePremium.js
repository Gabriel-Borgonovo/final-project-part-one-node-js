async function interfazPremium(role) {
    const linkPremium = document.querySelector('.link-for-premium');
    const btnsDelete = document.querySelectorAll('.btn-delete-product');
  
    if(role === 'premium'){
      linkPremium.innerHTML = `<a href="http://localhost:8080/add-new-product" class="a-premium">
                                 <img src="https://cdn-icons-png.flaticon.com/512/189/189689.png" class="add-product-icon" /> Agregar nuevo producto</a>`;
      
      
        btnsDelete.forEach((btn) => {
          btn.style.display = 'block';
        });      
      
   }
  }