function renderButtonPage() {
    
    const btnsPages = document.getElementById("btns-pages");

    console.log('total pages: ', totalPages);
    console.log('página actual: ', currentPage);

    for(let i = 1; i <= totalPages; i++){
    const button = document.createElement('button');
    button.innerText = i.toString();
    button.onclick = function(){
      setPaginate(i);
    }
    if(i === currentPage){
      button.classList.add('active');
    }
    btnsPages.appendChild(button);
  }
}