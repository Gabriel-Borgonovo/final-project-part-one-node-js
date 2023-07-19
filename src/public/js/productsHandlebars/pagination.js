function setCategory(category = ''){
    query.set('category', category);
    query.set('page', 1);
    query.set('limit', 10);
    window.location.search = query.toString();
  }

function setLimit(limit){
  query.set('limit', limit);
  query.set('page', 1);
  window.location.search = query.toString();
  }

 
/*Números para navegar a páginas determinadas**/
function setPaginate(page){
  query.set('page', page);
  window.location.search = query.toString();
}

function setPrice(order){
  query.set('sort', order);
  window.location.search = query.toString();
}