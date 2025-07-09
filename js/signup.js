// Função para mostrar/ocultar senha
function setupPasswordToggle(passwordId, toggleId) {
    const passwordInput = document.getElementById(passwordId);
    const toggleButton = document.getElementById(toggleId);

    toggleButton.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.textContent = 'Ocultar';
        } else {
            passwordInput.type = 'password';
            toggleButton.textContent = 'Mostrar';
        }
    });
}

// Configura os toggles de senha
setupPasswordToggle('password', 'togglePassword');
setupPasswordToggle('confirm-password', 'toggleConfirmPassword');

// Função para registrar usuário na API Kutiva
async function registerUserInKutiva(user, loginType, password = null) {
    try {
        const userData = {
            email: user.email,
            username: user.email.split('@')[0],
            name: user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0],
            surname: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
            login_type: loginType,
            provider_id: user.uid
        };

        // Adiciona senha se fornecida
        if (password) {
            userData.password = password;
        }

        // Se há foto de perfil, baixa e converte para File
        if (user.photoURL) {
            const response = await fetch(user.photoURL);
            const blob = await response.blob();
            const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
            userData.avatar = file;
        }

        await window.kutivaAPI.registerUser(userData);

        // Salva dados do usuário localmente
        localStorage.setItem('kutivaUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            loginType: loginType
        }));

        return true;
    } catch (error) {
        console.error('Erro ao registrar usuário na API Kutiva:', error);
        throw error;
    }
}

// Validação do formulário de cadastro com email
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const submitBtn = this.querySelector('button[type="submit"]');

    // Validações básicas
    if (!email || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }

    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres');
        return;
    }

    // Desabilita botão durante o processo
    submitBtn.disabled = true;
    submitBtn.textContent = 'Criando conta...';

    try {
        // Criar conta no Firebase
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Registrar na API Kutiva
        await registerUserInKutiva(user, 'email', password);

        alert('Conta criada com sucesso!');
        navigateTo('/criar-perfil');

    } catch (error) {
        console.error('Erro ao criar conta:', error);
        let errorMessage = 'Erro ao criar conta. Tente novamente.';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este email já está em uso.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido.';
                break;
            case 'auth/weak-password':
                errorMessage = 'A senha é muito fraca.';
                break;
        }

        alert(errorMessage);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Criar conta';
    }
});

// Cadastro com Google
document.getElementById('google-signup-btn').addEventListener('click', async () => {
    try {
        const result = await firebase.auth().signInWithPopup(googleProvider);
        const user = result.user;

        // Registra usuário na API Kutiva
        await registerUserInKutiva(user, 'google');

        alert('Cadastro com Google realizado com sucesso!');
        navigateTo('/criar-perfil');

    } catch (error) {
        console.error('Erro no cadastro com Google:', error);
        alert('Erro ao cadastrar com Google. Tente novamente.');
    }
});

// Cadastro com Facebook
document.getElementById('facebook-signup-btn').addEventListener('click', async () => {
    try {
        const result = await firebase.auth().signInWithPopup(facebookProvider);
        const user = result.user;

        // Registra usuário na API Kutiva
        await registerUserInKutiva(user, 'facebook');

        alert('Cadastro com Facebook realizado com sucesso!');
        navigateTo('/criar-perfil');

    } catch (error) {
        console.error('Erro no cadastro com Facebook:', error);
        alert('Erro ao cadastrar com Facebook. Tente novamente.');
    }
});

// Detectar se está offline
window.addEventListener('offline', () => {
    window.location.href = 'offline.html';
});

// Function to handle navigation and set page-specific icons
function navigateTo(path) {
    // Remove .html extension
    path = path.replace(/\.html$/, '');

    // Update history
    history.pushState(null, null, path);

    // Set page icon
    setPageIcon(path);

    // Load content based on path (you'll need to implement this)
    loadContent(path);
}

function setPageIcon(path) {
    let iconPath = '/ico/favicon.ico'; // Default icon

    switch (path) {
        case '/':
            iconPath = '/ico/home.ico';
            break;
        case '/criar-perfil':
            iconPath = '/ico/profile.ico';
            break;
        case '/offline':
            iconPath = '/ico/offline.ico';
            break;
        // Add more cases as needed for other pages
        default:
            iconPath = '/ico/default.ico';
            break;
    }

    // Remove any existing favicon
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconPath;
    document.getElementsByTagName('head')[0].appendChild(link);
}

// Dummy function to load content - replace with actual content loading logic
function loadContent(path) {
    console.log('Loading content for:', path);
    // Here you would load the appropriate content for the given path,
    // likely using fetch or by manipulating the DOM directly.
}

// Initial page load - determine the route and load appropriate content
window.addEventListener('load', () => {
    const currentPath = window.location.pathname;
    navigateTo(currentPath);
});

// Handle back/forward button navigation
window.addEventListener('popstate', () => {
    const currentPath = window.location.pathname;
    navigateTo(currentPath);
});