// Sistema de gerenciamento da plataforma Kutiva
class KutivaApp {
    constructor() {
        this.currentUser = this.loadUserData();
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.updateUserInterface();
        this.startAnimations();
        this.loadSoundEffects();
    }

    // Gestão de dados do usuário
    loadUserData() {
        const savedUser = localStorage.getItem('kutivaUser');
        return savedUser ? JSON.parse(savedUser) : {
            name: 'Aluno',
            level: 1,
            points: 0,
            achievements: []
        };
    }

    saveUserData() {
        localStorage.setItem('kutivaUser', JSON.stringify(this.currentUser));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('kutivaProgress');
        return savedProgress ? JSON.parse(savedProgress) : {
            'portugues': 75,
            'matematica': 60,
            'ciencias-naturais': 45,
            'ciencias-sociais': 55,
            'educacao-visual': 80,
            'educacao-fisica': 70
        };
    }

    saveProgress() {
        localStorage.setItem('kutivaProgress', JSON.stringify(this.progress));
    }

    updateUserInterface() {
        document.getElementById('username').textContent = this.currentUser.name;
        this.updateProgressBars();
    }

    updateProgressBars() {
        Object.keys(this.progress).forEach(subject => {
            const progressBar = document.querySelector(`[data-subject="${subject}"]`);
            const progressText = progressBar?.parentElement.nextElementSibling;
            if (progressBar) {
                progressBar.style.width = this.progress[subject] + '%';
                if (progressText) {
                    progressText.textContent = this.progress[subject] + '% Concluído';
                }
            }
        });
    }

    startAnimations() {
        // Animação de entrada dos cards
        const cards = document.querySelectorAll('.discipline-card, .book-card, .game-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    loadSoundEffects() {
        this.sounds = {
            click: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUaCSd+z+/afzEEKGG8zJ2ILgkt'),
            success: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUaCSd+z+/afzEEKGG8zJ2ILgkt'),
            error: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUaCSd+z+/afzEEKGG8zJ2ILgkt')
        };
    }

    playSound(type) {
        if (this.sounds[type]) {
            this.sounds[type].currentTime = 0;
            this.sounds[type].play().catch(() => {});
        }
    }
}

// Instância global da aplicação
const kutiva = new KutivaApp();

// Funções de navegação
function goBack() {
    kutiva.playSound('click');
    // Simular navegação de volta
    console.log('Voltando para página anterior...');
    // window.history.back();
}

function toggleUserMenu() {
    kutiva.playSound('click');
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function closeMenu(e) {
        if (!e.target.closest('.user-menu') && !e.target.closest('.user-dropdown')) {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeMenu);
        }
    });
}

function editProfile() {
    kutiva.playSound('click');
    const newName = prompt('Digite seu nome:', kutiva.currentUser.name);
    if (newName && newName.trim()) {
        kutiva.currentUser.name = newName.trim();
        kutiva.saveUserData();
        kutiva.updateUserInterface();
        alert('Perfil atualizado com sucesso! 🎉');
    }
    document.getElementById('userDropdown').classList.remove('active');
}

function viewProgress() {
    kutiva.playSound('click');
    let progressText = 'Seu Progresso:\n\n';
    const subjects = {
        'portugues': 'Português',
        'matematica': 'Matemática',
        'ciencias-naturais': 'Ciências Naturais',
        'ciencias-sociais': 'Ciências Sociais',
        'educacao-visual': 'Educação Visual',
        'educacao-fisica': 'Educação Física'
    };
    
    Object.keys(subjects).forEach(key => {
        progressText += `${subjects[key]}: ${kutiva.progress[key]}%\n`;
    });
    
    const totalProgress = Object.values(kutiva.progress).reduce((a, b) => a + b, 0) / Object.keys(kutiva.progress).length;
    progressText += `\nProgresso Total: ${Math.round(totalProgress)}%`;
    
    alert(progressText);
    document.getElementById('userDropdown').classList.remove('active');
}

function logout() {
    kutiva.playSound('click');
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.clear();
        alert('Até logo! 👋');
        location.reload();
    }
    document.getElementById('userDropdown').classList.remove('active');
}

// Funções das disciplinas
function openDiscipline(subject) {
    kutiva.playSound('click');
    
    const disciplineContent = {
        'portugues': {
            title: 'Português',
            content: `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: var(--primary-color); margin-bottom: 2rem;">📚 Língua Portuguesa</h2>
                    <div style="display: grid; gap: 1rem; max-width: 500px; margin: 0 auto;">
                        <button onclick="startLesson('portugues', 'gramatica')" style="padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            📝 Gramática
                        </button>
                        <button onclick="startLesson('portugues', 'leitura')" style="padding: 1rem; background: var(--secondary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            📖 Leitura
                        </button>
                        <button onclick="startLesson('portugues', 'escrita')" style="padding: 1rem; background: var(--accent-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            ✍️ Escrita
                        </button>
                        <button onclick="startLesson('portugues', 'vocabulario')" style="padding: 1rem; background: var(--success-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🔤 Vocabulário
                        </button>
                    </div>
                </div>
            `
        },
        'matematica': {
            title: 'Matemática',
            content: `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: var(--primary-color); margin-bottom: 2rem;">🔢 Matemática</h2>
                    <div style="display: grid; gap: 1rem; max-width: 500px; margin: 0 auto;">
                        <button onclick="startLesson('matematica', 'operacoes')" style="padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            ➕ Operações Básicas
                        </button>
                        <button onclick="startLesson('matematica', 'geometria')" style="padding: 1rem; background: var(--secondary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            📐 Geometria
                        </button>
                        <button onclick="startLesson('matematica', 'problemas')" style="padding: 1rem; background: var(--accent-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🧩 Resolução de Problemas
                        </button>
                        <button onclick="startLesson('matematica', 'medidas')" style="padding: 1rem; background: var(--success-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            📏 Medidas
                        </button>
                    </div>
                </div>
            `
        },
        'ciencias-naturais': {
            title: 'Ciências Naturais',
            content: `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: var(--primary-color); margin-bottom: 2rem;">🔬 Ciências Naturais</h2>
                    <div style="display: grid; gap: 1rem; max-width: 500px; margin: 0 auto;">
                        <button onclick="startLesson('ciencias-naturais', 'corpo-humano')" style="padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            👨‍⚕️ Corpo Humano
                        </button>
                        <button onclick="startLesson('ciencias-naturais', 'animais')" style="padding: 1rem; background: var(--secondary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🐘 Animais
                        </button>
                        <button onclick="startLesson('ciencias-naturais', 'plantas')" style="padding: 1rem; background: var(--accent-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🌱 Plantas
                        </button>
                        <button onclick="startLesson('ciencias-naturais', 'meio-ambiente')" style="padding: 1rem; background: var(--success-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🌍 Meio Ambiente
                        </button>
                    </div>
                </div>
            `
        },
        'ciencias-sociais': {
            title: 'Ciências Sociais',
            content: `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: var(--primary-color); margin-bottom: 2rem;">🗺️ Ciências Sociais</h2>
                    <div style="display: grid; gap: 1rem; max-width: 500px; margin: 0 auto;">
                        <button onclick="startLesson('ciencias-sociais', 'geografia')" style="padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🗺️ Geografia de Moçambique
                        </button>
                        <button onclick="startLesson('ciencias-sociais', 'historia')" style="padding: 1rem; background: var(--secondary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            📜 História de Moçambique
                        </button>
                        <button onclick="startLesson('ciencias-sociais', 'cultura')" style="padding: 1rem; background: var(--accent-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🎭 Cultura Moçambicana
                        </button>
                        <button onclick="startLesson('ciencias-sociais', 'cidadania')" style="padding: 1rem; background: var(--success-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🤝 Cidadania
                        </button>
                    </div>
                </div>
            `
        },
        'educacao-visual': {
            title: 'Educação Visual',
            content: `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: var(--primary-color); margin-bottom: 2rem;">🎨 Educação Visual</h2>
                    <div style="display: grid; gap: 1rem; max-width: 500px; margin: 0 auto;">
                        <button onclick="startLesson('educacao-visual', 'desenho')" style="padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            ✏️ Desenho
                        </button>
                        <button onclick="startLesson('educacao-visual', 'pintura')" style="padding: 1rem; background: var(--secondary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🖌️ Pintura
                        </button>
                        <button onclick="startLesson('educacao-visual', 'artesanato')" style="padding: 1rem; background: var(--accent-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🧶 Artesanato
                        </button>
                        <button onclick="startLesson('educacao-visual', 'arte-africana')" style="padding: 1rem; background: var(--success-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🎭 Arte Africana
                        </button>
                    </div>
                </div>
            `
        },
        'educacao-fisica': {
            title: 'Educação Física',
            content: `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: var(--primary-color); margin-bottom: 2rem;">⚽ Educação Física</h2>
                    <div style="display: grid; gap: 1rem; max-width: 500px; margin: 0 auto;">
                        <button onclick="startLesson('educacao-fisica', 'futebol')" style="padding: 1rem; background: var(--primary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            ⚽ Futebol
                        </button>
                        <button onclick="startLesson('educacao-fisica', 'atletismo')" style="padding: 1rem; background: var(--secondary-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🏃‍♂️ Atletismo
                        </button>
                        <button onclick="startLesson('educacao-fisica', 'jogos-tradicionais')" style="padding: 1rem; background: var(--accent-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            🎯 Jogos Tradicionais
                        </button>
                        <button onclick="startLesson('educacao-fisica', 'saude')" style="padding: 1rem; background: var(--success-color); color: white; border: none; border-radius: 15px; font-size: 1.1rem; cursor: pointer;">
                            💪 Saúde e Bem-estar
                        </button>
                    </div>
                </div>
            `
        }
    };

    const discipline = disciplineContent[subject];
    if (discipline) {
        showModal(discipline.title, discipline.content);
    }
}

function startLesson(subject, topic) {
    kutiva.playSound('click');
    
    // Simulação de uma lição
    const lessons = {
        'portugues': {
            'gramatica': 'Vamos aprender sobre substantivos, adjetivos e verbos! 📝',
            'leitura': 'Hora de ler uma história moçambicana! 📖',
            'escrita': 'Vamos escrever uma composição sobre Moçambique! ✍️',
            'vocabulario': 'Aprender novas palavras em português! 🔤'
        },
        'matematica': {
            'operacoes': 'Vamos praticar somas, subtrações, multiplicações e divisões! ➕',
            'geometria': 'Descobrir formas geométricas ao nosso redor! 📐',
            'problemas': 'Resolver problemas matemáticos do dia a dia! 🧩',
            'medidas': 'Aprender sobre metros, quilos e litros! 📏'
        },
        'ciencias-naturais': {
            'corpo-humano': 'Explorar como funciona o nosso corpo! 👨‍⚕️',
            'animais': 'Conhecer os animais de Moçambique! 🐘',
            'plantas': 'Descobrir o mundo das plantas! 🌱',
            'meio-ambiente': 'Proteger a natureza moçambicana! 🌍'
        },
        'ciencias-sociais': {
            'geografia': 'Explorar as províncias de Moçambique! 🗺️',
            'historia': 'Conhecer a história do nosso país! 📜',
            'cultura': 'Celebrar as tradições moçambicanas! 🎭',
            'cidadania': 'Ser um bom cidadão moçambicano! 🤝'
        },
        'educacao-visual': {
            'desenho': 'Criar desenhos incríveis! ✏️',
            'pintura': 'Pintar com cores vibrantes! 🖌️',
            'artesanato': 'Fazer artesanato tradicional! 🧶',
            'arte-africana': 'Descobrir a arte africana! 🎭'
        },
        'educacao-fisica': {
            'futebol': 'Aprender técnicas de futebol! ⚽',
            'atletismo': 'Correr, saltar e arremessar! 🏃‍♂️',
            'jogos-tradicionais': 'Jogar jogos tradicionais moçambicanos! 🎯',
            'saude': 'Cuidar da nossa saúde! 💪'
        }
    };

    const lesson = lessons[subject]?.[topic];
    if (lesson) {
        // Incrementar progresso
        if (kutiva.progress[subject] < 100) {
            kutiva.progress[subject] = Math.min(100, kutiva.progress[subject] + 5);
            kutiva.saveProgress();
            kutiva.updateProgressBars();
        }
        
        alert(`🎉 Lição iniciada!\n\n${lesson}\n\nSeu progresso em ${subject} aumentou!`);
        closeGame();
    }
}

// Funções dos livros
function openBook(bookId) {
    kutiva.playSound('click');
    
    const books = {
        'geografia-mocambique': {
            title: 'Geografia de Moçambique',
            content: `
                <div style="padding: 2rem; text-align: left;">
                    <h2 style="color: var(--primary-color); margin-bottom: 1rem;">🗺️ Geografia de Moçambique</h2>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem;">
                        Moçambique é um país localizado na costa oriental da África. O nosso belo país tem 11 províncias:
                    </p>
                    <ul style="font-size: 1rem; line-height: 1.8; margin-left: 2rem;">
                        <li>Maputo (Cidade Capital)</li>
                        <li>Maputo Província</li>
                        <li>Gaza</li>
                        <li>Inhambane</li>
                        <li>Sofala</li>
                        <li>Manica</li>
                        <li>Tete</li>
                        <li>Zambézia</li>
                        <li>Nampula</li>
                        <li>Cabo Delgado</li>
                        <li>Niassa</li>
                    </ul>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-top: 1rem;">
                        O nosso país é banhado pelo Oceano Índico e tem fronteiras com África do Sul, Esuatíni, Zimbabué, Zâmbia, Malawi e Tanzânia.
                    </p>
                </div>
            `
        },
        'historia-mocambique': {
            title: 'História de Moçambique',
            content: `
                <div style="padding: 2rem; text-align: left;">
                    <h2 style="color: var(--primary-color); margin-bottom: 1rem;">📜 História de Moçambique</h2>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem;">
                        A história de Moçambique é rica e fascinante! Vamos conhecer alguns momentos importantes:
                    </p>
                    <ul style="font-size: 1rem; line-height: 1.8; margin-left: 2rem;">
                        <li><strong>1975:</strong> Independência de Moçambique</li>
                        <li><strong>Samora Machel:</strong> Primeiro Presidente de Moçambique</li>
                        <li><strong>Língua Oficial:</strong> Português</li>
                        <li><strong>Culturas Locais:</strong> Mais de 20 grupos étnicos</li>
                        <li><strong>Tradições:</strong> Música, dança e artesanato únicos</li>
                    </ul>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-top: 1rem;">
                        Moçambique é um país jovem com uma cultura muito rica e diversa!
                    </p>
                </div>
            `
        },
        'ciencias-divertidas': {
            title: 'Ciências Divertidas',
            content: `
                <div style="padding: 2rem; text-align: left;">
                    <h2 style="color: var(--primary-color); margin-bottom: 1rem;">🔬 Ciências Divertidas</h2>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem;">
                        A ciência está em todo o lado! Vamos descobrir alguns factos interessantes:
                    </p>
                    <ul style="font-size: 1rem; line-height: 1.8; margin-left: 2rem;">
                        <li>🌱 As plantas precisam de água, luz e ar para crescer</li>
                        <li>🐘 Os elefantes são os maiores mamíferos terrestres</li>
                        <li>💧 A água pode estar em três estados: sólido, líquido e gasoso</li>
                        <li>🌍 A Terra gira ao redor do Sol</li>
                        <li>🦴 O corpo humano tem 206 ossos</li>
                    </ul>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-top: 1rem;">
                        A ciência ajuda-nos a compreender o mundo ao nosso redor!
                    </p>
                </div>
            `
        },
        'matematica-pratica': {
            title: 'Matemática Prática',
            content: `
                <div style="padding: 2rem; text-align: left;">
                    <h2 style="color: var(--primary-color); margin-bottom: 1rem;">🔢 Matemática Prática</h2>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem;">
                        A matemática está presente no nosso dia a dia! Vejamos alguns exemplos:
                    </p>
                    <ul style="font-size: 1rem; line-height: 1.8; margin-left: 2rem;">
                        <li>🛒 Contar dinheiro nas compras</li>
                        <li>⏰ Ler as horas no relógio</li>
                        <li>📏 Medir distâncias e alturas</li>
                        <li>🍰 Dividir um bolo em partes iguais</li>
                        <li>📊 Contar objectos e pessoas</li>
                    </ul>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-top: 1rem;">
                        A matemática torna-nos mais inteligentes e ajuda a resolver problemas!
                    </p>
                </div>
            `
        }
    };

    const book = books[bookId];
    if (book) {
        showModal(book.title, book.content);
    }
}

// Funções dos jogos
function openGame(gameId) {
    kutiva.playSound('click');
    
    const games = {
        'caca-palavras': {
            title: 'Caça-Palavras',
            content: createWordSearchGame()
        },
        'quiz-matematica': {
            title: 'Quiz de Matemática',
            content: createMathQuiz()
        },
        'mapa-mocambique': {
            title: 'Mapa de Moçambique',
            content: createMapGame()
        },
        'desenho-livre': {
            title: 'Desenho Livre',
            content: createDrawingGame()
        }
    };

    const game = games[gameId];
    if (game) {
        showModal(game.title, game.content);
    }
}

function createWordSearchGame() {
    return `
        <div style="text-align: center; padding: 1rem;">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🔍 Encontre as palavras escondidas!</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <p><strong>Palavras para encontrar:</strong></p>
                <p>MOÇAMBIQUE • ESCOLA • LIVRO • AMIGO • FAMÍLIA</p>
            </div>
            <div id="wordSearchGrid" style="font-family: monospace; font-size: 1.2rem; line-height: 1.5; background: white; padding: 1rem; border-radius: 10px; display: inline-block;">
                M O Ç A M B I Q U E<br>
                E S C O L A X Y Z W<br>
                L I V R O Q M N B V<br>
                A M I G O C X S D F<br>
                F A M Í L I A G H J<br>
                K L P O I U Y T R E<br>
            </div>
            <div style="margin-top: 1rem;">
                <button onclick="alert('Parabéns! Encontrou todas as palavras! 🎉')" style="padding: 0.8rem 2rem; background: var(--primary-color); color: white; border: none; border-radius: 10px; cursor: pointer;">
                    Verificar Respostas
                </button>
            </div>
        </div>
    `;
}

function createMathQuiz() {
    const questions = [
        { question: "5 + 3 = ?", options: ["6", "7", "8", "9"], correct: 2 },
        { question: "10 - 4 = ?", options: ["5", "6", "7", "8"], correct: 1 },
        { question: "3 × 4 = ?", options: ["10", "11", "12", "13"], correct: 2 },
        { question: "15 ÷ 3 = ?", options: ["4", "5", "6", "7"], correct: 1 }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    return `
        <div id="mathQuiz" style="text-align: center; padding: 1rem;">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🧮 Quiz de Matemática</h3>
            <div id="questionContainer">
                <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                    <h4 style="font-size: 1.5rem; margin-bottom: 1rem;" id="questionText">${questions[0].question}</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 300px; margin: 0 auto;">
                        ${questions[0].options.map((option, index) => 
                            `<button onclick="checkAnswer(${index}, 0)" style="padding: 1rem; background: var(--accent-color); color: white; border: none; border-radius: 10px; cursor: pointer;">${option}</button>`
                        ).join('')}
                    </div>
                </div>
                <p>Pergunta 1 de ${questions.length}</p>
            </div>
        </div>
    `;
}

function createMapGame() {
    return `
        <div style="text-align: center; padding: 1rem;">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🗺️ Províncias de Moçambique</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <p><strong>Clique na província correta:</strong></p>
                <p style="font-size: 1.2rem; color: var(--primary-color); font-weight: bold;">Onde fica MAPUTO?</p>
            </div>
            <div style="background: white; padding: 1rem; border-radius: 10px; display: inline-block;">
                <svg width="300" height="400" viewBox="0 0 300 400">
                    <!-- Mapa simplificado de Moçambique -->
                    <rect x="50" y="350" width="60" height="40" fill="var(--primary-color)" onclick="alert('Correto! Maputo fica no sul! 🎉')" style="cursor: pointer;"/>
                    <rect x="70" y="300" width="80" height="50" fill="var(--secondary-color)" onclick="alert('Tente novamente! 🤔')" style="cursor: pointer;"/>
                    <rect x="60" y="250" width="90" height="50" fill="var(--accent-color)" onclick="alert('Tente novamente! 🤔')" style="cursor: pointer;"/>
                    <rect x="80" y="200" width="70" height="50" fill="var(--success-color)" onclick="alert('Tente novamente! 🤔')" style="cursor: pointer;"/>
                    <rect x="90" y="150" width="80" height="50" fill="var(--warning-color)" onclick="alert('Tente novamente! 🤔')" style="cursor: pointer;"/>
                    <rect x="100" y="100" width="90" height="50" fill="var(--purple-color)" onclick="alert('Tente novamente! 🤔')" style="cursor: pointer;"/>
                    <rect x="110" y="50" width="80" height="50" fill="var(--pink-color)" onclick="alert('Tente novamente! 🤔')" style="cursor: pointer;"/>
                    <text x="80" y="375" fill="white" font-size="12" font-weight="bold">MAPUTO</text>
                </svg>
            </div>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">
                Clique nas diferentes regiões para encontrar Maputo!
            </p>
        </div>
    `;
}

function createDrawingGame() {
    return `
        <div style="text-align: center; padding: 1rem;">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🎨 Desenho Livre</h3>
            <div style="background: white; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
                <canvas id="drawingCanvas" width="400" height="300" style="border: 2px solid var(--primary-color); border-radius: 10px; cursor: crosshair;"></canvas>
            </div>
            <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                <button onclick="changeColor('red')" style="background: red; width: 30px; height: 30px; border: none; border-radius: 50%; cursor: pointer;"></button>
                <button onclick="changeColor('blue')" style="background: blue; width: 30px; height: 30px; border: none; border-radius: 50%; cursor: pointer;"></button>
                <button onclick="changeColor('green')" style="background: green; width: 30px; height: 30px; border: none; border-radius: 50%; cursor: pointer;"></button>
                <button onclick="changeColor('yellow')" style="background: yellow; width: 30px; height: 30px; border: none; border-radius: 50%; cursor: pointer;"></button>
                <button onclick="changeColor('purple')" style="background: purple; width: 30px; height: 30px; border: none; border-radius: 50%; cursor: pointer;"></button>
            </div>
            <button onclick="clearCanvas()" style="padding: 0.5rem 1rem; background: var(--text-light); color: white; border: none; border-radius: 10px; cursor: pointer;">
                🗑️ Limpar
            </button>
            <script>
                setTimeout(() => {
                    const canvas = document.getElementById('drawingCanvas');
                    const ctx = canvas.getContext('2d');
                    let isDrawing = false;
                    let currentColor = 'black';
                    
                    canvas.addEventListener('mousedown', startDrawing);
                    canvas.addEventListener('mousemove', draw);
                    canvas.addEventListener('mouseup', stopDrawing);
                    
                    function startDrawing(e) {
                        isDrawing = true;
                        const rect = canvas.getBoundingClientRect();
                        ctx.beginPath();
                        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                    }
                    
                    function draw(e) {
                        if (!isDrawing) return;
                        const rect = canvas.getBoundingClientRect();
                        ctx.lineWidth = 3;
                        ctx.lineCap = 'round';
                        ctx.strokeStyle = currentColor;
                        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                    }
                    
                    function stopDrawing() {
                        isDrawing = false;
                        ctx.beginPath();
                    }
                    
                    window.changeColor = function(color) {
                        currentColor = color;
                    }
                    
                    window.clearCanvas = function() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                }, 100);
            </script>
        </div>
    `;
}

function checkAnswer(selectedOption, questionIndex) {
    kutiva.playSound('click');
    // Lógica simplificada para o quiz
    if (selectedOption === 2 || selectedOption === 1) { // Respostas corretas para as primeiras perguntas
        kutiva.playSound('success');
        alert('Correto! Muito bem! 🎉');
        if (kutiva.progress.matematica < 100) {
            kutiva.progress.matematica += 3;
            kutiva.saveProgress();
            kutiva.updateProgressBars();
        }
    } else {
        kutiva.playSound('error');
        alert('Tente novamente! 🤔');
    }
}

// Função para mostrar modal
function showModal(title, content) {
    const modal = document.getElementById('gameModal');
    const titleElement = document.getElementById('gameTitle');
    const contentElement = document.getElementById('gameContent');
    
    titleElement.textContent = title;
    contentElement.innerHTML = content;
    modal.style.display = 'block';
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGame();
        }
    });
}

function closeGame() {
    kutiva.playSound('click');
    document.getElementById('gameModal').style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar efeito de clique aos cards
    const cards = document.querySelectorAll('.discipline-card, .book-card, .game-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Adicionar efeito de digitação ao banner
    const bannerTitle = document.querySelector('.banner-content h2');
    if (bannerTitle) {
        const text = bannerTitle.textContent;
        bannerTitle.textContent = '';
        let i = 0;
        
        const typeEffect = setInterval(() => {
            bannerTitle.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(typeEffect);
            }
        }, 100);
    }
});

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGame();
        document.getElementById('userDropdown').classList.remove('active');
    }
});

// Guardar dados antes de sair da página
window.addEventListener('beforeunload', function() {
    kutiva.saveUserData();
    kutiva.saveProgress();
});

console.log('🎉 Kutiva carregado com sucesso! Bem-vindos à aprendizagem divertida!');