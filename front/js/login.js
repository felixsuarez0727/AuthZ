document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const registerForm = document.getElementById('registerForm');
    const registerEmail = document.getElementById('registerEmail');
    const registerCustomer = document.getElementById('registerCustomer');
    const registerAdmin = document.getElementById('registerAdmin');

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    const register = (role) => {
        const email = registerEmail.value;
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, role }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(`Successful registration as ${role}`);
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Registration error');
        });
    };

    registerCustomer.addEventListener('click', () => register('customer'));
    registerAdmin.addEventListener('click', () => register('admin'));

// Check if there is an error message in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    if (errorMessage) {
        alert(errorMessage);
    }
});