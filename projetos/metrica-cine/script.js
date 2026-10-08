import { ENDPOINTS, FETCH_OPTIONS, IMAGE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const menuToggle = document.getElementById('menuToggle');
    const floatingNav = document.querySelector('.floating-nav');
    const themeBtn = document.querySelector('.nav-btn[data-tooltip="Alterar Tema"]');

    
    const toggleMenu = (forceClose = null) => {
        if (!menuToggle || !floatingNav) return;
        
        const isActive = forceClose !== null ? !forceClose : floatingNav.classList.toggle('active');
        
        if (forceClose === true) floatingNav.classList.remove('active');
        
        menuToggle.setAttribute('aria-expanded', isActive);
        const icon = menuToggle.querySelector('i');
        
        if (icon) {
            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMenu());
    }

    /**
     * 2. ROLAGEM PROGRAMÁTICA AVANÇADA (SMOOTH SCROLL & FOCUS MANAGEMENT)
     * Demonstra proficiência em manipulação de eventos e acessibilidade.
     */
    const setupNavigation = () => {
        // Mapeamento semântico dos botões para seus respectivos IDs alvos
        const navigationMap = {
            'Início': '.apresentacao',
            'Maiores Bilheterias': '#title-box-office',
            'Mais Bem Avaliados': '#title-top-rated',
            'Mais Assistidos no Brasil': '#title-popular-br',
            'Filmes em Alta': '#title-trending',
            'Próximos Lançamentos': '#title-upcoming'
        };

        const navButtons = document.querySelectorAll('.nav-btn[data-tooltip]');

        navButtons.forEach(button => {
            const tooltipText = button.getAttribute('data-tooltip');
            const targetSelector = navigationMap[tooltipText];

            // Ignora o botão de alternar tema do fluxo de navegação
            if (!targetSelector) return;

            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetSelector);
                if (!targetElement) return;

                // Executa a rolagem suave nativa otimizada por hardware
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Acessibilidade: Move o foco do teclado para o elemento alvo
                targetElement.setAttribute('tabindex', '-index');
                targetElement.focus({ preventScroll: true });

                // Fecha o menu hamburguer caso esteja no mobile
                toggleMenu(true);
            });
        });
    };

    /**
     * 3. INTERSECTION OBSERVER API (RECURSO AVANÇADO)
     * Detecta dinamicamente qual seção está na tela e adiciona feedback visual no menu.
     */
    const setupScrollObserver = () => {
        const sections = document.querySelectorAll('.apresentacao, .movies-section');
        const navButtons = document.querySelectorAll('.nav-btn[data-tooltip]');

        const observerOptions = {
            root: null, // Usa a viewport do navegador
            rootMargin: '-20% 0px -60% 0px', // Ativa quando a seção ocupa a área central da tela
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const isHome = entry.target.classList.contains('apresentacao');
                    
                    navButtons.forEach(button => {
                        const tooltip = button.getAttribute('data-tooltip');
                        
                        // Validação cruzada para iluminar o botão do menu correspondente
                        const isMatch = 
                            (isHome && tooltip === 'Início') ||
                            (id === 'title-box-office' && tooltip === 'Maiores Bilheterias') ||
                            (id === 'title-top-rated' && tooltip === 'Mais Bem Avaliados') ||
                            (id === 'title-popular-br' && tooltip === 'Mais Assistidos no Brasil') ||
                            (id === 'title-trending' && tooltip === 'Filmes em Alta') ||
                            (id === 'title-upcoming' && tooltip === 'Próximos Lançamentos');

                        if (isMatch) {
                            button.classList.add('active-nav');
                        } else {
                            button.classList.remove('active-nav');
                        }
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));
    };

    /**
     * 4. GERENCIAMENTO DE TEMA (DARK/LIGHT MODE)
     */
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const isLight = document.body.classList.toggle('light-theme');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
        }
    };

    // Inicialização dos módulos do ecossistema do App
    initTheme();
    setupNavigation();
    setupScrollObserver();

    const settingsToggle = document.getElementById('settingsToggle');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    // Função para abrir o painel
    const openSettings = () => {
        settingsModal.classList.add('active');
        settingsModal.setAttribute('aria-hidden', 'false');
    };

    // Função para fechar o painel
    const closeSettingsPanel = () => {
        settingsModal.classList.remove('active');
        settingsModal.setAttribute('aria-hidden', 'true');
    };

    // Ouvintes de eventos
    if (settingsToggle) settingsToggle.addEventListener('click', openSettings);
    if (closeSettings) closeSettings.addEventListener('click', closeSettingsPanel);

    // Fecha o painel ao clicar fora da caixa do conteúdo
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsPanel();
    });

    // Salva as configurações de programação no navegador
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const apiUrl = document.getElementById('apiUrlInput').value.trim();
            const maxCards = document.getElementById('maxCardsSelect').value;
            const debugMode = document.getElementById('debugModeCheckbox').checked;

            localStorage.setItem('metrica_api_url', apiUrl);
            localStorage.setItem('metrica_max_cards', maxCards);
            localStorage.setItem('metrica_debug', debugMode);

            closeSettingsPanel();
            window.location.reload(); // Recarrega a página para aplicar
        });
    }

    async function fetchMovies(url) {
        try {
            const response = await fetch(url, FETCH_OPTIONS);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error(`Falha ao buscar dados: ${url}`, error);
            return [];
        }
    }

    function renderSection(movies, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.removeAttribute('data-loading');

        if (movies.length === 0) {
            container.innerHTML = '<p style="color: var(--texto); opacity: 0.5; padding: 15px;">Não foi possível carregar os filmes.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();

        movies.slice(0, 10).forEach(movie => {
            const card = document.createElement('article');
            card.classList.add('movie-card');

            const posterPath = movie.poster_path 
            ? `${IMAGE_URL}${movie.poster_path}` 
            : 'https://placehold.co/500x750/1c1c1e/ffffff?text=Sem+Poster';

            card.innerHTML = `
                <img src="${posterPath}" alt="Pôster do filme ${movie.title}" loading="lazy">
                <h3>${movie.title}</h3>
            `;

            fragment.appendChild(card);
        });

        container.appendChild(fragment);
    }

    
    async function initApp() {
        const [boxOffice, topRated, popularBr, trending, upcoming] = await Promise.all([
            fetchMovies(ENDPOINTS.boxOffice),
            fetchMovies(ENDPOINTS.topRated),
            fetchMovies(ENDPOINTS.popularBr),
            fetchMovies(ENDPOINTS.trending),
            fetchMovies(ENDPOINTS.upcoming)
        ]);

        renderSection(boxOffice, 'box-office-list');
        renderSection(topRated, 'top-rated-list');
        renderSection(popularBr, 'popular-br-list');
        renderSection(trending, 'trending-list');
        renderSection(upcoming, 'upcoming-list');
    }

    initApp();
});