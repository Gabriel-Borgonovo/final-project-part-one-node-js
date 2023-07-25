async function uploadDocuments(user_id = 0) {
    console.log('Id del usuario', user_id);
    const url = `/api/users/${user_id}`
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  
    if(result.ok){
      console.log('documento subido');
      //window.location.reload();
    }
}