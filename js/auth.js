document.addEventListener('DOMContentLoaded', function() {
    const emailLoginBtn = document.getElementById('emailLogin');
    const googleLoginBtn = document.getElementById('googleLogin');
    
    // Login com Email
    emailLoginBtn.addEventListener('click', function() {
        console.log('Redirecionando para login com email');
        window.location.href = '/login-email.html';
    });
    
    // Login com Google
    googleLoginBtn.addEventListener('click', function() {
        console.log('Iniciando autenticação com Google');
        alert('Redirecionando para autenticação com Google (simulação)');
    });
    
    // Efeito de pulsação mais dinâmico
    const pulseBtn = document.querySelector('.btn-email');
    pulseBtn.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});