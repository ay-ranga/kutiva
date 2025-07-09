// JavaScript para funcionalidade da plataforma educativa

// Variáveis globais
let currentStoryPage = 0;
let currentGameScore = 0;
let currentAlphabetType = 'print';
let currentPracticeLetter = 'A';
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Sistema de Progresso e Conquistas
let userProgress = {
    alphabet: {
        completed: 0,
        total: 26,
        progress: 0
    },
    numbers: {
        completed: 0,
        total: 21,
        progress: 0
    },
    clock: {
        completed: 0,
        total: 10,
        progress: 0
    },
    calendar: {
        completed: 0,
        total: 12,
        progress: 0
    },
    math: {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0,
        progress: 0
    },
    shapes: {
        completed: 0,
        total: 20,
        progress: 0
    },
    games: {
        puzzle: 0,
        stars: 0,
        memory: 0,
        colors: 0,
        total: 0
    },
    stories: {
        read: [],
        total: 6,
        progress: 0
    },
    achievements: [],
    totalScore: 0,
    level: 1,
    streakDays: 0,
    lastActive: null
};

// Conquistas disponíveis
const achievements = [
    {
        id: 'first_letter',
        name: 'Primeira Letra',
        description: 'Aprendeste a tua primeira letra!',
        icon: '🔤',
        condition: () => userProgress.alphabet.completed >= 1
    },
    {
        id: 'alphabet_master',
        name: 'Mestre do Alfabeto',
        description: 'Completaste todo o alfabeto!',
        icon: '📝',
        condition: () => userProgress.alphabet.completed >= 26
    },
    {
        id: 'number_explorer',
        name: 'Explorador de Números',
        description: 'Aprendeste os números até 10!',
        icon: '🔢',
        condition: () => userProgress.numbers.completed >= 11
    },
    {
        id: 'math_genius',
        name: 'Génio da Matemática',
        description: 'Resolveste 50 problemas de matemática!',
        icon: '🧮',
        condition: () => userProgress.math.total >= 50
    },
    {
        id: 'time_keeper',
        name: 'Guardião do Tempo',
        description: 'Aprendeste a ler as horas!',
        icon: '⏰',
        condition: () => userProgress.clock.completed >= 5
    },
    {
        id: 'story_lover',
        name: 'Amante de Histórias',
        description: 'Leste todas as histórias!',
        icon: '📚',
        condition: () => userProgress.stories.read.length >= 6
    },
    {
        id: 'game_champion',
        name: 'Campeão dos Jogos',
        description: 'Ganhaste 100 pontos em jogos!',
        icon: '🏆',
        condition: () => userProgress.games.total >= 100
    },
    {
        id: 'daily_learner',
        name: 'Aprendiz Diário',
        description: 'Aprendeste durante 7 dias seguidos!',
        icon: '📅',
        condition: () => userProgress.streakDays >= 7
    },
    {
        id: 'shape_detective',
        name: 'Detetive de Formas',
        description: 'Identificaste 20 formas corretamente!',
        icon: '🔍',
        condition: () => userProgress.shapes.completed >= 20
    },
    {
        id: 'level_up',
        name: 'Subida de Nível',
        description: 'Chegaste ao nível 5!',
        icon: '⭐',
        condition: () => userProgress.level >= 5
    }
];

// Carregar progresso do localStorage
function loadProgress() {
    const saved = localStorage.getItem('kutivaProgress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            userProgress = { ...userProgress, ...parsed };
            checkDailyStreak();
        } catch (e) {
            console.log('Erro ao carregar progresso, usando dados padrão');
        }
    }
    updateAllProgress();
}

// Guardar progresso no localStorage
function saveProgress() {
    userProgress.lastActive = new Date().toISOString();
    localStorage.setItem('kutivaProgress', JSON.stringify(userProgress));
}

// Verificar streak diário
function checkDailyStreak() {
    const today = new Date().toDateString();
    const lastActive = userProgress.lastActive ? new Date(userProgress.lastActive).toDateString() : null;
    
    if (lastActive === today) {
        // Já ativo hoje
        return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive === yesterday.toDateString()) {
        // Continua o streak
        userProgress.streakDays++;
    } else if (lastActive !== today) {
        // Quebrou o streak (a não ser que seja o primeiro dia)
        if (lastActive !== null) {
            userProgress.streakDays = 1;
        } else {
            userProgress.streakDays = 1;
        }
    }
}

// Atualizar progresso de uma categoria
function updateCategoryProgress(category, increment = 1) {
    if (!userProgress[category]) return;
    
    switch(category) {
        case 'alphabet':
            userProgress.alphabet.completed = Math.min(userProgress.alphabet.completed + increment, userProgress.alphabet.total);
            userProgress.alphabet.progress = Math.round((userProgress.alphabet.completed / userProgress.alphabet.total) * 100);
            break;
            
        case 'numbers':
            userProgress.numbers.completed = Math.min(userProgress.numbers.completed + increment, userProgress.numbers.total);
            userProgress.numbers.progress = Math.round((userProgress.numbers.completed / userProgress.numbers.total) * 100);
            break;
            
        case 'clock':
            userProgress.clock.completed = Math.min(userProgress.clock.completed + increment, userProgress.clock.total);
            userProgress.clock.progress = Math.round((userProgress.clock.completed / userProgress.clock.total) * 100);
            break;
            
        case 'calendar':
            userProgress.calendar.completed = Math.min(userProgress.calendar.completed + increment, userProgress.calendar.total);
            userProgress.calendar.progress = Math.round((userProgress.calendar.completed / userProgress.calendar.total) * 100);
            break;
            
        case 'shapes':
            userProgress.shapes.completed = Math.min(userProgress.shapes.completed + increment, userProgress.shapes.total);
            userProgress.shapes.progress = Math.round((userProgress.shapes.completed / userProgress.shapes.total) * 100);
            break;
    }
    
    // Atualizar pontuação total e nível
    updateTotalScore();
    updateLevel();
    checkAchievements();
    saveProgress();
    updateAllProgress();
}

// Atualizar progresso de matemática
function updateMathProgress(difficulty, points) {
    userProgress.math[difficulty] += points;
    userProgress.math.total += points;
    userProgress.math.progress = Math.min(Math.round(userProgress.math.total / 5), 100); // 5 pontos = 1%
    
    updateTotalScore();
    updateLevel();
    checkAchievements();
    saveProgress();
    updateAllProgress();
}

// Atualizar progresso de jogos
function updateGameProgress(gameType, points) {
    if (userProgress.games[gameType] !== undefined) {
        userProgress.games[gameType] += points;
        userProgress.games.total += points;
    }
    
    updateTotalScore();
    updateLevel();
    checkAchievements();
    saveProgress();
    updateAllProgress();
}

// Marcar história como lida
function markStoryAsRead(storyId) {
    if (!userProgress.stories.read.includes(storyId)) {
        userProgress.stories.read.push(storyId);
        userProgress.stories.progress = Math.round((userProgress.stories.read.length / userProgress.stories.total) * 100);
        
        updateTotalScore();
        updateLevel();
        checkAchievements();
        saveProgress();
        updateAllProgress();
    }
}

// Calcular pontuação total
function updateTotalScore() {
    userProgress.totalScore = 
        userProgress.alphabet.completed * 10 +
        userProgress.numbers.completed * 5 +
        userProgress.clock.completed * 15 +
        userProgress.calendar.completed * 12 +
        userProgress.math.total +
        userProgress.shapes.completed * 8 +
        userProgress.games.total +
        userProgress.stories.read.length * 25;
}

// Atualizar nível
function updateLevel() {
    const newLevel = Math.floor(userProgress.totalScore / 500) + 1; // 500 pontos por nível
    if (newLevel > userProgress.level) {
        userProgress.level = newLevel;
        showNotification(`Parabéns! Subiste para o nível ${newLevel}!`, 'success');
        vibrate([200, 100, 200, 100, 200]);
    }
}

// Verificar conquistas
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!userProgress.achievements.includes(achievement.id) && achievement.condition()) {
            userProgress.achievements.push(achievement.id);
            showAchievementNotification(achievement);
        }
    });
}

// Mostrar notificação de conquista
function showAchievementNotification(achievement) {
    showNotification(`🏆 Nova Conquista: ${achievement.name}!`, 'success');
    vibrate([100, 50, 100, 50, 100]);
    
    // Criar elemento visual especial para conquistas
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement-popup';
    achievementElement.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
        </div>
    `;
    
    achievementElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        border-radius: 15px;
        padding: 1rem;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(achievementElement);
    
    setTimeout(() => {
        achievementElement.remove();
    }, 5000);
}

// Controlo do menu do utilizador
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Fechar menu quando clicar fora
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (!userMenu.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Sistema de Modais
function openModal(title, content) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    modal.classList.add('show');
    
    // Fechar com ESC
    document.addEventListener('keydown', handleModalEscape);
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('show');
    document.removeEventListener('keydown', handleModalEscape);
}

function handleModalEscape(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeAlphabetModal();
    }
}

// Sistema de Alfabeto
function openAlphabet() {
    const modal = document.getElementById('alphabetModal');
    modal.classList.add('show');
    showAlphabetType('print');
    document.addEventListener('keydown', handleModalEscape);
}

function closeAlphabetModal() {
    const modal = document.getElementById('alphabetModal');
    modal.classList.remove('show');
    document.removeEventListener('keydown', handleModalEscape);
}

function showAlphabetType(type) {
    currentAlphabetType = type;
    
    // Atualizar botões de navegação
    document.querySelectorAll('.alphabet-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const alphabetContent = document.querySelector('.alphabet-content');
    
    switch(type) {
        case 'print':
            alphabetContent.innerHTML = generatePrintAlphabet();
            break;
        case 'cursive':
            alphabetContent.innerHTML = generateCursiveAlphabet();
            break;
        case 'practice':
            alphabetContent.innerHTML = generatePracticeArea();
            break;
    }
}

function generatePrintAlphabet() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letterNames = [
        'Á', 'Bê', 'Cê', 'Dê', 'É', 'Éfe', 'Gê', 'Agá', 'I', 'Jota',
        'Cápa', 'Éle', 'Éme', 'Éne', 'Ó', 'Pê', 'Quê', 'Érre', 'Ésse', 'Tê',
        'U', 'Vê', 'Dáblio', 'Xis', 'Ípsilon', 'Zê'
    ];
    
    let html = '<div class="alphabet-grid">';
    
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const lowercase = letter.toLowerCase();
        const name = letterNames[i];
        
        html += `
            <div class="letter-card" onclick="playLetterSound('${letter}')">
                <div class="letter-uppercase">${letter}</div>
                <div class="letter-lowercase">${lowercase}</div>
                <div class="letter-name">${name}</div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

function generateCursiveAlphabet() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letterNames = [
        'Á', 'Bê', 'Cê', 'Dê', 'É', 'Éfe', 'Gê', 'Agá', 'I', 'Jota',
        'Cápa', 'Éle', 'Éme', 'Éne', 'Ó', 'Pê', 'Quê', 'Érre', 'Ésse', 'Tê',
        'U', 'Vê', 'Dáblio', 'Xis', 'Ípsilon', 'Zê'
    ];
    
    let html = '<div class="alphabet-grid">';
    
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const lowercase = letter.toLowerCase();
        const name = letterNames[i];
        
        html += `
            <div class="letter-card" onclick="playLetterSound('${letter}')">
                <div class="letter-uppercase cursive">${letter}</div>
                <div class="letter-lowercase cursive">${lowercase}</div>
                <div class="letter-name">${name}</div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

function generatePracticeArea() {
    return `
        <div class="practice-area">
            <div class="practice-letter">
                <div class="practice-letter-display" id="practiceLetterDisplay">${currentPracticeLetter}</div>
                <p>Treina a escrever a letra <strong>${currentPracticeLetter}</strong></p>
            </div>
            
            <canvas id="practiceCanvas" class="practice-canvas" width="400" height="300"></canvas>
            
            <div class="practice-controls">
                <button class="practice-btn" onclick="clearCanvas()">
                    <i class="fas fa-eraser"></i> Limpar
                </button>
                <button class="practice-btn" onclick="previousLetter()">
                    <i class="fas fa-chevron-left"></i> Anterior
                </button>
                <button class="practice-btn" onclick="nextLetter()">
                    <i class="fas fa-chevron-right"></i> Próxima
                </button>
                <button class="practice-btn" onclick="playLetterSound(currentPracticeLetter)">
                    <i class="fas fa-volume-up"></i> Som
                </button>
            </div>
        </div>
    `;
}

function playLetterSound(letter) {
    // Adicionar animação visual
    const letterCards = document.querySelectorAll('.letter-card');
    letterCards.forEach(card => {
        if (card.textContent.includes(letter)) {
            card.classList.add('playing');
            setTimeout(() => card.classList.remove('playing'), 600);
        }
    });
    
    // Tracking de progresso - cada letra clicada conta como progresso
    updateCategoryProgress('alphabet', 0.5); // Meio ponto por interação
    
    // Feedback sonoro simulado
    showNotification(`Som da letra: ${letter}`, 'info');
    vibrate([100, 50, 100]);
}

function clearCanvas() {
    const canvas = document.getElementById('practiceCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function previousLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const currentIndex = alphabet.indexOf(currentPracticeLetter);
    if (currentIndex > 0) {
        currentPracticeLetter = alphabet[currentIndex - 1];
        document.getElementById('practiceLetterDisplay').textContent = currentPracticeLetter;
    }
}

function nextLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const currentIndex = alphabet.indexOf(currentPracticeLetter);
    if (currentIndex < alphabet.length - 1) {
        currentPracticeLetter = alphabet[currentIndex + 1];
        document.getElementById('practiceLetterDisplay').textContent = currentPracticeLetter;
    }
}

// Canvas para desenhar letras
function initializeCanvas() {
    const canvas = document.getElementById('practiceCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events para dispositivos móveis
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getMousePos(canvas, e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const [currentX, currentY] = getMousePos(canvas, e);
        
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        [lastX, lastY] = [currentX, currentY];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                        e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    function getMousePos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        return [
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
    }
}

// Função para voltar atrás
function goBack() {
    // Simular navegação para a página anterior ou página principal
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Redirecionar para página principal se não houver histórico
        window.location.href = '/';
    }
}

// Funções para abrir disciplinas
function openDiscipline(disciplineId) {
    console.log(`Abrindo disciplina: ${disciplineId}`);
    
    // Feedback visual
    showNotification(`A abrir ${getDisciplineName(disciplineId)}...`, 'success');
    
    // Simular navegação (substituir por lógica real)
    setTimeout(() => {
        // window.location.href = `/disciplina/${disciplineId}`;
        console.log(`Navegando para disciplina: ${disciplineId}`);
    }, 1000);
}

// Funções para abrir livros (agora com histórias interativas)
function openBook(bookId) {
    console.log(`Abrindo livro: ${bookId}`);
    
    // Feedback visual
    showNotification(`A abrir livro: ${getBookName(bookId)}...`, 'info');
    
    setTimeout(() => {
        const story = getStoryContent(bookId);
        openModal(story.title, generateStoryHTML(story));
        console.log(`Navegando para livro: ${bookId}`);
    }, 1000);
}

// Funções para abrir jogos (agora funcionais)
function openGame(gameId) {
    console.log(`Abrindo jogo: ${gameId}`);
    
    // Feedback visual
    showNotification(`A carregar jogo: ${getGameName(gameId)}...`, 'info');
    
    setTimeout(() => {
        const game = generateGameContent(gameId);
        openModal(game.title, game.content);
        
        // Inicializar jogo específico
        setTimeout(() => {
            initializeGame(gameId);
        }, 500);
        
        console.log(`Navegando para jogo: ${gameId}`);
    }, 1500);
}

// Sistema de Histórias
function getStoryContent(bookId) {
    const stories = {
        'animais': {
            title: 'Os Animais',
            pages: [
                {
                    image: '🦁',
                    text: 'Era uma vez, numa savana muito distante, vivia um leão muito corajoso chamado Leo. Leo era o rei de todos os animais!'
                },
                {
                    image: '🐘',
                    text: 'Um dia, Leo conheceu Ellie, uma elefanta muito simpática. Ellie tinha uma tromba muito comprida e orelhas enormes!'
                },
                {
                    image: '🦒',
                    text: 'Juntos, Leo e Ellie encontraram Gigi, uma girafa muito alta. Gigi conseguia ver tudo de cima das árvores!'
                },
                {
                    image: '🐵',
                    text: 'Os três amigos brincaram com Mico, um macaquinho muito esperto que saltava de árvore em árvore!'
                },
                {
                    image: '🌟',
                    text: 'E assim, todos os animais da savana se tornaram grandes amigos e viveram felizes para sempre!'
                }
            ]
        },
        'plantas': {
            title: 'As Plantas',
            pages: [
                {
                    image: '🌱',
                    text: 'Havia uma pequena semente chamada Simi que sonhava em crescer e se tornar uma árvore grande e forte!'
                },
                {
                    image: '☀️',
                    text: 'Todos os dias, o Sol brilhava e dava energia à pequena Simi. A chuva também vinha visitá-la!'
                },
                {
                    image: '🌿',
                    text: 'Pouco a pouco, Simi começou a crescer. Primeiro apareceram duas folhinhas verdes muito pequeninas!'
                },
                {
                    image: '🌳',
                    text: 'Com o tempo, Simi cresceu e cresceu, até se tornar uma árvore linda com muitas folhas e flores!'
                },
                {
                    image: '🍎',
                    text: 'Agora Simi dá frutos deliciosos e sombra fresca para todos os animais da floresta!'
                }
            ]
        },
        'corpo-humano': {
            title: 'O Corpo Humano',
            pages: [
                {
                    image: '👶',
                    text: 'O nosso corpo é uma máquina incrível! Temos olhos para ver, ouvidos para ouvir e um nariz para cheirar!'
                },
                {
                    image: '❤️',
                    text: 'O coração é como um motor que nunca para! Ele bate tum-tum, tum-tum, e envia sangue para todo o corpo!'
                },
                {
                    image: '🧠',
                    text: 'O cérebro é o chefe do nosso corpo! Ele nos ajuda a pensar, a lembrar e a aprender coisas novas!'
                },
                {
                    image: '🦴',
                    text: 'Os ossos são como as vigas de uma casa! Eles são fortes e protegem os nossos órgãos importantes!'
                },
                {
                    image: '💪',
                    text: 'E com músculos fortes e uma alimentação saudável, podemos correr, saltar e brincar muito!'
                }
            ]
        },
        'espaco': {
            title: 'O Espaço',
            pages: [
                {
                    image: '🚀',
                    text: 'Vamos viajar pelo espaço! A nossa nave espacial está pronta para uma grande aventura!'
                },
                {
                    image: '🌍',
                    text: 'Aqui está o nosso planeta Terra! É azul e verde, com océanos e continentes. É a nossa casa!'
                },
                {
                    image: '🌙',
                    text: 'Olha a Lua! Ela gira à volta da Terra e muda de forma todas as noites. Às vezes é redonda, às vezes é crescente!'
                },
                {
                    image: '⭐',
                    text: 'As estrelas são como o Sol, mas estão muito, muito longe! À noite, elas brilham no céu escuro!'
                },
                {
                    image: '☀️',
                    text: 'O Sol é a nossa estrela especial! Ele nos dá luz e calor para que possamos viver na Terra!'
                }
            ]
        },
        'oceanos': {
            title: 'Os Oceanos',
            pages: [
                {
                    image: '🌊',
                    text: 'Bem-vindos ao mundo mágico dos oceanos! Aqui vivem criaturas incríveis nas águas azuis!'
                },
                {
                    image: '🐠',
                    text: 'Os peixinhos coloridos nadam felizes entre os corais. Alguns são amarelos, outros são azuis e vermelhos!'
                },
                {
                    image: '🐙',
                    text: 'O polvo Otto tem oito braços compridos! Ele é muito inteligente e sabe mudar de cor!'
                },
                {
                    image: '🐢',
                    text: 'A tartaruga Tita nada devagar e vive muitos, muitos anos. Ela já viu o oceano mudar ao longo do tempo!'
                },
                {
                    image: '🐋',
                    text: 'E as baleias são os gigantes gentis do mar! Elas cantam canções bonitas que ecoam no oceano!'
                }
            ]
        },
        'historia': {
            title: 'A História',
            pages: [
                {
                    image: '🏰',
                    text: 'Há muito, muito tempo, existiam castelos enormes onde viviam reis e rainhas com coroas douradas!'
                },
                {
                    image: '⚔️',
                    text: 'Cavaleiros corajosos montavam em cavalos brancos e protegiam o reino com as suas armaduras brilhantes!'
                },
                {
                    image: '🐉',
                    text: 'Dizem que também havia dragões! Mas alguns eram bons e ajudavam as pessoas, não eram malvados!'
                },
                {
                    image: '👑',
                    text: 'As princesas e os príncipes aprendiam a ler, escrever e a ser gentis com todas as pessoas do reino!'
                },
                {
                    image: '📚',
                    text: 'E hoje, nós aprendemos sobre essas histórias antigas através de livros e descobertas dos arqueólogos!'
                }
            ]
        }
    };
    
    return stories[bookId] || stories['animais'];
}

function generateStoryHTML(story) {
    currentStoryPage = 0;
    
    let html = '<div class="story-container">';
    
    // Gerar todas as páginas
    story.pages.forEach((page, index) => {
        html += `
            <div class="story-page ${index === 0 ? 'active' : ''}" id="storyPage${index}">
                <div class="story-image">${page.image}</div>
                <div class="story-text">${page.text}</div>
            </div>
        `;
    });
    
    // Navegação
    html += `
        <div class="story-navigation">
            <button class="story-btn" id="prevStoryBtn" onclick="previousStoryPage()" disabled>
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
            
            <div class="story-progress">
                <span id="currentStoryPage">1</span> de ${story.pages.length}
            </div>
            
            <button class="story-btn" id="nextStoryBtn" onclick="nextStoryPage()">
                Próxima <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    html += '</div>';
    return html;
}

function previousStoryPage() {
    if (currentStoryPage > 0) {
        document.getElementById(`storyPage${currentStoryPage}`).classList.remove('active');
        currentStoryPage--;
        document.getElementById(`storyPage${currentStoryPage}`).classList.add('active');
        updateStoryNavigation();
    }
}

function nextStoryPage() {
    const totalPages = document.querySelectorAll('.story-page').length;
    if (currentStoryPage < totalPages - 1) {
        document.getElementById(`storyPage${currentStoryPage}`).classList.remove('active');
        currentStoryPage++;
        document.getElementById(`storyPage${currentStoryPage}`).classList.add('active');
        updateStoryNavigation();
    }
}

function updateStoryNavigation() {
    const totalPages = document.querySelectorAll('.story-page').length;
    const prevBtn = document.getElementById('prevStoryBtn');
    const nextBtn = document.getElementById('nextStoryBtn');
    const currentPageSpan = document.getElementById('currentStoryPage');
    
    prevBtn.disabled = currentStoryPage === 0;
    nextBtn.disabled = currentStoryPage === totalPages - 1;
    currentPageSpan.textContent = currentStoryPage + 1;
    
    if (currentStoryPage === totalPages - 1) {
        nextBtn.innerHTML = 'Fim <i class="fas fa-check"></i>';
        // Marcar história como lida quando chegar ao fim
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            const storyId = getStoryIdFromTitle(modalTitle.textContent);
            if (storyId) {
                markStoryAsRead(storyId);
            }
        }
    } else {
        nextBtn.innerHTML = 'Próxima <i class="fas fa-chevron-right"></i>';
    }
}

function getStoryIdFromTitle(title) {
    const storyMap = {
        'Os Animais': 'animais',
        'As Plantas': 'plantas',
        'O Corpo Humano': 'corpo-humano',
        'O Espaço': 'espaco',
        'Os Oceanos': 'oceanos',
        'A História': 'historia'
    };
    return storyMap[title] || null;
}

// Sistema de Jogos
function generateGameContent(gameId) {
    const games = {
        'puzzle-palavras': {
            title: 'Puzzle de Palavras',
            content: generateWordPuzzleHTML()
        },
        'contar-estrelas': {
            title: 'Contar Estrelas',
            content: generateStarCountingHTML()
        },
        'cores-formas': {
            title: 'Cores e Formas',
            content: generateColorShapesHTML()
        },
        'memoria-animais': {
            title: 'Memória dos Animais',
            content: generateMemoryGameHTML()
        }
    };
    
    return games[gameId] || games['puzzle-palavras'];
}

function generateWordPuzzleHTML() {
    return `
        <div class="game-container">
            <div class="game-header">
                <div class="game-title">Puzzle de Palavras</div>
                <div class="game-score">Pontuação: <span id="wordPuzzleScore">0</span></div>
            </div>
            
            <div class="game-area">
                <div class="word-puzzle">
                    <div class="puzzle-image" id="puzzleImage">🐱</div>
                    <div class="puzzle-word" id="puzzleWord">GATO</div>
                    
                    <div class="puzzle-letters" id="puzzleLetters">
                        <!-- Slots para letras serão gerados dinamicamente -->
                    </div>
                    
                    <div class="available-letters" id="availableLetters">
                        <!-- Letras disponíveis serão geradas dinamicamente -->
                    </div>
                    
                    <div class="game-controls">
                        <button class="practice-btn" onclick="resetWordPuzzle()">
                            <i class="fas fa-redo"></i> Nova Palavra
                        </button>
                        <button class="practice-btn" onclick="checkWordPuzzle()">
                            <i class="fas fa-check"></i> Verificar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateStarCountingHTML() {
    return `
        <div class="game-container">
            <div class="game-header">
                <div class="game-title">Contar Estrelas</div>
                <div class="game-score">Pontuação: <span id="starCountScore">0</span></div>
            </div>
            
            <div class="game-area">
                <div class="star-counting">
                    <h3>Quantas estrelas vês?</h3>
                    
                    <div class="stars-display" id="starsDisplay">
                        <!-- Estrelas serão geradas dinamicamente -->
                    </div>
                    
                    <div class="number-options" id="numberOptions">
                        <!-- Opções de números serão geradas dinamicamente -->
                    </div>
                    
                    <div class="game-controls">
                        <button class="practice-btn" onclick="generateStars()">
                            <i class="fas fa-star"></i> Novas Estrelas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateColorShapesHTML() {
    return `
        <div class="game-container">
            <div class="game-header">
                <div class="game-title">Cores e Formas</div>
                <div class="game-score">Pontuação: <span id="colorShapeScore">0</span></div>
            </div>
            
            <div class="game-area">
                <div class="color-shapes">
                    <h3>Encontra a forma da mesma cor!</h3>
                    
                    <div class="target-shape" id="targetShape">
                        <!-- Forma alvo será gerada dinamicamente -->
                    </div>
                    
                    <div class="shape-options" id="shapeOptions">
                        <!-- Opções de formas serão geradas dinamicamente -->
                    </div>
                    
                    <div class="game-controls">
                        <button class="practice-btn" onclick="generateShapes()">
                            <i class="fas fa-shapes"></i> Novas Formas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateMemoryGameHTML() {
    return `
        <div class="game-container">
            <div class="game-header">
                <div class="game-title">Memória dos Animais</div>
                <div class="game-score">Pontuação: <span id="memoryScore">0</span></div>
            </div>
            
            <div class="game-area">
                <div class="memory-game">
                    <h3>Encontra os pares de animais!</h3>
                    
                    <div class="memory-grid" id="memoryGrid">
                        <!-- Cartas de memória serão geradas dinamicamente -->
                    </div>
                    
                    <div class="game-controls">
                        <button class="practice-btn" onclick="resetMemoryGame()">
                            <i class="fas fa-redo"></i> Novo Jogo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Funções do menu do utilizador
function openProfile() {
    console.log('Abrindo perfil do utilizador');
    showNotification('A abrir o teu perfil...', 'info');
    // window.location.href = '/perfil';
}

function openProgress() {
    console.log('Abrindo progresso do utilizador');
    showNotification('A mostrar o teu progresso...', 'info');
    
    const progressContent = generateProgressHTML();
    openModal('O Meu Progresso', progressContent);
}

function generateProgressHTML() {
    const progressPercentage = Math.round((userProgress.totalScore / (userProgress.level * 500)) * 100);
    
    return `
        <div class="progress-container">
            <div class="user-stats">
                <div class="stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-info">
                        <h4>Nível ${userProgress.level}</h4>
                        <p>${userProgress.totalScore} pontos</p>
                        <div class="level-progress">
                            <div class="level-progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <small>${Math.max(0, (userProgress.level * 500) - userProgress.totalScore)} pontos para o próximo nível</small>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-info">
                        <h4>Sequência</h4>
                        <p>${userProgress.streakDays} dias seguidos</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🏅</div>
                    <div class="stat-info">
                        <h4>Conquistas</h4>
                        <p>${userProgress.achievements.length} de ${achievements.length}</p>
                    </div>
                </div>
            </div>
            
            <div class="progress-sections">
                <h4>Progresso por Área</h4>
                
                <div class="progress-item">
                    <div class="progress-label">
                        <span>🔤 Alfabeto</span>
                        <span>${userProgress.alphabet.completed}/${userProgress.alphabet.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${userProgress.alphabet.progress}%"></div>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-label">
                        <span>🔢 Números</span>
                        <span>${userProgress.numbers.completed}/${userProgress.numbers.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${userProgress.numbers.progress}%"></div>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-label">
                        <span>⏰ Relógio</span>
                        <span>${userProgress.clock.completed}/${userProgress.clock.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${userProgress.clock.progress}%"></div>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-label">
                        <span>📅 Calendário</span>
                        <span>${userProgress.calendar.completed}/${userProgress.calendar.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${userProgress.calendar.progress}%"></div>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-label">
                        <span>🧮 Matemática</span>
                        <span>${userProgress.math.total} pontos</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${userProgress.math.progress}%"></div>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-label">
                        <span>🔍 Formas</span>
                        <span>${userProgress.shapes.completed}/${userProgress.shapes.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${userProgress.shapes.progress}%"></div>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-label">
                        <span>📚 Histórias</span>
                        <span>${userProgress.stories.read.length}/${userProgress.stories.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${userProgress.stories.progress}%"></div>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-label">
                        <span>🎮 Jogos</span>
                        <span>${userProgress.games.total} pontos</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(userProgress.games.total, 100)}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="achievements-section">
                <h4>Conquistas Desbloqueadas</h4>
                <div class="achievements-grid">
                    ${generateAchievementsHTML()}
                </div>
            </div>
        </div>
    `;
}

function generateAchievementsHTML() {
    let html = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = userProgress.achievements.includes(achievement.id);
        const achievementClass = isUnlocked ? 'achievement-unlocked' : 'achievement-locked';
        
        html += `
            <div class="achievement-card ${achievementClass}">
                <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <h5>${achievement.name}</h5>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;
    });
    
    return html;
}

// Atualizar todas as barras de progresso na página
function updateAllProgress() {
    // Atualizar progresso nos cartões da página principal
    updateCardProgress('alfabeto', userProgress.alphabet.progress);
    updateCardProgress('numeros', userProgress.numbers.progress);
    updateCardProgress('relogio', userProgress.clock.progress);
    updateCardProgress('calendario', userProgress.calendar.progress);
    updateCardProgress('matematica', userProgress.math.progress);
    updateCardProgress('formas', userProgress.shapes.progress);
}

function updateCardProgress(cardType, percentage) {
    // Encontrar cartões por texto ou classe e atualizar progresso
    const cards = document.querySelectorAll('.discipline-card');
    cards.forEach(card => {
        const title = card.querySelector('h4');
        if (title) {
            const titleText = title.textContent.toLowerCase();
            let shouldUpdate = false;
            
            switch(cardType) {
                case 'alfabeto':
                    shouldUpdate = titleText.includes('alfabeto');
                    break;
                case 'numeros':
                    shouldUpdate = titleText.includes('números');
                    break;
                case 'relogio':
                    shouldUpdate = titleText.includes('relógio');
                    break;
                case 'calendario':
                    shouldUpdate = titleText.includes('calendário');
                    break;
                case 'matematica':
                    shouldUpdate = titleText.includes('matemática');
                    break;
                case 'formas':
                    shouldUpdate = titleText.includes('formas');
                    break;
            }
            
            if (shouldUpdate) {
                const progressFill = card.querySelector('.progress-fill');
                const progressText = card.querySelector('.progress-text');
                
                if (progressFill && progressText) {
                    progressFill.style.width = `${percentage}%`;
                    progressText.textContent = `${percentage}% Concluído`;
                }
            }
        }
    });
}

function openSettings() {
    console.log('Abrindo definições');
    showNotification('A abrir definições...', 'info');
    // window.location.href = '/definicoes';
}

// Centro de Aprendizagem
function openLearningCenter() {
    console.log('Abrindo centro de aprendizagem');
    showNotification('A abrir centro de aprendizagem...', 'info');
    
    const learningContent = generateLearningCenterHTML();
    openModal('Centro de Aprendizagem', learningContent);
}

function generateLearningCenterHTML() {
    return `
        <div class="learning-center">
            <div class="learning-navigation">
                <div class="learning-nav-card" onclick="openAlphabet()">
                    <div class="learning-nav-icon">
                        <i class="fas fa-font"></i>
                    </div>
                    <h4>Alfabeto</h4>
                    <p>Aprende as letras maiúsculas, minúsculas e cursivas</p>
                </div>
                
                <div class="learning-nav-card" onclick="openNumbers()">
                    <div class="learning-nav-icon">
                        <i class="fas fa-hashtag"></i>
                    </div>
                    <h4>Números</h4>
                    <p>Descobre os números de 0 a 20 com pontos visuais</p>
                </div>
                
                <div class="learning-nav-card" onclick="openClock()">
                    <div class="learning-nav-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h4>Relógio</h4>
                    <p>Aprende a ler as horas e os minutos</p>
                </div>
                
                <div class="learning-nav-card" onclick="openCalendar()">
                    <div class="learning-nav-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <h4>Calendário</h4>
                    <p>Explora os dias, semanas, meses e estações</p>
                </div>
                
                <div class="learning-nav-card" onclick="openAdvancedMath()">
                    <div class="learning-nav-icon">
                        <i class="fas fa-calculator"></i>
                    </div>
                    <h4>Matemática</h4>
                    <p>Exercícios de soma, subtração e tabuadas</p>
                </div>
                
                <div class="learning-nav-card" onclick="openAdvancedShapes()">
                    <div class="learning-nav-icon">
                        <i class="fas fa-shapes"></i>
                    </div>
                    <h4>Formas & Cores</h4>
                    <p>Identifica formas geométricas e suas cores</p>
                </div>
            </div>
        </div>
    `;
}

// Sistema de Números
function openNumbers() {
    const numbersContent = generateNumbersHTML();
    openModal('Aprende os Números', numbersContent);
}

function generateNumbersHTML() {
    const numberWords = [
        'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
        'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezasseis', 'dezassete', 'dezoito', 'dezanove', 'vinte'
    ];
    
    let html = '<div class="numbers-grid">';
    
    for (let i = 0; i <= 20; i++) {
        html += `
            <div class="number-card" onclick="playNumberSound(${i})">
                <div class="number-display">${i}</div>
                <div class="number-word">${numberWords[i]}</div>
                <div class="number-dots">
                    ${generateDots(i)}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

function generateDots(count) {
    let dots = '';
    for (let i = 0; i < count; i++) {
        dots += '<div class="dot"></div>';
    }
    return dots;
}

function playNumberSound(number) {
    const numberWords = [
        'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
        'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezasseis', 'dezassete', 'dezoito', 'dezanove', 'vinte'
    ];
    
    // Tracking de progresso
    updateCategoryProgress('numbers', 0.8);
    
    showNotification(`Número ${number}: ${numberWords[number]}`, 'info');
    vibrate([100, 50, 100]);
    
    // Adicionar animação visual
    const numberCards = document.querySelectorAll('.number-card');
    numberCards.forEach(card => {
        if (card.textContent.includes(number.toString())) {
            card.classList.add('playing');
            setTimeout(() => card.classList.remove('playing'), 600);
        }
    });
}

// Sistema de Relógio
let currentHour = 12;
let currentMinute = 0;

function openClock() {
    const clockContent = generateClockHTML();
    openModal('Aprende as Horas', clockContent);
    setTimeout(initializeClock, 100);
}

function generateClockHTML() {
    return `
        <div class="clock-container">
            <div class="clock-face" id="clockFace">
                <div class="clock-center"></div>
                <div class="clock-hand hour-hand" id="hourHand"></div>
                <div class="clock-hand minute-hand" id="minuteHand"></div>
            </div>
            
            <div class="time-display" id="timeDisplay">12:00</div>
            
            <div class="time-controls">
                <button class="practice-btn" onclick="setRandomTime()">
                    <i class="fas fa-random"></i> Hora Aleatória
                </button>
                <button class="practice-btn" onclick="setCurrentTime()">
                    <i class="fas fa-clock"></i> Hora Atual
                </button>
                <button class="practice-btn" onclick="practiceTime()">
                    <i class="fas fa-question"></i> Quiz das Horas
                </button>
            </div>
        </div>
    `;
}

function initializeClock() {
    const clockFace = document.getElementById('clockFace');
    if (!clockFace) return;
    
    // Adicionar números do relógio
    for (let i = 1; i <= 12; i++) {
        const number = document.createElement('div');
        number.className = 'clock-number';
        number.textContent = i;
        
        const angle = (i * 30) - 90; // 30 graus por hora, -90 para começar no topo
        const x = 50 + 40 * Math.cos(angle * Math.PI / 180);
        const y = 50 + 40 * Math.sin(angle * Math.PI / 180);
        
        number.style.left = `${x}%`;
        number.style.top = `${y}%`;
        
        clockFace.appendChild(number);
    }
    
    updateClockHands();
}

function updateClockHands() {
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const timeDisplay = document.getElementById('timeDisplay');
    
    if (!hourHand || !minuteHand || !timeDisplay) return;
    
    const hourAngle = (currentHour % 12) * 30 + (currentMinute * 0.5);
    const minuteAngle = currentMinute * 6;
    
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    
    timeDisplay.textContent = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
}

function setRandomTime() {
    currentHour = Math.floor(Math.random() * 12) + 1;
    currentMinute = Math.floor(Math.random() * 12) * 5; // Múltiplos de 5
    updateClockHands();
    showNotification(`Nova hora: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`, 'info');
}

function setCurrentTime() {
    const now = new Date();
    currentHour = now.getHours() % 12 || 12;
    currentMinute = now.getMinutes();
    updateClockHands();
    showNotification('Hora atual definida!', 'success');
}

function practiceTime() {
    setRandomTime();
    const correctTime = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;
    
    setTimeout(() => {
        const userAnswer = prompt('Que horas são? (formato: H:MM)');
        if (userAnswer === correctTime) {
            showNotification('Correto! Muito bem!', 'success');
        } else {
            showNotification(`A resposta correta era ${correctTime}`, 'warning');
        }
    }, 1000);
}

// Sistema de Calendário
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

function openCalendar() {
    const calendarContent = generateCalendarHTML();
    openModal('Calendário e Datas', calendarContent);
}

function generateCalendarHTML() {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const today = new Date();
    
    let html = `
        <div class="calendar-container">
            <div class="calendar-header">
                <button class="calendar-nav-btn" onclick="previousMonth()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="calendar-month">${months[currentCalendarMonth]} ${currentCalendarYear}</div>
                <button class="calendar-nav-btn" onclick="nextMonth()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div class="calendar-grid">
    `;
    
    // Cabeçalhos dos dias da semana
    daysOfWeek.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Dias vazios do início do mês
    for (let i = 0; i < firstDay.getDay(); i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    // Dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const isToday = today.getDate() === day && 
                       today.getMonth() === currentCalendarMonth && 
                       today.getFullYear() === currentCalendarYear;
        
        const dayClass = isToday ? 'calendar-day today' : 'calendar-day';
        html += `<div class="${dayClass}" onclick="selectCalendarDay(${day})">${day}</div>`;
    }
    
    html += `
            </div>
            
            <div class="practice-controls">
                <button class="practice-btn" onclick="todayDate()">
                    <i class="fas fa-calendar-day"></i> Hoje
                </button>
                <button class="practice-btn" onclick="learnSeasons()">
                    <i class="fas fa-leaf"></i> Estações
                </button>
                <button class="practice-btn" onclick="learnWeekdays()">
                    <i class="fas fa-calendar-week"></i> Dias da Semana
                </button>
            </div>
        </div>
    `;
    
    return html;
}

function previousMonth() {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    updateCalendarDisplay();
}

function nextMonth() {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    updateCalendarDisplay();
}

function updateCalendarDisplay() {
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.innerHTML = generateCalendarHTML();
    }
}

function selectCalendarDay(day) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    showNotification(`Selecionaste: ${day} de ${months[currentCalendarMonth]} de ${currentCalendarYear}`, 'info');
    vibrate([50]);
}

function todayDate() {
    const today = new Date();
    currentCalendarMonth = today.getMonth();
    currentCalendarYear = today.getFullYear();
    updateCalendarDisplay();
    showNotification('Voltaste para hoje!', 'success');
}

function learnSeasons() {
    showNotification('Primavera: Mar-Mai, Verão: Jun-Ago, Outono: Set-Nov, Inverno: Dez-Fev', 'info');
}

function learnWeekdays() {
    showNotification('Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo', 'info');
}

// Matemática Avançada
let mathDifficulty = 'easy';
let mathScore = 0;
let currentMathAnswer = 0;

function openAdvancedMath() {
    const mathContent = generateAdvancedMathHTML();
    openModal('Matemática Avançada', mathContent);
    generateMathProblem();
}

function generateAdvancedMathHTML() {
    return `
        <div class="math-game-container">
            <div class="game-header">
                <div class="game-title">Exercícios de Matemática</div>
                <div class="game-score">Pontuação: <span id="mathGameScore">0</span></div>
            </div>
            
            <div class="difficulty-selector">
                <button class="difficulty-btn active" onclick="setMathDifficulty('easy')">
                    <i class="fas fa-baby"></i> Fácil
                </button>
                <button class="difficulty-btn" onclick="setMathDifficulty('medium')">
                    <i class="fas fa-child"></i> Médio
                </button>
                <button class="difficulty-btn" onclick="setMathDifficulty('hard')">
                    <i class="fas fa-user-graduate"></i> Difícil
                </button>
            </div>
            
            <div class="math-problem">
                <div class="math-expression" id="mathExpression">2 + 3 = ?</div>
                <input type="number" class="math-input" id="mathInput" placeholder="?" onkeypress="handleMathEnter(event)">
                
                <div class="practice-controls">
                    <button class="practice-btn" onclick="checkMathAnswer()">
                        <i class="fas fa-check"></i> Verificar
                    </button>
                    <button class="practice-btn" onclick="generateMathProblem()">
                        <i class="fas fa-redo"></i> Novo Problema
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setMathDifficulty(difficulty) {
    mathDifficulty = difficulty;
    
    // Atualizar botões
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    generateMathProblem();
}

function generateMathProblem() {
    let num1, num2, operation, expression;
    
    switch(mathDifficulty) {
        case 'easy':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            operation = Math.random() < 0.7 ? '+' : '-';
            
            if (operation === '-' && num2 > num1) {
                [num1, num2] = [num2, num1]; // Evitar números negativos
            }
            break;
            
        case 'medium':
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 15) + 1;
            const operations = ['+', '-', '×'];
            operation = operations[Math.floor(Math.random() * operations.length)];
            
            if (operation === '-' && num2 > num1) {
                [num1, num2] = [num2, num1];
            }
            if (operation === '×') {
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
            }
            break;
            
        case 'hard':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 30) + 1;
            const hardOperations = ['+', '-', '×', '÷'];
            operation = hardOperations[Math.floor(Math.random() * hardOperations.length)];
            
            if (operation === '÷') {
                // Garantir divisão exata
                num2 = Math.floor(Math.random() * 10) + 1;
                num1 = num2 * (Math.floor(Math.random() * 10) + 1);
            }
            if (operation === '-' && num2 > num1) {
                [num1, num2] = [num2, num1];
            }
            break;
    }
    
    // Calcular resposta
    switch(operation) {
        case '+':
            currentMathAnswer = num1 + num2;
            break;
        case '-':
            currentMathAnswer = num1 - num2;
            break;
        case '×':
            currentMathAnswer = num1 * num2;
            break;
        case '÷':
            currentMathAnswer = num1 / num2;
            break;
    }
    
    expression = `${num1} ${operation} ${num2} = ?`;
    
    const mathExpression = document.getElementById('mathExpression');
    const mathInput = document.getElementById('mathInput');
    
    if (mathExpression && mathInput) {
        mathExpression.textContent = expression;
        mathInput.value = '';
        mathInput.focus();
    }
}

function handleMathEnter(event) {
    if (event.key === 'Enter') {
        checkMathAnswer();
    }
}

function checkMathAnswer() {
    const mathInput = document.getElementById('mathInput');
    const userAnswer = parseInt(mathInput.value);
    
    if (isNaN(userAnswer)) {
        showNotification('Por favor, insere um número!', 'warning');
        return;
    }
    
    if (userAnswer === currentMathAnswer) {
        const points = getDifficultyPoints();
        mathScore += points;
        document.getElementById('mathGameScore').textContent = mathScore;
        
        // Tracking de progresso
        updateMathProgress(mathDifficulty, points);
        
        showNotification('Correto! Muito bem!', 'success');
        
        setTimeout(() => {
            generateMathProblem();
        }, 1500);
    } else {
        showNotification(`Errado! A resposta correta é ${currentMathAnswer}`, 'warning');
        vibrate([100, 100, 100]);
    }
}

function getDifficultyPoints() {
    switch(mathDifficulty) {
        case 'easy': return 5;
        case 'medium': return 10;
        case 'hard': return 20;
        default: return 5;
    }
}

// Formas e Cores Avançado
let shapesScore = 0;
let currentTargetColor = '';
let currentTargetShape = '';

function openAdvancedShapes() {
    const shapesContent = generateAdvancedShapesHTML();
    openModal('Formas e Cores Avançadas', shapesContent);
    generateShapes();
}

function generateAdvancedShapesHTML() {
    return `
        <div class="game-container">
            <div class="game-header">
                <div class="game-title">Formas e Cores</div>
                <div class="game-score">Pontuação: <span id="shapesGameScore">0</span></div>
            </div>
            
            <div class="shape-game-area">
                <div class="target-shape-container">
                    <h3>Encontra a forma igual:</h3>
                    <div class="shape-display" id="targetShapeDisplay"></div>
                    <p id="shapeInstructions">Clica na forma da mesma cor e tipo!</p>
                </div>
                
                <div class="shape-options-grid" id="shapeOptionsGrid">
                    <!-- Opções serão geradas dinamicamente -->
                </div>
                
                <div class="practice-controls">
                    <button class="practice-btn" onclick="generateShapes()">
                        <i class="fas fa-redo"></i> Novas Formas
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateShapes() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const shapes = ['●', '■', '▲', '◆', '★', '♥', '⬢', '⬟'];
    const shapeNames = ['círculo', 'quadrado', 'triângulo', 'diamante', 'estrela', 'coração', 'hexágono', 'losango'];
    
    // Definir forma e cor alvo
    const targetColorIndex = Math.floor(Math.random() * colors.length);
    const targetShapeIndex = Math.floor(Math.random() * shapes.length);
    
    currentTargetColor = colors[targetColorIndex];
    currentTargetShape = shapes[targetShapeIndex];
    
    // Mostrar forma alvo
    const targetDisplay = document.getElementById('targetShapeDisplay');
    if (targetDisplay) {
        targetDisplay.style.backgroundColor = currentTargetColor;
        targetDisplay.textContent = currentTargetShape;
    }
    
    // Atualizar instruções
    const instructions = document.getElementById('shapeInstructions');
    if (instructions) {
        instructions.textContent = `Encontra o ${shapeNames[targetShapeIndex]} da mesma cor!`;
    }
    
    // Gerar opções
    const optionsGrid = document.getElementById('shapeOptionsGrid');
    if (optionsGrid) {
        optionsGrid.innerHTML = '';
        
        // Adicionar resposta correta
        const correctOption = createShapeOption(currentTargetShape, currentTargetColor, true);
        optionsGrid.appendChild(correctOption);
        
        // Adicionar opções incorretas
        for (let i = 0; i < 5; i++) {
            let color, shape;
            do {
                color = colors[Math.floor(Math.random() * colors.length)];
                shape = shapes[Math.floor(Math.random() * shapes.length)];
            } while (color === currentTargetColor && shape === currentTargetShape);
            
            const wrongOption = createShapeOption(shape, color, false);
            optionsGrid.appendChild(wrongOption);
        }
        
        // Embaralhar opções
        shuffleGridChildren(optionsGrid);
    }
}

function createShapeOption(shape, color, isCorrect) {
    const option = document.createElement('div');
    option.className = 'shape-option';
    option.style.backgroundColor = color;
    option.textContent = shape;
    option.onclick = () => checkShapeAnswer(isCorrect);
    return option;
}

function shuffleGridChildren(grid) {
    const children = Array.from(grid.children);
    children.sort(() => Math.random() - 0.5);
    children.forEach(child => grid.appendChild(child));
}

function checkShapeAnswer(isCorrect) {
    if (isCorrect) {
        shapesScore += 10;
        document.getElementById('shapesGameScore').textContent = shapesScore;
        
        // Tracking de progresso
        updateGameProgress('colors', 10);
        updateCategoryProgress('shapes', 1);
        
        showNotification('Correto! Forma encontrada!', 'success');
        
        setTimeout(() => {
            generateShapes();
        }, 1500);
    } else {
        showNotification('Tenta novamente!', 'warning');
        vibrate([100, 100]);
    }
}

// Corrigir função de cores e formas que estava em falta
function initializeColorShapes() {
    generateShapes();
}

function logout() {
    console.log('Fazendo logout');
    
    if (confirm('Tens a certeza que queres sair?')) {
        showNotification('A fazer logout...', 'warning');
        
        setTimeout(() => {
            // Limpar dados do utilizador
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirecionar para página de login
            // window.location.href = '/login';
            console.log('Logout realizado');
        }, 1000);
    }
}

// Funções auxiliares para obter nomes
function getDisciplineName(disciplineId) {
    const disciplines = {
        'lingua-portuguesa': 'Língua Portuguesa',
        'matematica': 'Matemática',
        'estudo-meio': 'Estudo do Meio',
        'educacao-visual': 'Educação Visual'
    };
    return disciplines[disciplineId] || 'Disciplina';
}

function getBookName(bookId) {
    const books = {
        'animais': 'Os Animais',
        'plantas': 'As Plantas',
        'corpo-humano': 'O Corpo Humano',
        'espaco': 'O Espaço',
        'oceanos': 'Os Oceanos',
        'historia': 'A História'
    };
    return books[bookId] || 'Livro';
}

function getGameName(gameId) {
    const games = {
        'puzzle-palavras': 'Puzzle de Palavras',
        'contar-estrelas': 'Contar Estrelas',
        'cores-formas': 'Cores e Formas',
        'memoria-animais': 'Memória dos Animais'
    };
    return games[gameId] || 'Jogo';
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente se houver
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 15px;
        padding: 1rem 1.5rem;
        box-shadow: 0 8px 32px rgba(0, 255, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'info': 'fa-info-circle',
        'warning': 'fa-exclamation-triangle',
        'error': 'fa-times-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Animações e efeitos visuais
function addVisualEffects() {
    // Efeito de partículas no hover dos cartões
    const cards = document.querySelectorAll('.discipline-card, .book-card, .game-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            createParticleEffect(this);
        });
    });
}

function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = 5;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            opacity: 1;
            transform: scale(0);
            animation: particle-burst 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Remover partícula após animação
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 600);
    }
}

// Adicionar animação CSS para partículas
function addParticleAnimation() {
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes particle-burst {
                0% {
                    transform: scale(0) translateY(0);
                    opacity: 1;
                }
                50% {
                    transform: scale(1) translateY(-20px);
                    opacity: 1;
                }
                100% {
                    transform: scale(0) translateY(-40px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Progresso simulado para as disciplinas
function updateProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const currentWidth = parseInt(bar.style.width);
        const increment = Math.random() * 5; // Incremento aleatório até 5%
        const newWidth = Math.min(currentWidth + increment, 100);
        
        setTimeout(() => {
            bar.style.width = `${newWidth}%`;
            
            // Atualizar texto do progresso
            const progressText = bar.parentElement.nextElementSibling;
            if (progressText && progressText.classList.contains('progress-text')) {
                progressText.textContent = `${Math.round(newWidth)}% Concluído`;
            }
        }, index * 500);
    });
}

// Sons de feedback (opcional - requer arquivos de áudio)
function playSound(soundType) {
    // Esta função pode ser expandida para incluir feedback sonoro
    console.log(`Som: ${soundType}`);
}

// Lógica dos Jogos
function initializeGame(gameId) {
    switch(gameId) {
        case 'puzzle-palavras':
            initializeWordPuzzle();
            break;
        case 'contar-estrelas':
            initializeStarCounting();
            break;
        case 'cores-formas':
            initializeColorShapes();
            break;
        case 'memoria-animais':
            initializeMemoryGame();
            break;
    }
}

// Jogo Puzzle de Palavras
let currentWord = '';
let currentWordImage = '';
let wordPuzzleScore = 0;

function initializeWordPuzzle() {
    resetWordPuzzle();
}

function resetWordPuzzle() {
    const words = [
        { word: 'GATO', image: '🐱' },
        { word: 'CASA', image: '🏠' },
        { word: 'SOL', image: '☀️' },
        { word: 'FLOR', image: '🌸' },
        { word: 'PEIXE', image: '🐠' },
        { word: 'BOLA', image: '⚽' },
        { word: 'LIVRO', image: '📚' },
        { word: 'ÁRVORE', image: '🌳' }
    ];
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    currentWord = randomWord.word;
    currentWordImage = randomWord.image;
    
    // Atualizar imagem
    document.getElementById('puzzleImage').textContent = currentWordImage;
    
    // Gerar slots para letras
    const puzzleLetters = document.getElementById('puzzleLetters');
    puzzleLetters.innerHTML = '';
    
    for (let i = 0; i < currentWord.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.setAttribute('data-index', i);
        slot.onclick = () => removeLetterFromSlot(i);
        puzzleLetters.appendChild(slot);
    }
    
    // Gerar letras embaralhadas
    const availableLetters = document.getElementById('availableLetters');
    availableLetters.innerHTML = '';
    
    const shuffledLetters = shuffleArray([...currentWord].concat(generateRandomLetters(3)));
    
    shuffledLetters.forEach((letter, index) => {
        const letterTile = document.createElement('button');
        letterTile.className = 'letter-tile';
        letterTile.textContent = letter;
        letterTile.setAttribute('data-letter', letter);
        letterTile.setAttribute('data-index', index);
        letterTile.onclick = () => addLetterToSlot(letter, index);
        availableLetters.appendChild(letterTile);
    });
}

function addLetterToSlot(letter, tileIndex) {
    const letterTile = document.querySelector(`[data-index="${tileIndex}"]`);
    if (letterTile.classList.contains('used')) return;
    
    const emptySlot = document.querySelector('.letter-slot:not(.filled)');
    if (emptySlot) {
        emptySlot.textContent = letter;
        emptySlot.classList.add('filled');
        emptySlot.setAttribute('data-letter', letter);
        
        letterTile.classList.add('used');
        
        vibrate([50]);
    }
}

function removeLetterFromSlot(slotIndex) {
    const slot = document.querySelectorAll('.letter-slot')[slotIndex];
    if (!slot.classList.contains('filled')) return;
    
    const letter = slot.getAttribute('data-letter');
    slot.textContent = '';
    slot.classList.remove('filled');
    slot.removeAttribute('data-letter');
    
    // Reativar letra
    const letterTiles = document.querySelectorAll('.letter-tile');
    letterTiles.forEach(tile => {
        if (tile.textContent === letter && tile.classList.contains('used')) {
            tile.classList.remove('used');
            return;
        }
    });
    
    vibrate([50]);
}

function checkWordPuzzle() {
    const slots = document.querySelectorAll('.letter-slot');
    let userWord = '';
    
    slots.forEach(slot => {
        userWord += slot.textContent || '_';
    });
    
    if (userWord === currentWord) {
        wordPuzzleScore += 10;
        document.getElementById('wordPuzzleScore').textContent = wordPuzzleScore;
        
        // Tracking de progresso
        updateGameProgress('puzzle', 10);
        updateCategoryProgress('alphabet', 1);
        
        showNotification('Parabéns! Palavra correta!', 'success');
        
        setTimeout(() => {
            resetWordPuzzle();
        }, 2000);
    } else if (userWord.indexOf('_') === -1) {
        showNotification('Oops! Tenta novamente!', 'warning');
        vibrate([100, 100, 100]);
    } else {
        showNotification('Completa a palavra primeiro!', 'info');
    }
}

// Jogo Contar Estrelas
let starCount = 0;
let starCountScore = 0;

function initializeStarCounting() {
    generateStars();
}

function generateStars() {
    starCount = Math.floor(Math.random() * 10) + 1;
    
    const starsDisplay = document.getElementById('starsDisplay');
    starsDisplay.innerHTML = '';
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = '⭐';
        starsDisplay.appendChild(star);
    }
    
    // Gerar opções de números
    const numberOptions = document.getElementById('numberOptions');
    numberOptions.innerHTML = '';
    
    const options = generateNumberOptions(starCount);
    
    options.forEach(number => {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = number;
        btn.onclick = () => checkStarCount(number);
        numberOptions.appendChild(btn);
    });
}

function generateNumberOptions(correct) {
    const options = [correct];
    
    while (options.length < 4) {
        const randomNum = Math.floor(Math.random() * 10) + 1;
        if (!options.includes(randomNum)) {
            options.push(randomNum);
        }
    }
    
    return shuffleArray(options);
}

function checkStarCount(selectedNumber) {
    if (selectedNumber === starCount) {
        starCountScore += 5;
        document.getElementById('starCountScore').textContent = starCountScore;
        
        // Tracking de progresso
        updateGameProgress('stars', 5);
        updateCategoryProgress('numbers', 0.5);
        
        showNotification('Correto! Muito bem!', 'success');
        
        setTimeout(() => {
            generateStars();
        }, 2000);
    } else {
        showNotification('Conta novamente!', 'warning');
        vibrate([100, 100]);
    }
}

// Jogo Memória dos Animais
let memoryCards = [];
let flippedCards = [];
let memoryScore = 0;
let canFlip = true;

function initializeMemoryGame() {
    resetMemoryGame();
}

function resetMemoryGame() {
    const animals = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const gameAnimals = animals.slice(0, 6);
    memoryCards = [...gameAnimals, ...gameAnimals];
    memoryCards = shuffleArray(memoryCards);
    
    flippedCards = [];
    canFlip = true;
    
    const memoryGrid = document.getElementById('memoryGrid');
    memoryGrid.innerHTML = '';
    memoryGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
    `;
    
    memoryCards.forEach((animal, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('data-index', index);
        card.setAttribute('data-animal', animal);
        card.onclick = () => flipCard(index);
        
        card.style.cssText = `
            width: 80px;
            height: 80px;
            background: var(--accent-color);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            user-select: none;
        `;
        
        card.innerHTML = '❓';
        memoryGrid.appendChild(card);
    });
}

function flipCard(index) {
    if (!canFlip || flippedCards.length >= 2) return;
    
    const card = document.querySelector(`[data-index="${index}"]`);
    if (card.classList.contains('flipped')) return;
    
    const animal = card.getAttribute('data-animal');
    card.innerHTML = animal;
    card.classList.add('flipped');
    card.style.background = 'var(--success-color)';
    
    flippedCards.push({ index, animal, element: card });
    
    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMemoryMatch, 1000);
    }
    
    vibrate([50]);
}

function checkMemoryMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.animal === card2.animal) {
        // Match!
        memoryScore += 10;
        document.getElementById('memoryScore').textContent = memoryScore;
        
        // Tracking de progresso
        updateGameProgress('memory', 10);
        
        card1.element.style.background = 'var(--primary-color)';
        card2.element.style.background = 'var(--primary-color)';
        
        showNotification('Par encontrado!', 'success');
        
        // Verificar se o jogo acabou
        const remainingCards = document.querySelectorAll('.memory-card:not(.flipped)');
        if (remainingCards.length === 0) {
            setTimeout(() => {
                showNotification('Parabéns! Completaste o jogo!', 'success');
            }, 500);
        }
    } else {
        // No match
        setTimeout(() => {
            card1.element.innerHTML = '❓';
            card2.element.innerHTML = '❓';
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.element.style.background = 'var(--accent-color)';
            card2.element.style.background = 'var(--accent-color)';
        }, 500);
    }
    
    flippedCards = [];
    canFlip = true;
}

// Funções auxiliares
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function generateRandomLetters(count) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = [];
    
    for (let i = 0; i < count; i++) {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        randomLetters.push(randomLetter);
    }
    
    return randomLetters;
}

// Observador para inicializar canvas quando necessário
const modalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            const practiceCanvas = document.getElementById('practiceCanvas');
            if (practiceCanvas) {
                setTimeout(initializeCanvas, 100);
            }
        }
    });
});

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('Plataforma educativa carregada!');
    
    // Carregar progresso salvo
    loadProgress();
    
    // Adicionar efeitos visuais
    addVisualEffects();
    addParticleAnimation();
    
    // Atualizar progresso a cada 30 segundos e guardar
    setInterval(() => {
        updateProgress();
        saveProgress();
    }, 30000);
    
    // Observar mudanças no DOM para modais
    modalObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Mensagem de boas-vindas personalizada baseada no progresso
    setTimeout(() => {
        const welcomeMessages = [
            `Bem-vindo de volta, nível ${userProgress.level}! 🌱`,
            `Olá, pequeno explorador! Tens ${userProgress.totalScore} pontos! ⭐`,
            `Que bom ver-te novamente! Continua a aprender! 📚`
        ];
        const message = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        showNotification(message, 'success');
    }, 1000);
    
    // Verificar conquistas ao carregar
    setTimeout(checkAchievements, 2000);
});

// Prevenir scroll horizontal em dispositivos móveis
document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
        event.preventDefault();
    }
}, { passive: false });

// Feedback tátil em dispositivos compatíveis
function vibrate(pattern = [100]) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Adicionar vibração aos cliques em cartões (dispositivos móveis)
document.addEventListener('click', function(event) {
    const clickableElements = [
        '.discipline-card',
        '.book-card', 
        '.game-card',
        '.achievement-card.earned',
        '.back-btn',
        '.user-menu'
    ];
    
    if (clickableElements.some(selector => event.target.closest(selector))) {
        vibrate([50]);
    }
});
