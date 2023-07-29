async function interfazPremium(role) {
    const userRole = document.querySelector('.prod-h2');
    const btnsDelete = document.querySelectorAll('.btn-delete-product');
  
    if(role === 'premium'){
      const b = document.createElement('b');
      b.classList.add('link-for-premium');
      b.innerHTML = `
          <a href="http://localhost:8080/add-new-product" class="a-premium">
          <img src="https://cdn-icons-png.flaticon.com/512/189/189689.png" class="add-product-icon" /> Agregar nuevo producto</a>
        `;

      userRole.appendChild(b);
      
      btnsDelete.forEach((btn) => {
        btn.style.display = 'block';
      });       
   }

   if(role === 'user') {
    userRole.innerHTML = `
        <b class="link-for-premium">Conoce nuestros productos !!!</b>
        <a href="http://localhost:8080/upload-docs" class="premium-link"><i class="fa-solid fa-id-card"></i><span>Adquirí el role premium</span></a>  
      `;
    }
  }