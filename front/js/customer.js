document.addEventListener('DOMContentLoaded', () => {
    fetch('customer/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar datos');
            }
            return response.json();
        })
        .then(data => {
            const userInfo = document.getElementById('userInfo');
            userInfo.innerHTML = `
                <strong>Correo:</strong> ${data.email}<br>
                <strong>Rol:</strong> ${data.role}
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            const userInfo = document.getElementById('userInfo');
            userInfo.textContent = 'Error loading user information.';
        });
    
    document.getElementById('logoutButton').addEventListener('click', () => {
        window.location.href = '/logout';
    });
});