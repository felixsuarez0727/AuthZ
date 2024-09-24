document.addEventListener('DOMContentLoaded', () => {
    fetch('/welcome/data') // Endpoint para obtener datos del usuario
      .then(response => response.json())
      .then(data => {
        // Mostrar información del usuario
        const userInfo = document.getElementById('userInfo');
        userInfo.innerHTML = `
          <strong>Correo:</strong> ${data.email}<br>
          <strong>Rol:</strong> ${data.role}
        `;

        // Asignar redirección según el rol
        const role = data.role;
        document.getElementById('redirectButton').addEventListener('click', function() {
          if (role === 'admin') {
            window.location.href = '/api/admin';
          } else if (role === 'customer') {
            window.location.href = '/api/customer';
          } else {
            alert('Invalid role');
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
        const userInfo = document.getElementById('userInfo');
        userInfo.textContent = 'Error loading user information.';
      });
  });