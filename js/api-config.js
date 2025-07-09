` tags.

<replit_final_file>
// API Config com dados simulados funcionais
(function() {
    'use strict';

    // Dados simulados de livros por classe
    const SIMULATED_DATA = {
        grades: [
            { id: 1, name: '1ª Classe', level: 'primary' },
            { id: 2, name: '2ª Classe', level: 'primary' },
            { id: 3, name: '3ª Classe', level: 'primary' },
            { id: 4, name: '4ª Classe', level: 'primary' },
            { id: 5, name: '5ª Classe', level: 'primary' },
            { id: 6, name: '6ª Classe', level: 'primary' },
            { id: 7, name: '7ª Classe', level: 'primary' },
            { id: 8, name: '8ª Classe', level: 'secondary' },
            { id: 9, name: '9ª Classe', level: 'secondary' },
            { id: 10, name: '10ª Classe', level: 'secondary' },
            { id: 11, name: '11ª Classe', level: 'secondary' },
            { id: 12, name: '12ª Classe', level: 'secondary' }
        ],
        subjects: [
            { id: 1, name: 'Português', icon: '📚' },
            { id: 2, name: 'Matemática', icon: '🔢' },
            { id: 3, name: 'História', icon: '📜' },
            { id: 4, name: 'Geografia', icon: '🌍' },
            { id: 5, name: 'Ciências Naturais', icon: '🔬' },
            { id: 6, name: 'Inglês', icon: '🇬🇧' },
            { id: 7, name: 'Educação Física', icon: '⚽' },
            { id: 8, name: 'Educação Musical', icon: '🎵' },
            { id: 9, name: 'Educação Visual', icon: '🎨' },
            { id: 10, name: 'Física', icon: '⚛️' },
            { id: 11, name: 'Química', icon: '🧪' },
            { id: 12, name: 'Biologia', icon: '🌱' }
        ],
        books: []
    };

    // Gerar livros simulados
    function generateSimulatedBooks() {
        const books = [];
        const subjects = SIMULATED_DATA.subjects;
        const grades = SIMULATED_DATA.grades;

        subjects.forEach(subject => {
            grades.forEach(grade => {
                const bookId = `book_${subject.id}_${grade.id}`;
                books.push({
                    id: bookId,
                    title: `${subject.name} - ${grade.name}`,
                    author: `Ministério da Educação`,
                    subject_id: subject.id,
                    subject_name: subject.name,
                    grade_id: grade.id,
                    grade_name: grade.name,
                    description: `Livro de ${subject.name} para ${grade.name}`,
                    cover_url: `/icon/book.png`,
                    pages: Math.floor(Math.random() * 200) + 50,
                    file_size: Math.floor(Math.random() * 50) + 10,
                    download_url: `#download_${bookId}`,
                    content_preview: `Este é o livro de ${subject.name} para ${grade.name}. Conteúdo educativo completo com exercícios e explicações detalhadas.`
                });
            });
        });

        return books;
    }

    // Inicializar dados simulados
    SIMULATED_DATA.books = generateSimulatedBooks();

    // Sistema de cache offline
    class OfflineCache {
        constructor() {
            this.localStorage = window.localStorage;
            this.cachePrefix = 'kutiva_cache_';
        }

        set(key, data) {
            try {
                const cacheData = {
                    data: data,
                    timestamp: Date.now()
                };
                this.localStorage.setItem(this.cachePrefix + key, JSON.stringify(cacheData));
            } catch (error) {
                console.warn('Erro ao salvar cache:', error);
            }
        }

        get(key) {
            try {
                const cached = this.localStorage.getItem(this.cachePrefix + key);
                if (cached) {
                    const cacheData = JSON.parse(cached);
                    // Cache válido por 24 horas
                    if (Date.now() - cacheData.timestamp < 24 * 60 * 60 * 1000) {
                        return cacheData.data;
                    }
                }
            } catch (error) {
                console.warn('Erro ao ler cache:', error);
            }
            return null;
        }

        clear() {
            try {
                Object.keys(this.localStorage).forEach(key => {
                    if (key.startsWith(this.cachePrefix)) {
                        this.localStorage.removeItem(key);
                    }
                });
            } catch (error) {
                console.warn('Erro ao limpar cache:', error);
            }
        }
    }

    // API Kutiva simulada
    class KutivaAPI {
        constructor() {
            this.cache = new OfflineCache();
            this.isOnline = navigator.onLine;

            // Salvar dados no cache
            this.cache.set('grades', SIMULATED_DATA.grades);
            this.cache.set('subjects', SIMULATED_DATA.subjects);
            this.cache.set('books', SIMULATED_DATA.books);
        }

        async simulateNetworkDelay() {
            return new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
        }

        async getGrades() {
            await this.simulateNetworkDelay();
            const cached = this.cache.get('grades');
            return cached || SIMULATED_DATA.grades;
        }

        async getSubjects() {
            await this.simulateNetworkDelay();
            const cached = this.cache.get('subjects');
            return cached || SIMULATED_DATA.subjects;
        }

        async getBooks() {
            await this.simulateNetworkDelay();
            const cached = this.cache.get('books');
            return cached || SIMULATED_DATA.books;
        }

        async getGradeSubjects(gradeId) {
            await this.simulateNetworkDelay();
            return SIMULATED_DATA.subjects.filter(subject => {
                // Simular que algumas disciplinas são para certas classes
                if (gradeId <= 7) {
                    return [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(subject.id);
                } else {
                    return subject.id <= 12;
                }
            });
        }

        async getSubjectBooks(subjectId) {
            await this.simulateNetworkDelay();
            const books = await this.getBooks();
            return books.filter(book => book.subject_id == subjectId);
        }

        async getGradeSubjectBooks(gradeId, subjectId) {
            await this.simulateNetworkDelay();
            const books = await this.getBooks();
            return books.filter(book => 
                book.grade_id == gradeId && book.subject_id == subjectId
            );
        }

        async getBook(bookId) {
            if (!window.kutivaAuth || !window.kutivaAuth.isLoggedIn()) {
                throw new Error('LOGIN_REQUIRED');
            }

            await this.simulateNetworkDelay();
            const books = await this.getBooks();
            const book = books.find(b => b.id === bookId);

            if (!book) {
                throw new Error('Livro não encontrado');
            }

            // Simular conteúdo do livro
            book.content = this.generateBookContent(book);

            // Registrar acesso
            this.registerBookAccess(bookId);

            return book;
        }

        generateBookContent(book) {
            return `
                <div class="book-content">
                    <h1>${book.title}</h1>
                    <p class="book-author">Por: ${book.author}</p>
                    <div class="book-description">
                        <p>${book.description}</p>
                        <p>Este é um livro educativo completo com ${book.pages} páginas de conteúdo.</p>
                        <p>Adequado para estudantes de ${book.grade_name}.</p>
                    </div>
                    <div class="sample-content">
                        <h2>Conteúdo de Exemplo</h2>
                        <p>Este é um exemplo do conteúdo que estaria disponível no livro completo.</p>
                        <p>O livro completo contém exercícios, explicações detalhadas e material de apoio.</p>
                    </div>
                </div>
            `;
        }

        registerBookAccess(bookId) {
            try {
                const user = window.kutivaAuth.getCurrentUser();
                if (user) {
                    let userData = JSON.parse(localStorage.getItem('kutivaUserData') || '{}');
                    if (!userData.books_accessed) userData.books_accessed = [];

                    if (!userData.books_accessed.includes(bookId)) {
                        userData.books_accessed.push(bookId);
                        localStorage.setItem('kutivaUserData', JSON.stringify(userData));
                    }
                }
            } catch (error) {
                console.warn('Erro ao registrar acesso ao livro:', error);
            }
        }

        async downloadBook(bookId) {
            if (!window.kutivaAuth || !window.kutivaAuth.isLoggedIn()) {
                throw new Error('LOGIN_REQUIRED');
            }

            const book = await this.getBook(bookId);

            // Simular download criando um blob
            const bookContent = `
                Livro: ${book.title}
                Autor: ${book.author}
                Disciplina: ${book.subject_name}
                Classe: ${book.grade_name}

                ${book.content_preview}

                [Conteúdo completo do livro estaria aqui]
            `;

            const blob = new Blob([bookContent], { type: 'text/plain' });
            return blob;
        }

        canAccessBook() {
            return window.kutivaAuth && window.kutivaAuth.isLoggedIn();
        }

        getUserWatermarkData() {
            const user = window.kutivaAuth?.getCurrentUser();
            if (!user) return null;

            return {
                name: user.displayName || 'Usuário',
                email: user.email,
                timestamp: new Date().toLocaleString()
            };
        }
    }

    // Inicializar API
    function initKutivaAPI() {
        window.kutivaAPI = new KutivaAPI();
        console.log('🔌 API Kutiva inicializada com dados simulados');
    }

    // Inicializar quando documento carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKutivaAPI);
    } else {
        initKutivaAPI();
    }

})();