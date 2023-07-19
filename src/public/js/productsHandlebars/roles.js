async function changeRole(user_id){
    const url = `/api/users/premium/${user_id}`
    const result = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  
    if(result.ok){
      console.log('role actualizado');
      window.location.reload();
    }
   }