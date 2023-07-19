async function deleteProduct(pid, userEmail) {
    try {
      console.log('email del usuario', userEmail);
  
      const result = await Swal.fire({
        icon: 'success',
        title: `Eliminar el producto con id: ${pid}`,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
      });
  
      if (result.isConfirmed) {
        const executeDelete = async () => {
          try {
            const url = `/api/products/${pid}`;
            const response = await fetch(url, {
              method: 'DELETE',
            });
  
            console.log(response.status)
            if (response.status === 403) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No puedes eliminar el producto de otro usuario',
              });
              return;
              //throw new Error();
            }
  
            if (response.ok) {
              window.location.reload(); // recarga la página
            } else {
              throw new Error('Error al eliminar el producto.');
            }
          } catch (error) {
            console.log('error', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el producto', 'error');
          }
        };
  
        await executeDelete();
      } else {
        Swal.fire('Changes are not saved', '', 'info');
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'Hubo un problema al eliminar el producto', 'error');
    }
  }