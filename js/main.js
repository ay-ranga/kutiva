
// Aplicação Principal Kutiva (Vanilla JS)
(function() {
    'use strict';

    class KutivaApp {
        constructor() {
            this.isInitialized = false;
            this.init();
        }

        async init() {
            if (this.isInitialized) return;
            
            try {
                console.log('🚀 Inicializando Kutiva App...');
                
                // Aguardar sistemas estarem prontos
                await this.waitForSystems();
                
                // Configurar interceptadores para livros
                this.setupBookProtection();
                
                // Configurar navegação offline
                this.setupOfflineHandling();
                
                // Carregar dados iniciais
                await this.loadInitialData();
                
                this.isInitialized = true;
                console.log('✅ Kutiva App inicializado com sucesso');
                
            } catch (error) {
                console.error('❌ Erro ao inicializar Kutiva App:', error);
            }
        }

        async waitForSystems() {
            console.log('⏳ Aguardando sistemas essenciais...');
            
            return new Promise((resolve) => {
                function check() {
                    if (window.kutivaRouter && window.kutivaAPI) {
                        console.log('✅ Sistemas essenciais carregados');
                        resolve();
                    } else {
                        setTimeout(check, 100);
                    }
                }
                check();
            });
        }

        setupBookProtection() {
            console.log('🔒 Configurando proteção de livros...');
            
            // Interceptar tentativas de abertura de livros
            document.addEventListener('click', (e) => {
                const bookLink = e.target.closest('[data-book-id]');
                if (bookLink) {
                    e.preventDefault();
                    const bookId = bookLink.dataset.bookId;
                    this.handleBookAccess(bookId);
                }
            });

            // Interceptar botões de download
            document.addEventListener('click', (e) => {
                const downloadBtn = e.target.closest('[data-download-book]');
                if (downloadBtn) {
                    e.preventDefault();
                    const bookId = downloadBtn.dataset.downloadBook;
                    this.handleBookDownload(bookId);
                }
            });

            // Interceptar links de leitura
            document.addEventListener('click', (e) => {
                const readBtn = e.target.closest('[data-read-book]');
                if (readBtn) {
                    e.preventDefault();
                    const bookId = readBtn.dataset.readBook;
                    this.handleBookRead(bookId);
                }
            });
        }

        setupOfflineHandling() {
            console.log('📡 Configurando tratamento offline...');
            
            // Detectar mudanças de conectividade
            window.addEventListener('online', () => {
                console.log('🟢 Conectado - Sincronizando dados...');
                this.handleOnline();
            });

            window.addEventListener('offline', () => {
                console.log('🔴 Offline - Ativando modo cache...');
                this.handleOffline();
            });

            // Verificar estado inicial
            if (!navigator.onLine) {
                this.handleOffline();
            }
        }

        async loadInitialData() {
            console.log('📊 Carregando dados iniciais...');
            
            try {
                if (window.kutivaAPI && navigator.onLine) {
                    // Carregar dados em background
                    Promise.all([
                        window.kutivaAPI.getGrades().catch(e => console.warn('Erro ao carregar classes:', e)),
                        window.kutivaAPI.getSubjects().catch(e => console.warn('Erro ao carregar disciplinas:', e)),
                        window.kutivaAPI.getBooks().catch(e => console.warn('Erro ao carregar livros:', e))
                    ]).then(() => {
                        console.log('✅ Dados iniciais carregados');
                    }).catch(e => {
                        console.warn('Alguns dados não puderam ser carregados:', e);
                    });
                }
            } catch (error) {
                console.warn('Erro ao carregar dados iniciais:', error);
            }
        }

        async handleBookAccess(bookId) {
            try {
                console.log(`📖 Tentativa de acesso ao livro: ${bookId}`);
                
                // Verificar autenticação
                if (!window.kutivaAuth || !window.kutivaAuth.isLoggedIn()) {
                    this.showLoginRequired();
                    return;
                }

                // Verificar se o livro existe no cache offline
                const offlineBook = await this.getOfflineBook(bookId);
                if (offlineBook) {
                    console.log('📚 Abrindo livro do cache offline');
                    this.openBookViewer(bookId);
                    return;
                }

                // Tentar carregar do servidor
                if (navigator.onLine) {
                    console.log('🌐 Carregando livro do servidor...');
                    this.openBookViewer(bookId);
                } else {
                    this.showOfflineMessage();
                }

            } catch (error) {
                console.error('Erro ao acessar livro:', error);
                this.showError('Erro ao acessar livro: ' + error.message);
            }
        }

        async handleBookDownload(bookId) {
            try {
                console.log(`⬇️ Download do livro: ${bookId}`);
                
                if (!window.kutivaAuth || !window.kutivaAuth.isLoggedIn()) {
                    this.showLoginRequired();
                    return;
                }

                if (!navigator.onLine) {
                    this.showError('É necessário estar online para baixar livros');
                    return;
                }

                // Mostrar progresso
                this.showProgress('Baixando livro...');

                // Realizar download
                if (window.kutivaBookViewer) {
                    await window.kutivaBookViewer.downloadForOffline(bookId);
                    this.showSuccess('Livro baixado para leitura offline!');
                } else {
                    throw new Error('Visualizador de livros não disponível');
                }

            } catch (error) {
                console.error('Erro no download:', error);
                this.showError('Erro ao baixar livro: ' + error.message);
            } finally {
                this.hideProgress();
            }
        }

        async handleBookRead(bookId) {
            try {
                console.log(`👁️ Lendo livro: ${bookId}`);
                this.openBookViewer(bookId);
            } catch (error) {
                console.error('Erro ao abrir livro:', error);
                this.showError('Erro ao abrir livro: ' + error.message);
            }
        }

        openBookViewer(bookId) {
            if (window.kutivaBookViewer) {
                const container = document.body;
                window.kutivaBookViewer.openBook(bookId, container);
            } else {
                this.showError('Visualizador de livros não disponível');
            }
        }

        async getOfflineBook(bookId) {
            try {
                if (window.kutivaAPI) {
                    const offlineBooks = await window.kutivaAPI.getDownloadedBooks();
                    return offlineBooks.find(book => book.id === bookId);
                }
            } catch (error) {
                console.warn('Erro ao buscar livro offline:', error);
            }
            return null;
        }

        handleOnline() {
            // Remover mensagem de offline se existir
            const offlineMsg = document.getElementById('offline-message');
            if (offlineMsg) {
                offlineMsg.remove();
            }

            // Sincronizar dados
            if (window.kutivaAPI) {
                window.kutivaAPI.syncOfflineData();
            }

            this.showNotification('Conectado! Dados sincronizados.', 'success');
        }

        handleOffline() {
            this.showNotification('Modo offline ativado. Funcionalidades limitadas.', 'warning');
        }

        showLoginRequired() {
            const message = 'É necessário fazer login para acessar os livros.';
            this.showError(message);
            
            // Redirecionar para login após 2 segundos
            setTimeout(() => {
                if (window.navigateTo) {
                    window.navigateTo('/login');
                } else {
                    window.location.href = 'login.html';
                }
            }, 2000);
        }

        showOfflineMessage() {
            this.showError('Livro não disponível offline. Conecte-se à internet para acessar.');
        }

        showProgress(message) {
            const existing = document.getElementById('progress-overlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'progress-overlay';
            overlay.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    color: white;
                    font-family: Arial, sans-serif;
                ">
                    <div style="text-align: center;">
                        <div style="margin-bottom: 20px; font-size: 18px;">${message}</div>
                        <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            document.body.appendChild(overlay);
        }

        hideProgress() {
            const overlay = document.getElementById('progress-overlay');
            if (overlay) {
                overlay.remove();
            }
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : type === 'error' ? '#F44336' : '#2196F3'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10001;
                font-family: Arial, sans-serif;
                max-width: 300px;
                word-wrap: break-word;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;

            document.body.appendChild(notification);

            // Remover após 5 segundos
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }, 5000);

            // Adicionar animações CSS se não existirem
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        showError(message) {
            this.showNotification(message, 'error');
        }

        showSuccess(message) {
            this.showNotification(message, 'success');
        }
    }

    // Inicializar aplicação
    function initKutivaApp() {
        if (window.kutivaAppInitialized) return;
        window.kutivaAppInitialized = true;

        window.kutivaApp = new KutivaApp();
    }

    // Aguardar documento carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKutivaApp);
    } else {
        initKutivaApp();
    }

})();
