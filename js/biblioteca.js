
// Configuração da API Kutiva
const firebaseConfig = {
    apiKey: "AIzaSyAgpwyV-nXP7U0MkLZSb7JsBx0TnDVkMz8",
    authDomain: "kutiva-82dfe.firebaseapp.com",
    projectId: "kutiva-82dfe",
    storageBucket: "kutiva-82dfe.appspot.com",
    messagingSenderId: "295430131853",
    appId: "1:295430131853:android:6b0a2b3c4d5e6f7a8b9c0d",
    measurementId: "G-1234567890"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Elementos da página
const booksGrid = document.getElementById('books-grid');
const resultsCount = document.getElementById('results-count');
const searchInput = document.getElementById('search-input');
const gradeFilter = document.getElementById('grade-filter');
const subjectFilter = document.getElementById('subject-filter');

// Estado da aplicação
let currentUser = null;
let allBooks = [];
let allGrades = [];
let allSubjects = [];

// Verificar autenticação
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await loadUserData();
        await initializeApp();
    } else {
        window.location.href = 'login.html';
    }
});

// Carregar dados do usuário
async function loadUserData() {
    try {
        const savedUser = localStorage.getItem('kutivaUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            updateUserInterface(userData);
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

// Atualizar interface do usuário
function updateUserInterface(userData) {
    const userNameElements = document.querySelectorAll('.user-name');
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    
    userNameElements.forEach(element => {
        element.textContent = userData.displayName || userData.email.split('@')[0];
    });
    
    userAvatarElements.forEach(element => {
        if (userData.photoURL) {
            element.src = userData.photoURL;
        }
    });
}

// Inicializar aplicação
async function initializeApp() {
    try {
        showLoading(true);
        
        // Carregar dados da API Kutiva
        await Promise.all([
            loadGrades(),
            loadSubjects(),
            loadBooks()
        ]);
        
        // Configurar filtros
        setupFilters();
        
        // Configurar busca
        setupSearch();
        
        // Renderizar livros
        renderBooks(allBooks);
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showError('Erro ao carregar dados. Verifique sua conexão.');
    }
}

// Carregar classes da API
async function loadGrades() {
    try {
        allGrades = await window.kutivaAPI.getGrades();
        populateGradeFilter();
    } catch (error) {
        console.error('Erro ao carregar classes:', error);
    }
}

// Carregar disciplinas da API
async function loadSubjects() {
    try {
        allSubjects = await window.kutivaAPI.getSubjects();
        populateSubjectFilter();
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
    }
}

// Carregar livros da API
async function loadBooks() {
    try {
        allBooks = await window.kutivaAPI.getBooks();
        updateResultsCount(allBooks.length);
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        allBooks = [];
    }
}

// Popular filtro de classes
function populateGradeFilter() {
    const gradeSelect = document.getElementById('grade-filter');
    if (!gradeSelect) return;
    
    gradeSelect.innerHTML = '<option value="">Todas as Classes</option>';
    
    allGrades.forEach(grade => {
        const option = document.createElement('option');
        option.value = grade.id;
        option.textContent = grade.name || `${grade.id}ª Classe`;
        gradeSelect.appendChild(option);
    });
}

// Popular filtro de disciplinas
function populateSubjectFilter() {
    const subjectSelect = document.getElementById('subject-filter');
    if (!subjectSelect) return;
    
    subjectSelect.innerHTML = '<option value="">Todas as Disciplinas</option>';
    
    allSubjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = subject.name;
        subjectSelect.appendChild(option);
    });
}

// Configurar filtros
function setupFilters() {
    const gradeFilter = document.getElementById('grade-filter');
    const subjectFilter = document.getElementById('subject-filter');
    
    if (gradeFilter) {
        gradeFilter.addEventListener('change', applyFilters);
    }
    
    if (subjectFilter) {
        subjectFilter.addEventListener('change', applyFilters);
    }
}

// Configurar busca
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
}

// Aplicar filtros
async function applyFilters() {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const selectedGrade = gradeFilter?.value || '';
    const selectedSubject = subjectFilter?.value || '';
    
    let filteredBooks = allBooks;
    
    // Aplicar filtros específicos da API se necessário
    if (selectedGrade && selectedSubject) {
        try {
            filteredBooks = await window.kutivaAPI.getGradeSubjectBooks(selectedGrade, selectedSubject);
        } catch (error) {
            console.error('Erro ao buscar livros específicos:', error);
        }
    } else if (selectedSubject) {
        try {
            filteredBooks = await window.kutivaAPI.getSubjectBooks(selectedSubject);
        } catch (error) {
            console.error('Erro ao buscar livros da disciplina:', error);
        }
    } else if (selectedGrade) {
        try {
            const gradeSubjects = await window.kutivaAPI.getGradeSubjects(selectedGrade);
            const booksPromises = gradeSubjects.map(subject => 
                window.kutivaAPI.getSubjectBooks(subject.id)
            );
            const booksArrays = await Promise.all(booksPromises);
            filteredBooks = booksArrays.flat();
        } catch (error) {
            console.error('Erro ao buscar livros da classe:', error);
        }
    }
    
    // Aplicar busca por texto
    if (searchTerm) {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderBooks(filteredBooks);
    updateResultsCount(filteredBooks.length);
}

// Renderizar livros
function renderBooks(books) {
    if (!booksGrid) return;
    
    if (books.length === 0) {
        booksGrid.innerHTML = `
            <div class="no-books">
                <i class="fas fa-book"></i>
                <h3>Nenhum livro encontrado</h3>
                <p>Tente ajustar seus filtros ou termos de busca</p>
            </div>
        `;
        return;
    }
    
    booksGrid.innerHTML = books.map(book => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover_url || '/icon/book.png'}" alt="${book.title}" loading="lazy">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-description">${book.description || 'Sem descrição disponível'}</p>
                <div class="book-actions">
                    <button class="btn-primary" onclick="openBook(${book.id})">
                        <i class="fas fa-book-open"></i> Abrir
                    </button>
                    <button class="btn-secondary" onclick="downloadBook(${book.id})">
                        <i class="fas fa-download"></i> Baixar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Atualizar contador de resultados
function updateResultsCount(count) {
    if (resultsCount) {
        resultsCount.textContent = `${count} livro${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
}

// Abrir livro
function openBook(bookId) {
    window.location.href = `reader.html?book=${bookId}`;
}

// Baixar livro
async function downloadBook(bookId) {
    try {
        const book = await window.kutivaAPI.getBook(bookId);
        if (book.download_url) {
            const link = document.createElement('a');
            link.href = book.download_url;
            link.download = `${book.title}.pdf`;
            link.click();
        } else {
            alert('Download não disponível para este livro');
        }
    } catch (error) {
        console.error('Erro ao baixar livro:', error);
        alert('Erro ao baixar livro. Tente novamente.');
    }
}

// Utilitários
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Logout
function logout() {
    auth.signOut().then(() => {
        localStorage.removeItem('kutivaUser');
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Erro ao fazer logout:', error);
    });
}

// Verificar se está offline
window.addEventListener('offline', () => {
    showError('Você está offline. Algumas funcionalidades podem não funcionar.');
});

window.addEventListener('online', () => {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
});
