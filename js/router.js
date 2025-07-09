
// Sistema de Roteamento Kutiva
(function() {
    'use strict';

    class KutivaRouter {
        constructor() {
            this.routes = new Map();
            this.currentRoute = null;
            this.isInitialized = false;
            this.setupRoutes();
        }

        setupRoutes() {
            // Definir rotas da aplicação
            this.routes.set('/', () => this.renderHome());
            this.routes.set('/login', () => this.renderLogin());
            this.routes.set('/auth', () => this.renderAuth());
            this.routes.set('/signup', () => this.renderSignup());
            this.routes.set('/biblioteca', () => this.renderBiblioteca());
            this.routes.set('/profile', () => this.renderProfile());
            this.routes.set('/book/:id', (params) => this.renderBook(params.id));
            this.routes.set('/offline', () => this.renderOffline());
        }

        init() {
            if (this.isInitialized) return;

            // Escutar mudanças de URL
            window.addEventListener('popstate', () => {
                this.handleRouteChange();
            });

            // Interceptar clicks em links
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href]');
                if (link && link.href.startsWith(window.location.origin)) {
                    e.preventDefault();
                    const path = link.getAttribute('href');
                    this.navigate(path);
                }
            });

            this.isInitialized = true;
            this.handleRouteChange();
        }

        navigate(path) {
            if (this.currentRoute !== path) {
                history.pushState(null, null, path);
                this.handleRouteChange();
            }
        }

        handleRouteChange() {
            const path = window.location.pathname;
            this.currentRoute = path;

            // Verificar autenticação para rotas protegidas
            if (this.requiresAuth(path) && !this.isAuthenticated()) {
                this.navigate('/login');
                return;
            }

            // Executar rota
            this.executeRoute(path);
        }

        requiresAuth(path) {
            const protectedRoutes = ['/biblioteca', '/profile', '/book'];
            return protectedRoutes.some(route => path.startsWith(route));
        }

        isAuthenticated() {
            return window.kutivaAuth && window.kutivaAuth.isLoggedIn();
        }

        executeRoute(path) {
            let routeFound = false;

            for (let [routePath, handler] of this.routes) {
                const params = this.matchRoute(routePath, path);
                if (params !== null) {
                    handler(params);
                    routeFound = true;
                    break;
                }
            }

            if (!routeFound) {
                this.render404();
            }
        }

        matchRoute(routePath, currentPath) {
            const routeParts = routePath.split('/');
            const currentParts = currentPath.split('/');

            if (routeParts.length !== currentParts.length) {
                return null;
            }

            const params = {};

            for (let i = 0; i < routeParts.length; i++) {
                const routePart = routeParts[i];
                const currentPart = currentParts[i];

                if (routePart.startsWith(':')) {
                    const paramName = routePart.substring(1);
                    params[paramName] = currentPart;
                } else if (routePart !== currentPart) {
                    return null;
                }
            }

            return params;
        }

        // Renderizadores de página
        renderHome() {
            this.renderContent(`
                <div class="home-page">
                    <div class="hero-section">
                        <h1>Biblioteca Kutiva</h1>
                        <p>Sua biblioteca digital de livros educacionais</p>
                        <div class="hero-buttons">
                            <a href="/biblioteca" class="btn btn-primary">Explorar Livros</a>
                            <a href="/login" class="btn btn-secondary">Fazer Login</a>
                        </div>
                    </div>
                </div>
            `);
        }

        renderLogin() {
            this.renderContent(`
                <div class="auth-page">
                    <div class="auth-container">
                        <h2>Entrar na Biblioteca Kutiva</h2>
                        <div class="auth-buttons">
                            <button id="google-login" class="btn btn-google">
                                <i class="fab fa-google"></i> Entrar com Google
                            </button>
                            <button id="facebook-login" class="btn btn-facebook">
                                <i class="fab fa-facebook"></i> Entrar com Facebook
                            </button>
                        </div>
                        <div class="divider">ou</div>
                        <form id="email-login-form">
                            <input type="email" id="email" placeholder="Email" required>
                            <input type="password" id="password" placeholder="Senha" required>
                            <button type="submit" class="btn btn-primary">Entrar</button>
                        </form>
                        <p class="auth-link">
                            Não tem conta? <a href="/signup">Criar conta</a>
                        </p>
                    </div>
                </div>
            `);
            this.setupLoginHandlers();
        }

        renderAuth() {
            this.renderLogin(); // Redirecionar para login
        }

        renderSignup() {
            this.renderContent(`
                <div class="auth-page">
                    <div class="auth-container">
                        <h2>Criar Conta na Biblioteca Kutiva</h2>
                        <div class="auth-buttons">
                            <button id="google-signup" class="btn btn-google">
                                <i class="fab fa-google"></i> Criar com Google
                            </button>
                            <button id="facebook-signup" class="btn btn-facebook">
                                <i class="fab fa-facebook"></i> Criar com Facebook
                            </button>
                        </div>
                        <div class="divider">ou</div>
                        <form id="email-signup-form">
                            <input type="text" id="displayName" placeholder="Nome completo" required>
                            <input type="email" id="signupEmail" placeholder="Email" required>
                            <input type="password" id="signupPassword" placeholder="Senha" required>
                            <button type="submit" class="btn btn-primary">Criar Conta</button>
                        </form>
                        <p class="auth-link">
                            Já tem conta? <a href="/login">Fazer login</a>
                        </p>
                    </div>
                </div>
            `);
            this.setupSignupHandlers();
        }

        async renderBiblioteca() {
            const user = window.kutivaAuth?.getCurrentUser();
            if (!user) {
                this.navigate('/login');
                return;
            }

            this.renderContent(`
                <div class="biblioteca-page">
                    <div class="biblioteca-header">
                        <h1>Biblioteca Kutiva</h1>
                        <div class="user-info">
                            <span>Olá, ${user.displayName}!</span>
                            <button id="logout-btn" class="btn btn-secondary">Sair</button>
                        </div>
                    </div>
                    
                    <div class="filters">
                        <select id="grade-filter">
                            <option value="">Todas as Classes</option>
                        </select>
                        <select id="subject-filter">
                            <option value="">Todas as Disciplinas</option>
                        </select>
                        <input type="text" id="search-input" placeholder="Buscar livros...">
                    </div>
                    
                    <div id="loading" class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Carregando livros...</p>
                    </div>
                    
                    <div id="books-grid" class="books-grid"></div>
                </div>
            `);

            await this.loadBibliotecaData();
        }

        async loadBibliotecaData() {
            try {
                // Aguardar API estar pronta
                if (!window.kutivaAPI) {
                    setTimeout(() => this.loadBibliotecaData(), 500);
                    return;
                }

                // Carregar dados
                const [grades, subjects, books] = await Promise.all([
                    window.kutivaAPI.getGrades(),
                    window.kutivaAPI.getSubjects(),
                    window.kutivaAPI.getBooks()
                ]);

                // Popular filtros
                this.populateFilters(grades, subjects);
                
                // Mostrar livros
                this.displayBooks(books);
                
                // Configurar eventos
                this.setupBibliotecaEvents();
                
                // Esconder loading
                const loading = document.getElementById('loading');
                if (loading) loading.style.display = 'none';

            } catch (error) {
                console.error('Erro ao carregar biblioteca:', error);
                this.showError('Erro ao carregar dados da biblioteca');
            }
        }

        populateFilters(grades, subjects) {
            const gradeFilter = document.getElementById('grade-filter');
            const subjectFilter = document.getElementById('subject-filter');

            if (gradeFilter) {
                grades.forEach(grade => {
                    const option = document.createElement('option');
                    option.value = grade.id;
                    option.textContent = grade.name;
                    gradeFilter.appendChild(option);
                });
            }

            if (subjectFilter) {
                subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject.id;
                    option.textContent = subject.name;
                    subjectFilter.appendChild(option);
                });
            }
        }

        displayBooks(books) {
            const booksGrid = document.getElementById('books-grid');
            if (!booksGrid) return;

            if (books.length === 0) {
                booksGrid.innerHTML = '<p class="no-books">Nenhum livro encontrado</p>';
                return;
            }

            booksGrid.innerHTML = books.map(book => `
                <div class="book-card" data-book-id="${book.id}">
                    <div class="book-cover">
                        <img src="${book.cover_url}" alt="${book.title}">
                    </div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                        <p class="book-subject">${book.subject_name} - ${book.grade_name}</p>
                        <div class="book-actions">
                            <button class="btn btn-primary" onclick="window.kutivaRouter.openBook('${book.id}')">
                                <i class="fas fa-book-open"></i> Abrir
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        setupBibliotecaEvents() {
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    window.kutivaAuth.logout();
                });
            }

            // Filtros
            const gradeFilter = document.getElementById('grade-filter');
            const subjectFilter = document.getElementById('subject-filter');
            const searchInput = document.getElementById('search-input');

            if (gradeFilter) gradeFilter.addEventListener('change', () => this.applyFilters());
            if (subjectFilter) subjectFilter.addEventListener('change', () => this.applyFilters());
            if (searchInput) searchInput.addEventListener('input', () => this.applyFilters());
        }

        async applyFilters() {
            const gradeId = document.getElementById('grade-filter')?.value;
            const subjectId = document.getElementById('subject-filter')?.value;
            const searchTerm = document.getElementById('search-input')?.value.toLowerCase();

            let books = await window.kutivaAPI.getBooks();

            if (gradeId) {
                books = books.filter(book => book.grade_id == gradeId);
            }

            if (subjectId) {
                books = books.filter(book => book.subject_id == subjectId);
            }

            if (searchTerm) {
                books = books.filter(book => 
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm) ||
                    book.subject_name.toLowerCase().includes(searchTerm)
                );
            }

            this.displayBooks(books);
        }

        async openBook(bookId) {
            try {
                console.log('📖 Abrindo livro:', bookId);
                
                if (!window.kutivaAPI.canAccessBook()) {
                    alert('É necessário fazer login para acessar os livros');
                    this.navigate('/login');
                    return;
                }

                const book = await window.kutivaAPI.getBook(bookId);
                
                // Renderizar visualizador de livro
                this.renderContent(`
                    <div class="book-viewer">
                        <div class="book-header">
                            <button class="btn btn-secondary" onclick="window.kutivaRouter.navigate('/biblioteca')">
                                <i class="fas fa-arrow-left"></i> Voltar
                            </button>
                            <h2>${book.title}</h2>
                        </div>
                        <div class="book-content">
                            ${book.content}
                        </div>
                    </div>
                `);

            } catch (error) {
                console.error('Erro ao abrir livro:', error);
                if (error.message === 'LOGIN_REQUIRED') {
                    alert('É necessário fazer login para acessar este livro');
                    this.navigate('/login');
                } else {
                    alert('Erro ao abrir livro: ' + error.message);
                }
            }
        }

        renderProfile() {
            const user = window.kutivaAuth?.getCurrentUser();
            if (!user) {
                this.navigate('/login');
                return;
            }

            this.renderContent(`
                <div class="profile-page">
                    <h1>Meu Perfil</h1>
                    <div class="profile-info">
                        <div class="profile-avatar">
                            <img src="${user.photoURL || '/icon/user.png'}" alt="Avatar">
                        </div>
                        <div class="profile-details">
                            <h2>${user.displayName}</h2>
                            <p>Email: ${user.email}</p>
                            <p>Membro desde: ${new Date(user.loginTime).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn-primary" onclick="window.kutivaRouter.navigate('/biblioteca')">
                            Ir para Biblioteca
                        </button>
                        <button class="btn btn-secondary" onclick="window.kutivaAuth.logout()">
                            Sair
                        </button>
                    </div>
                </div>
            `);
        }

        renderOffline() {
            this.renderContent(`
                <div class="offline-page">
                    <div class="offline-message">
                        <i class="fas fa-wifi-slash"></i>
                        <h2>Sem conexão</h2>
                        <p>Verifique sua conexão com a internet e tente novamente.</p>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            `);
        }

        render404() {
            this.renderContent(`
                <div class="error-page">
                    <h1>404</h1>
                    <p>Página não encontrada</p>
                    <a href="/" class="btn btn-primary">Voltar ao Início</a>
                </div>
            `);
        }

        renderContent(html) {
            const content = document.getElementById('content');
            if (content) {
                content.innerHTML = html;
            }
        }

        setupLoginHandlers() {
            const googleBtn = document.getElementById('google-login');
            const facebookBtn = document.getElementById('facebook-login');
            const emailForm = document.getElementById('email-login-form');

            if (googleBtn) {
                googleBtn.addEventListener('click', async () => {
                    try {
                        await window.kutivaAuth.loginWithGoogle();
                    } catch (error) {
                        alert('Erro no login com Google: ' + error.message);
                    }
                });
            }

            if (facebookBtn) {
                facebookBtn.addEventListener('click', async () => {
                    try {
                        await window.kutivaAuth.loginWithFacebook();
                    } catch (error) {
                        alert('Erro no login com Facebook: ' + error.message);
                    }
                });
            }

            if (emailForm) {
                emailForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;

                    try {
                        await window.kutivaAuth.loginWithEmail(email, password);
                    } catch (error) {
                        alert('Erro no login: ' + error.message);
                    }
                });
            }
        }

        setupSignupHandlers() {
            const googleBtn = document.getElementById('google-signup');
            const facebookBtn = document.getElementById('facebook-signup');
            const emailForm = document.getElementById('email-signup-form');

            if (googleBtn) {
                googleBtn.addEventListener('click', async () => {
                    try {
                        await window.kutivaAuth.loginWithGoogle();
                    } catch (error) {
                        alert('Erro no cadastro com Google: ' + error.message);
                    }
                });
            }

            if (facebookBtn) {
                facebookBtn.addEventListener('click', async () => {
                    try {
                        await window.kutivaAuth.loginWithFacebook();
                    } catch (error) {
                        alert('Erro no cadastro com Facebook: ' + error.message);
                    }
                });
            }

            if (emailForm) {
                emailForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const displayName = document.getElementById('displayName').value;
                    const email = document.getElementById('signupEmail').value;
                    const password = document.getElementById('signupPassword').value;

                    try {
                        await window.kutivaAuth.signupWithEmail(email, password, displayName);
                    } catch (error) {
                        alert('Erro no cadastro: ' + error.message);
                    }
                });
            }
        }

        showError(message) {
            const content = document.getElementById('content');
            if (content) {
                content.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>${message}</p>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            Tentar Novamente
                        </button>
                    </div>
                `;
            }
        }
    }

    // Inicializar roteador
    function initRouter() {
        window.kutivaRouter = new KutivaRouter();
        console.log('🛣️ Sistema de roteamento inicializado');
    }

    // Aguardar DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRouter);
    } else {
        initRouter();
    }

})();
