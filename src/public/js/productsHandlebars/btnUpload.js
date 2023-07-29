async function uploadDocuments(user_id) {
  const userDniFile = document.getElementById('dni-user');

  const formData = new FormData();
  formData.append('documents', userDniFile.files[0]);
 
  const url = `/api/users/${user_id}`
  const result = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  if(result.ok){
    console.log('documento subido');

    Swal.fire(
      'Good job!',
      'Felicidades ahora eres un usuario Premium',
      'success'
    ).then(() => {
      const url = '/login'
      window.location.href = url;
    });
    
  } else if(result.status === 400) {
    const errorResponse = await result.json();
    console.log(errorResponse)
    const errorMessage = errorResponse.error;
    Swal.fire({
      icon: 'error',
      text: errorMessage,
    })
  }
}