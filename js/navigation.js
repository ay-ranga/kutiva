
// Sistema de Navegação Kutiva (Vanilla JS)
(function() {
    'use strict';

    class KutivaNavigation {
        constructor() {
            this.isInitialized = false;
            this.init();
        }

        init() {
            // Prevenir múltiplas inicializações
            if (this.isInitialized) return;
            this.isInitialized = true;

            console.log('🧭 Inicializando sistema de navegação...');

            // Aguardar o roteador estar pronto
            this.waitForRouter();
        }

        waitForRouter() {
            if (window.kutivaRouter) {
                this.setupNavigation();
                console.log('✅ Sistema de navegação configurado');
            } else {
                setTimeout(() => this.waitForRouter(), 100);
            }
        }

        setupNavigation() {
            // Interceptar formulários de navegação
            document.addEventListener('submit', (e) => {
                const form = e.target;
                if (form.dataset.navigate) {
                    e.preventDefault();
                    const path = form.dataset.navigate;
                    this.navigate(path);
                }
            });

            // Interceptar elementos com data-navigate
            document.addEventListener('click', (e) => {
                const element = e.target.closest('[data-navigate]');
                if (element) {
                    e.preventDefault();
                    const path = element.dataset.navigate;
                    this.navigate(path);
                }
            });

            // Interceptar links com classe nav-link
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a.nav-link[href]');
                if (link && this.isInternalLink(link.href)) {
                    e.preventDefault();
                    const path = new URL(link.href).pathname;
                    this.navigate(path);
                }
            });

            // Detectar conexão offline
            window.addEventListener('offline', () => {
                console.log('🔴 Perdeu conexão - Modo offline');
                this.showOfflineIndicator();
            });

            window.addEventListener('online', () => {
                console.log('🟢 Reconectado');
                this.hideOfflineIndicator();
            });

            // Verificar estado inicial de conectividade
            if (!navigator.onLine) {
                this.showOfflineIndicator();
            }
        }

        navigate(path) {
            if (window.kutivaRouter) {
                window.kutivaRouter.navigate(path);
            } else {
                console.warn('Router não disponível, usando navegação padrão');
                window.location.href = path.startsWith('/') ? path.substring(1) + '.html' : path;
            }
        }

        isInternalLink(href) {
            try {
                const url = new URL(href);
                return url.origin === window.location.origin;
            } catch {
                return true; // Assume que é interno se não for uma URL válida
            }
        }

        showOfflineIndicator() {
            // Remover indicador existente
            this.hideOfflineIndicator();

            const indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background: #F44336;
                    color: white;
                    text-align: center;
                    padding: 10px;
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                ">
                    🔴 Sem conexão com a internet - Modo offline ativo
                </div>
            `;
            document.body.appendChild(indicator);

            // Ajustar padding do body para compensar o indicador
            document.body.style.paddingTop = '40px';
        }

        hideOfflineIndicator() {
            const indicator = document.getElementById('offline-indicator');
            if (indicator) {
                indicator.remove();
                document.body.style.paddingTop = '';
            }
        }

        // Métodos públicos para navegação programática
        goTo(path) {
            this.navigate(path);
        }

        goBack() {
            if (window.kutivaRouter) {
                window.kutivaRouter.back();
            } else {
                history.back();
            }
        }

        goForward() {
            if (window.kutivaRouter) {
                window.kutivaRouter.forward();
            } else {
                history.forward();
            }
        }

        reload() {
            if (window.kutivaRouter) {
                window.kutivaRouter.reload();
            } else {
                window.location.reload();
            }
        }
    }

    // Funções globais para navegação
    window.navigateToPage = function(path) {
        if (window.kutivaNavigation) {
            window.kutivaNavigation.goTo(path);
        } else if (window.navigateTo) {
            window.navigateTo(path);
        } else {
            console.warn('Sistemas de navegação não disponíveis');
            window.location.href = path;
        }
    };

    window.goBack = function() {
        if (window.kutivaNavigation) {
            window.kutivaNavigation.goBack();
        } else {
            history.back();
        }
    };

    // Inicializar navegação
    function initNavigation() {
        if (window.kutivaNavigationInitialized) return;
        window.kutivaNavigationInitialized = true;

        window.kutivaNavigation = new KutivaNavigation();
    }

    // Aguardar documento carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }

})();
