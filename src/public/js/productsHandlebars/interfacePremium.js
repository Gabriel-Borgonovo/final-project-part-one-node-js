async function interfazPremium(role) {
    const userRole = document.querySelector('.prod-h2');
    const btnsDelete = document.querySelectorAll('.btn-delete-product');
  
    if(role === 'premium'){
      const b = document.createElement('b');
      b.classList.add('link-for-premium');
      b.innerHTML = `
          <button class="a-premium prem-btn bgr" onclick="goFormAddProd()">
          <img src="https://cdn-icons-png.flaticon.com/512/189/189689.png" class="add-product-icon" /><b>Agregar nuevo producto</b></button>
        `;

      userRole.appendChild(b);
      
      btnsDelete.forEach((btn) => {
        btn.style.display = 'block';
      });       
   }

   if(role === 'user') {
    userRole.innerHTML = `
        <b class="link-for-premium">Conoce nuestros productos !!!</b>
        <button  class="premium-link prem-btn" onclick="goDocsLoader()"><i class="fa-solid fa-id-card"></i><span>Adquirí el role premium</span></button>  
      `;
    }

    if(role === 'admin') {
      const b = document.createElement('b');
      b.classList.add('link-for-premium');
      b.innerHTML = `
          <button  class="a-premium prem-btn bgr" onclick="goPanelUsers()">
          <img src="https://cdn-icons-png.flaticon.com/256/9131/9131529.png" class="add-product-icon" /><b>Administrar usuarios</b></button>
        `;

      userRole.appendChild(b);
      
      btnsDelete.forEach((btn) => {
        btn.style.display = 'block';
      });
    }
  }

  function goDocsLoader() {
    window.location.href = '/upload-docs';
  }

  function goPanelUsers() {
    window.location.href = '/users';
  }

  function goFormAddProd() {
    window.location.href = '/add-new-product';
  }