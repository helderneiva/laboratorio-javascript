import {
    ENDPOINTS,
    FETCH_OPTIONS,
    IMAGE_URL,
    BASE_URL,
    MAX_CARDS,
    DEBUG,
    DEFAULT_MAX_CARDS,
    STORAGE_KEYS,
    lerStorage,
    gravarStorage,
    removerStorage,
    normalizarUrlApi
} from './config.js';

const raiz = document.documentElement;
const POSTER_VAZIO = 'https://placehold.co/500x750/1c1c1e/ffffff?text=Sem+Poster';

const log = (...args) => {
    if (DEBUG) console.log('[Métrica Cine]', ...args);
};

const prefereMenosMovimento = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function configurarMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.floating-nav');
    if (!menuToggle || !nav) return () => {};

    const definirMenu = (aberto) => {
        nav.classList.toggle('active', aberto);
        menuToggle.setAttribute('aria-expanded', String(aberto));
        menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');

        const icone = menuToggle.querySelector('i');
        if (icone) {
            icone.classList.toggle('fa-bars', !aberto);
            icone.classList.toggle('fa-xmark', aberto);
        }
    };

    menuToggle.addEventListener('click', () => {
        definirMenu(!nav.classList.contains('active'));
    });

    return definirMenu;
}

function configurarNavegacao(definirMenu) {
    const botoes = document.querySelectorAll('.nav-btn[data-alvo]');

    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            const alvo = document.querySelector(botao.dataset.alvo);
            if (!alvo) return;

            alvo.scrollIntoView({
                behavior: prefereMenosMovimento() ? 'auto' : 'smooth',
                block: 'start'
            });

            alvo.setAttribute('tabindex', '-1');
            alvo.focus({ preventScroll: true });

            definirMenu(false);
        });
    });
}

function configurarObservadorDeSecao() {
    const botoes = [...document.querySelectorAll('.nav-btn[data-alvo]')];
    const secoes = botoes
        .map(botao => document.querySelector(botao.dataset.alvo))
        .filter(Boolean);

    if (!('IntersectionObserver' in window) || secoes.length === 0) return;

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;

            const alvoAtual = `#${entrada.target.id}`;
            botoes.forEach(botao => {
                const ativo = botao.dataset.alvo === alvoAtual;
                botao.classList.toggle('active-nav', ativo);
                if (ativo) {
                    botao.setAttribute('aria-current', 'true');
                } else {
                    botao.removeAttribute('aria-current');
                }
            });
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    secoes.forEach(secao => observador.observe(secao));
}

function temaAtual() {
    if (raiz.dataset.theme) return raiz.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function configurarTema() {
    const botao = document.getElementById('themeToggle');
    if (!botao) return;

    botao.addEventListener('click', () => {
        const novoTema = temaAtual() === 'light' ? 'dark' : 'light';
        raiz.dataset.theme = novoTema;
        gravarStorage(STORAGE_KEYS.theme, novoTema);
        log('Tema alterado para', novoTema);
    });
}

function configurarPainelDeConfiguracoes() {
    const modal = document.getElementById('settingsModal');
    const btnAbrir = document.getElementById('settingsToggle');
    const btnFechar = document.getElementById('closeSettings');
    const btnSalvar = document.getElementById('saveSettingsBtn');
    const btnRestaurar = document.getElementById('resetSettingsBtn');
    const inputUrl = document.getElementById('apiUrlInput');
    const selectMax = document.getElementById('maxCardsSelect');
    const checkDebug = document.getElementById('debugModeCheckbox');
    const erro = document.getElementById('settingsErro');

    if (!modal || !btnAbrir) return;

    const mostrarErro = (mensagem) => {
        erro.textContent = mensagem;
        erro.hidden = !mensagem;
    };

    const abrir = () => {
        inputUrl.value = BASE_URL;
        selectMax.value = String(MAX_CARDS);
        checkDebug.checked = DEBUG;
        mostrarErro('');

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        inputUrl.focus();
    };

    const fechar = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        btnAbrir.focus();
    };

    btnAbrir.addEventListener('click', abrir);
    btnFechar.addEventListener('click', fechar);

    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) fechar();
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && modal.classList.contains('active')) fechar();
    });

    btnSalvar.addEventListener('click', () => {
        const url = normalizarUrlApi(inputUrl.value);
        if (!url) {
            mostrarErro('Informe uma URL válida que comece com https://');
            inputUrl.focus();
            return;
        }

        gravarStorage(STORAGE_KEYS.apiUrl, url);
        gravarStorage(STORAGE_KEYS.maxCards, selectMax.value);
        gravarStorage(STORAGE_KEYS.debug, String(checkDebug.checked));

        window.location.reload(); 
    });

    btnRestaurar.addEventListener('click', () => {
        removerStorage(STORAGE_KEYS.apiUrl);
        removerStorage(STORAGE_KEYS.maxCards);
        removerStorage(STORAGE_KEYS.debug);
        window.location.reload();
    });
}


async function buscarFilmes(url) {
    try {
        const resposta = await fetch(url, FETCH_OPTIONS);
        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

        const dados = await resposta.json();
        log('Resposta de', url, dados);
        return dados.results || [];
    } catch (erro) {
        console.error(`Falha ao buscar dados: ${url}`, erro);
        return [];
    }
}

function criarCard(filme) {
    const titulo = filme.title || filme.name || 'Sem título';

    const card = document.createElement('article');
    card.classList.add('movie-card');

    const img = document.createElement('img');
    img.src = filme.poster_path ? `${IMAGE_URL}${filme.poster_path}` : POSTER_VAZIO;
    img.alt = `Pôster do filme ${titulo}`;
    img.width = 500;
    img.height = 750;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
        if (img.src !== POSTER_VAZIO) img.src = POSTER_VAZIO;
    }, { once: true });

    const h3 = document.createElement('h3');
    h3.textContent = titulo; 

    card.append(img, h3);
    return card;
}

function renderizarSecao(filmes, idContainer) {
    const container = document.getElementById(idContainer);
    if (!container) return;

    container.removeAttribute('data-loading');
    container.replaceChildren();

    if (filmes.length === 0) {
        const aviso = document.createElement('p');
        aviso.className = 'mensagem-vazia';
        aviso.textContent = 'Não foi possível carregar os filmes. Tente recarregar a página.';
        container.appendChild(aviso);
        return;
    }

    const fragmento = document.createDocumentFragment();
    filmes.slice(0, MAX_CARDS).forEach(filme => fragmento.appendChild(criarCard(filme)));
    container.appendChild(fragmento);
}

function carregarSecoes() {
    const secoes = [
        { endpoint: ENDPOINTS.boxOffice, container: 'box-office-list' },
        { endpoint: ENDPOINTS.topRated, container: 'top-rated-list' },
        { endpoint: ENDPOINTS.popularBr, container: 'popular-br-list' },
        { endpoint: ENDPOINTS.trending, container: 'trending-list' },
        { endpoint: ENDPOINTS.upcoming, container: 'upcoming-list' }
    ];

    secoes.forEach(async ({ endpoint, container }) => {
        renderizarSecao(await buscarFilmes(endpoint), container);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    log('Configuração em uso:', { BASE_URL, MAX_CARDS, DEBUG, padrao: DEFAULT_MAX_CARDS });

    const definirMenu = configurarMenu();
    configurarNavegacao(definirMenu);
    configurarObservadorDeSecao();
    configurarTema();
    configurarPainelDeConfiguracoes();
    carregarSecoes();
});