document.addEventListener('DOMContentLoaded', function() {
        // Elementos da interface
        const backButton = document.getElementById('backButton');
        const searchButton = document.getElementById('searchButton');
        const searchContainer = document.getElementById('searchContainer');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');
        
        // Elementos do carrossel
        const carousel = document.getElementById('heroCarousel');
        const carouselInner = carousel.querySelector('.carousel-inner');
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        const prevButton = document.getElementById('carouselPrev');
        const nextButton = document.getElementById('carouselNext');
        const indicatorsContainer = document.getElementById('carouselIndicators');
        
        // Configurações do carrossel
        let currentIndex = 0;
        const itemCount = carouselItems.length;
        let intervalId;
        const intervalTime = 5000; // 5 segundos
        let isAnimating = false;
        const animationDuration = 600; // Deve corresponder à duração no CSS
        
        // Clonar primeiro e último itens para criar o efeito de ciclo infinito
        const firstItemClone = carouselItems[0].cloneNode(true);
        const lastItemClone = carouselItems[itemCount - 1].cloneNode(true);
        
        // Adicionar clones ao carrossel
        carouselInner.appendChild(firstItemClone);
        carouselInner.insertBefore(lastItemClone, carouselItems[0]);
        
        // Atualizar lista de itens após adicionar clones
        const allItems = carouselInner.querySelectorAll('.carousel-item');
        const totalItems = allItems.length;
        
        // Posicionar inicialmente no item "real" (índice 1)
        currentIndex = 1;
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        carouselInner.style.transition = 'none';
        
        // Inicializar carrossel
        function initCarousel() {
                // Criar indicadores apenas para os itens reais
                for (let i = 0; i < itemCount; i++) {
                        const indicator = document.createElement('div');
                        indicator.classList.add('carousel-indicator');
                        if (i === currentIndex - 1) indicator.classList.add('active');
                        indicator.addEventListener('click', () => goToSlide(i + 1)); // +1 por causa do clone no início
                        indicatorsContainer.appendChild(indicator);
                }
                
                // Iniciar autoplay
                startAutoplay();
                
                // Event listeners para controles
                prevButton.addEventListener('click', prevSlide);
                nextButton.addEventListener('click', nextSlide);
                
                // Pausar autoplay quando interagir
                carousel.addEventListener('mouseenter', pauseAutoplay);
                carousel.addEventListener('mouseleave', startAutoplay);
                carousel.addEventListener('touchstart', pauseAutoplay);
                carousel.addEventListener('touchend', startAutoplay);
        }
        
        // Atualizar carrossel
        function updateCarousel(animate = true) {
                if (animate) {
                        isAnimating = true;
                        carouselInner.style.transition = `transform ${animationDuration}ms ease-in-out`;
                } else {
                        carouselInner.style.transition = 'none';
                }
                
                carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Atualizar indicadores
                const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
                let realIndex = currentIndex - 1; // Ajustar para índice real
                
                // Ajustar para ciclo infinito
                if (realIndex < 0) realIndex = itemCount - 1;
                if (realIndex >= itemCount) realIndex = 0;
                
                indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === realIndex);
                });
                
                // Resetar posição após a animação quando chegar nos clones
                if (animate) {
                        setTimeout(() => {
                                if (currentIndex === 0) {
                                        currentIndex = itemCount;
                                        updateCarousel(false);
                                } else if (currentIndex === totalItems - 1) {
                                        currentIndex = 1;
                                        updateCarousel(false);
                                }
                                isAnimating = false;
                        }, animationDuration);
                }
        }
        
        // Ir para slide específico
        function goToSlide(index) {
                if (isAnimating) return;
                currentIndex = index;
                updateCarousel();
                resetAutoplay();
        }
        
        // Slide anterior
        function prevSlide() {
                if (isAnimating) return;
                currentIndex--;
                if (currentIndex < 0) currentIndex = totalItems - 1;
                updateCarousel();
                resetAutoplay();
        }
        
        // Próximo slide
        function nextSlide() {
                if (isAnimating) return;
                currentIndex++;
                if (currentIndex >= totalItems) currentIndex = 0;
                updateCarousel();
                resetAutoplay();
        }
        
        // Autoplay
        function startAutoplay() {
                if (intervalId) clearInterval(intervalId);
                intervalId = setInterval(() => {
                        if (!document.hidden) {
                                nextSlide();
                        }
                }, intervalTime);
        }
        
        function pauseAutoplay() {
                clearInterval(intervalId);
        }
        
        function resetAutoplay() {
                pauseAutoplay();
                startAutoplay();
        }
        
        // Pausar autoplay quando a aba não está visível
        document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                        pauseAutoplay();
                } else {
                        startAutoplay();
                }
        });
        
        // Botão de voltar
        backButton.addEventListener('click', function() {
                window.history.back();
        });
        
        // Funcionalidade de busca
        searchButton.addEventListener('click', function() {
                searchContainer.classList.add('active');
                searchInput.focus();
        });
        
        searchClose.addEventListener('click', function() {
                searchContainer.classList.remove('active');
                searchInput.value = '';
        });
        
        // Fechar busca ao pressionar ESC
        document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
                        searchContainer.classList.remove('active');
                        searchInput.value = '';
                }
        });
        
        // Simular dados dinâmicos (para demonstração)
        function loadDynamicData() {
                const stats = [
                        { id: 'primeiro-ciclo', materials: 124, students: '2.5k' },
                        { id: 'segundo-ciclo', materials: 89, students: '1.8k' }
                ];
                
                stats.forEach(stat => {
                        const element = document.getElementById(stat.id);
                        if (element) {
                                const materialsEl = element.querySelector('.material-count');
                                const studentsEl = element.querySelector('.student-count');
                                
                                if (materialsEl) materialsEl.textContent = stat.materials;
                                if (studentsEl) studentsEl.textContent = stat.students;
                        }
                });
        }
        
        // Inicializar
        initCarousel();
        loadDynamicData();
});