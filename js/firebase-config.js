// Configuração do Firebase para Kutiva
(function() {
    'use strict';

    // Configuração correta do Firebase usando os dados do google-services.json
    const firebaseConfig = {
        apiKey: "AIzaSyAgpwyV-nXP7U0MkLZSb7JsBx0TnDVkMz8",
        authDomain: "kutiva-8a875.firebaseapp.com",
        databaseURL: "https://kutiva-8a875-default-rtdb.firebaseio.com",
        projectId: "kutiva-8a875",
        storageBucket: "kutiva-8a875.appspot.com",
        messagingSenderId: "293924144980",
        appId: "1:293924144980:web:a7de770e962d945db36ac1"
    };

    // Sistema de autenticação funcional
    class KutivaAuth {
        constructor() {
            this.currentUser = null;
            this.isReady = false;
            this.init();
        }

        async init() {
            try {
                // Aguardar Firebase carregar
                if (typeof firebase === 'undefined') {
                    console.error('Firebase não está disponível');
                    return;
                }

                // Inicializar Firebase
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }

                this.auth = firebase.auth();
                this.db = firebase.firestore();

                // Configurar provedores
                this.googleProvider = new firebase.auth.GoogleAuthProvider();
                this.facebookProvider = new firebase.auth.FacebookAuthProvider();

                // Monitorar autenticação
                this.auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        console.log('✅ Usuário autenticado:', user.email);
                        await this.handleAuthentication(user);
                    } else {
                        console.log('❌ Usuário não autenticado');
                        this.currentUser = null;
                        this.clearUserData();
                    }
                    this.isReady = true;
                });

                console.log('🔥 Firebase inicializado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao inicializar Firebase:', error);
                this.isReady = true;
            }
        }

        async handleAuthentication(firebaseUser) {
            try {
                const token = await firebaseUser.getIdToken();

                // Criar objeto de usuário
                this.currentUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || 'Usuário',
                    photoURL: firebaseUser.photoURL,
                    token: token,
                    loginTime: Date.now()
                };

                // Salvar dados localmente
                localStorage.setItem('kutivaUser', JSON.stringify(this.currentUser));

                // Simular registro na API Kutiva (já que a API real não existe)
                await this.simulateKutivaRegistration();

                console.log('✅ Usuário logado com sucesso');

                // Redirecionar para biblioteca se estiver na página de login
                if (window.location.pathname.includes('login') || window.location.pathname.includes('auth')) {
                    window.kutivaRouter?.navigate('/biblioteca');
                }

            } catch (error) {
                console.error('Erro ao processar autenticação:', error);
            }
        }

        async simulateKutivaRegistration() {
            // Simular chamada para API Kutiva
            console.log('📡 Simulando registro na API Kutiva...');

            // Salvar dados simulados do usuário
            const kutivaUserData = {
                id: this.currentUser.uid,
                email: this.currentUser.email,
                name: this.currentUser.displayName,
                registration_date: new Date().toISOString(),
                subscription: 'free',
                books_accessed: []
            };

            localStorage.setItem('kutivaUserData', JSON.stringify(kutivaUserData));
            console.log('✅ Dados do usuário salvos localmente');
        }

        // Métodos de login
        async loginWithGoogle() {
            try {
                console.log('🔐 Iniciando login com Google...');
                const result = await this.auth.signInWithPopup(this.googleProvider);
                return result.user;
            } catch (error) {
                console.error('Erro no login Google:', error);
                throw new Error('Falha no login com Google');
            }
        }

        async loginWithFacebook() {
            try {
                console.log('🔐 Iniciando login com Facebook...');
                const result = await this.auth.signInWithPopup(this.facebookProvider);
                return result.user;
            } catch (error) {
                console.error('Erro no login Facebook:', error);
                throw new Error('Falha no login com Facebook');
            }
        }

        async loginWithEmail(email, password) {
            try {
                console.log('🔐 Iniciando login com email...');
                const result = await this.auth.signInWithEmailAndPassword(email, password);
                return result.user;
            } catch (error) {
                console.error('Erro no login email:', error);
                throw new Error('Email ou senha incorretos');
            }
        }

        async signupWithEmail(email, password, displayName) {
            try {
                console.log('📝 Criando conta com email...');
                const result = await this.auth.createUserWithEmailAndPassword(email, password);

                // Atualizar perfil
                await result.user.updateProfile({
                    displayName: displayName
                });

                return result.user;
            } catch (error) {
                console.error('Erro no cadastro:', error);
                throw new Error('Erro ao criar conta: ' + error.message);
            }
        }

        async logout() {
            try {
                await this.auth.signOut();
                this.currentUser = null;
                this.clearUserData();
                console.log('✅ Logout realizado');
                window.kutivaRouter?.navigate('/login');
            } catch (error) {
                console.error('Erro no logout:', error);
            }
        }

        clearUserData() {
            localStorage.removeItem('kutivaUser');
            localStorage.removeItem('kutivaUserData');
        }

        // Verificações
        isLoggedIn() {
            return this.currentUser !== null;
        }

        getCurrentUser() {
            return this.currentUser;
        }

        canAccessBooks() {
            return this.isLoggedIn();
        }

        waitForAuth() {
            return new Promise((resolve) => {
                if (this.isReady) {
                    resolve();
                } else {
                    const check = () => {
                        if (this.isReady) {
                            resolve();
                        } else {
                            setTimeout(check, 100);
                        }
                    };
                    check();
                }
            });
        }
    }

    // Inicializar quando documento carregar
    function initAuth() {
        window.kutivaAuth = new KutivaAuth();
        console.log('🔐 Sistema de autenticação inicializado');
    }

    // Aguardar DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }

})();