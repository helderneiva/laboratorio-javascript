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
    normalizarUrlApi,
    urlBusca,
    urlDetalhe
} from './config.js';

const raiz = document.documentElement;
const POSTER_VAZIO = 'https://placehold.co/500x750/1c1c1e/ffffff?text=Sem+Poster';
const TEMPO_CACHE_MS = 10 * 60 * 1000;   // 10 minutos
const ATRASO_BUSCA_MS = 400;             // debounce da busca
const MIN_CARACTERES_BUSCA = 2;
const MAX_RESULTADOS = 20;
const MSG_VAZIO_PADRAO = 'Nenhum filme para exibir.';

const log = (...args) => {
    if (DEBUG) console.log('[Métrica Cine]', ...args);
};

const prefereMenosMovimento = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   Menu e navegação
   ========================================================= */
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

/* =========================================================
   Tema
   ========================================================= */
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

/* =========================================================
   Painel de configurações
   ========================================================= */
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
            mostrarErro('Informe uma URL https válida do TMDB (api.themoviedb.org).');
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

/* =========================================================
   Cache (sessionStorage)
   ========================================================= */
const PREFIXO_CACHE = 'metrica_cache2:';

function lerCache(url) {
    try {
        const bruto = sessionStorage.getItem(PREFIXO_CACHE + url);
        if (!bruto) return null;
        const { quando, dados } = JSON.parse(bruto);
        return Date.now() - quando < TEMPO_CACHE_MS ? dados : null;
    } catch {
        return null;
    }
}

function gravarCache(url, dados) {
    try {
        sessionStorage.setItem(PREFIXO_CACHE + url, JSON.stringify({ quando: Date.now(), dados }));
    } catch { /* cache é opcional */ }
}

/* =========================================================
   Camada de API com erros classificados
   ========================================================= */
class ErroApi extends Error {
    constructor(tipo, status) {
        super(tipo);
        this.tipo = tipo;
        this.status = status;
    }
}

function mensagemDeErro(erro) {
    switch (erro?.tipo) {
        case 'auth':
            return 'A chave de acesso da API é inválida ou está ausente (erro 401). Verifique o config.js.';
        case 'limite':
            return 'Muitas requisições em pouco tempo (erro 429). Aguarde um instante e tente de novo.';
        case 'offline':
            return 'Você parece estar sem conexão com a internet.';
        case 'naoencontrado':
            return 'Filme não encontrado.';
        case 'rede':
            return 'Não foi possível falar com o servidor. Verifique sua conexão.';
        default:
            return 'Não foi possível carregar os dados. Tente novamente.';
    }
}

async function buscarJson(url, { signal, usarCache = true } = {}) {
    if (usarCache) {
        const emCache = lerCache(url);
        if (emCache) {
            log('Cache usado para', url);
            return emCache;
        }
    }

    let resposta;
    try {
        resposta = await fetch(url, { ...FETCH_OPTIONS, signal });
    } catch (erro) {
        if (erro.name === 'AbortError') throw erro;   // cancelada de propósito
        throw new ErroApi(navigator.onLine ? 'rede' : 'offline');
    }

    if (!resposta.ok) {
        const tipo = ({ 401: 'auth', 404: 'naoencontrado', 429: 'limite' })[resposta.status] ?? 'http';
        throw new ErroApi(tipo, resposta.status);
    }

    let dados;
    try {
        dados = await resposta.json();
    } catch {
        throw new ErroApi('http', resposta.status);
    }

    log('Resposta de', url, dados);

    // Não guarda listas vazias em cache
    const listaVazia = Array.isArray(dados.results) && dados.results.length === 0;
    if (usarCache && !listaVazia) gravarCache(url, dados);

    return dados;
}

/* =========================================================
   Favoritos (localStorage)
   ========================================================= */
const favoritos = new Map(); // id -> resumo do filme

function carregarFavoritos() {
    favoritos.clear();
    try {
        const lista = JSON.parse(lerStorage(STORAGE_KEYS.favorites) || '[]');
        if (!Array.isArray(lista)) return;
        lista
            .filter(item => item && Number.isInteger(item.id))
            .forEach(item => favoritos.set(item.id, item));
    } catch {
        console.warn('Favoritos salvos estavam corrompidos e foram ignorados.');
    }
}

function salvarFavoritos() {
    gravarStorage(STORAGE_KEYS.favorites, JSON.stringify([...favoritos.values()]));
}

// Guarda só o necessário para desenhar o card
function resumirFilme(filme) {
    return {
        id: filme.id,
        title: filme.title || filme.name || 'Sem título',
        poster_path: filme.poster_path ?? null,
        release_date: filme.release_date ?? '',
        vote_average: filme.vote_average ?? 0
    };
}

function aplicarEstadoFavorito(botao) {
    const ativo = favoritos.has(Number(botao.dataset.id));
    const titulo = botao.dataset.titulo || 'filme';
    const texto = botao.querySelector('.fav-texto');
    const icone = botao.querySelector('i');

    botao.setAttribute('aria-pressed', String(ativo));

    if (texto) {
        texto.textContent = ativo ? 'Favoritado' : 'Favoritar';
    } else {
        botao.setAttribute('aria-label', ativo
            ? `Remover ${titulo} dos favoritos`
            : `Adicionar ${titulo} aos favoritos`);
    }

    if (icone) {
        icone.classList.toggle('fa-solid', ativo);
        icone.classList.toggle('fa-regular', !ativo);
    }
}

function atualizarCoracoes() {
    document.querySelectorAll('.card-fav, .detalhe-fav').forEach(aplicarEstadoFavorito);
}

function alternarFavorito(filme) {
    if (!Number.isInteger(filme.id)) return;

    if (favoritos.has(filme.id)) {
        favoritos.delete(filme.id);
    } else {
        favoritos.set(filme.id, resumirFilme(filme));
    }

    salvarFavoritos();
    atualizarCoracoes();
    renderizarFavoritos();
}

function criarBotaoFavorito(filme, { comTexto = false } = {}) {
    const titulo = filme.title || filme.name || 'Sem título';

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = comTexto ? 'detalhe-fav' : 'card-fav';
    botao.dataset.id = String(filme.id);
    botao.dataset.titulo = titulo;

    const icone = document.createElement('i');
    icone.className = 'fa-regular fa-heart';
    icone.setAttribute('aria-hidden', 'true');
    botao.appendChild(icone);

    if (comTexto) {
        const texto = document.createElement('span');
        texto.className = 'fav-texto';
        botao.appendChild(texto);
    }

    botao.addEventListener('click', () => alternarFavorito(filme));
    aplicarEstadoFavorito(botao);
    return botao;
}

function renderizarFavoritos() {
    const container = document.getElementById('favoritos-list');
    const contagem = document.getElementById('favoritos-contagem');
    if (!container) return;

    const lista = [...favoritos.values()].reverse(); // mais recentes primeiro
    if (contagem) contagem.textContent = lista.length ? `(${lista.length})` : '';

    renderizarLista(
        container,
        lista,
        lista.length,
        'Você ainda não favoritou nenhum filme. Clique no ♥ de um pôster para salvá-lo aqui.'
    );
}

// Mantém várias abas sincronizadas
function configurarSincronizacaoDeFavoritos() {
    window.addEventListener('storage', (evento) => {
        if (evento.key !== STORAGE_KEYS.favorites) return;
        carregarFavoritos();
        atualizarCoracoes();
        renderizarFavoritos();
    });
}

/* =========================================================
   Renderização de cards, skeleton e erros
   ========================================================= */
function criarCard(filme) {
    const titulo = filme.title || filme.name || 'Sem título';

    const card = document.createElement('article');
    card.className = 'movie-card';

    const abrir = document.createElement('button');
    abrir.type = 'button';
    abrir.className = 'card-abrir';
    abrir.setAttribute('aria-label', `Ver detalhes de ${titulo}`);

    const img = document.createElement('img');
    img.src = filme.poster_path ? `${IMAGE_URL}${filme.poster_path}` : POSTER_VAZIO;
    img.alt = '';                       // o botão já tem o nome acessível
    img.width = 500;
    img.height = 750;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
        if (img.src !== POSTER_VAZIO) img.src = POSTER_VAZIO;
    }, { once: true });

    const nome = document.createElement('span');
    nome.className = 'movie-titulo';
    nome.textContent = titulo;

    abrir.append(img, nome);

    const ano = (filme.release_date || '').slice(0, 4);
    const nota = filme.vote_average ? filme.vote_average.toFixed(1) : '';
    const textoMeta = [ano, nota && `★ ${nota}`].filter(Boolean).join(' · ');

    if (textoMeta) {
        const meta = document.createElement('span');
        meta.className = 'movie-meta';
        meta.textContent = textoMeta;
        abrir.appendChild(meta);
    }

    abrir.addEventListener('click', () => abrirDetalhes(filme.id, titulo));

    card.append(criarBotaoFavorito(filme), abrir);
    return card;
}

function mostrarSkeleton(container, quantidade = MAX_CARDS) {
    container.setAttribute('aria-busy', 'true');

    const fragmento = document.createDocumentFragment();
    for (let i = 0; i < quantidade; i++) {
        const esqueleto = document.createElement('div');
        esqueleto.className = 'movie-card skeleton';
        esqueleto.setAttribute('aria-hidden', 'true');

        const poster = document.createElement('div');
        poster.className = 'skeleton-poster';

        const linhaLonga = document.createElement('div');
        linhaLonga.className = 'skeleton-linha';

        const linhaCurta = document.createElement('div');
        linhaCurta.className = 'skeleton-linha curta';

        esqueleto.append(poster, linhaLonga, linhaCurta);
        fragmento.appendChild(esqueleto);
    }
    container.replaceChildren(fragmento);
}

function renderizarLista(container, filmes, limite, mensagemVazia = MSG_VAZIO_PADRAO) {
    container.removeAttribute('aria-busy');
    container.replaceChildren();

    if (!Array.isArray(filmes) || filmes.length === 0) {
        const aviso = document.createElement('p');
        aviso.className = 'mensagem-vazia';
        aviso.textContent = mensagemVazia;
        container.appendChild(aviso);
        return;
    }

    const fragmento = document.createDocumentFragment();
    filmes.slice(0, limite).forEach(filme => fragmento.appendChild(criarCard(filme)));
    container.appendChild(fragmento);
}

function criarBlocoDeErro(erro, aoTentarNovamente) {
    const bloco = document.createElement('div');
    bloco.className = 'estado-erro';
    bloco.setAttribute('role', 'alert');

    const texto = document.createElement('p');
    texto.textContent = mensagemDeErro(erro);

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'btn-tentar';
    botao.textContent = 'Tentar novamente';
    botao.addEventListener('click', aoTentarNovamente);

    bloco.append(texto, botao);
    return bloco;
}

function renderizarErro(container, erro, aoTentarNovamente) {
    container.removeAttribute('aria-busy');
    container.replaceChildren(criarBlocoDeErro(erro, aoTentarNovamente));
}

/* =========================================================
   Seções (listas da home)
   ========================================================= */
const SECOES = [
    { endpoint: ENDPOINTS.boxOffice, container: 'box-office-list' },
    { endpoint: ENDPOINTS.topRated, container: 'top-rated-list' },
    { endpoint: ENDPOINTS.popularBr, container: 'popular-br-list' },
    { endpoint: ENDPOINTS.trending, container: 'trending-list' },
    { endpoint: ENDPOINTS.upcoming, container: 'upcoming-list' }
];

async function carregarSecao(secao) {
    const container = document.getElementById(secao.container);
    if (!container) return;

    mostrarSkeleton(container);

    try {
        const dados = await buscarJson(secao.endpoint);
        renderizarLista(
            container,
            dados.results || [],
            MAX_CARDS,
            'Nenhum filme encontrado nesta seção.'
        );
    } catch (erro) {
        console.error(`Falha ao carregar ${secao.container}:`, erro);
        renderizarErro(container, erro, () => carregarSecao(secao));
    }
}

function carregarSecoes() {
    SECOES.forEach(carregarSecao);
}

/* =========================================================
   Busca com debounce + AbortController
   ========================================================= */
function configurarBusca() {
    const input = document.getElementById('campo-busca');
    const form = document.getElementById('form-busca');
    const btnLimpar = document.getElementById('limpar-busca');
    const secao = document.getElementById('resultados');
    const lista = document.getElementById('resultados-list');
    const titulo = document.getElementById('titulo-resultados');
    if (!input || !form || !secao || !lista || !titulo) return;

    let temporizador = null;
    let controlador = null;

    const esconderResultados = () => {
        clearTimeout(temporizador);
        controlador?.abort();
        secao.hidden = true;
        lista.replaceChildren();
    };

    const buscar = async (termo) => {
        controlador?.abort();                 // cancela a busca anterior ainda em andamento
        controlador = new AbortController();
        const { signal } = controlador;

        secao.hidden = false;
        titulo.textContent = `Resultados para “${termo}”`;
        mostrarSkeleton(lista, 10);

        try {
            const dados = await buscarJson(urlBusca(termo), { signal });
            if (signal.aborted) return;
            renderizarLista(
                lista,
                dados.results || [],
                MAX_RESULTADOS,
                `Nenhum filme encontrado para “${termo}”.`
            );
        } catch (erro) {
            if (erro.name === 'AbortError' || signal.aborted) return;
            console.error('Falha na busca:', erro);
            renderizarErro(lista, erro, () => buscar(termo));
        }
    };

    input.addEventListener('input', () => {
        clearTimeout(temporizador);
        const termo = input.value.trim();
        btnLimpar.hidden = input.value === '';

        if (termo.length < MIN_CARACTERES_BUSCA) {
            esconderResultados();
            return;
        }
        temporizador = setTimeout(() => buscar(termo), ATRASO_BUSCA_MS);
    });

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        clearTimeout(temporizador);
        const termo = input.value.trim();
        if (termo.length >= MIN_CARACTERES_BUSCA) buscar(termo);
    });

    btnLimpar.addEventListener('click', () => {
        input.value = '';
        btnLimpar.hidden = true;
        esconderResultados();
        input.focus();
    });
}

/* =========================================================
   Modal de detalhes do filme
   ========================================================= */
let controladorDetalhe = null;

function formatarDuracao(minutos) {
    if (!minutos) return '';
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return horas ? `${horas}h ${resto}min` : `${resto}min`;
}

function criarTituloDetalhe(texto) {
    const h2 = document.createElement('h2');
    h2.id = 'detalheTitulo';
    h2.textContent = texto;
    return h2;
}

function criarBlocoDeTexto(rotulo, texto) {
    const bloco = document.createElement('div');
    bloco.className = 'detalhe-bloco';

    const h3 = document.createElement('h3');
    h3.className = 'detalhe-rotulo';
    h3.textContent = rotulo;

    const p = document.createElement('p');
    p.textContent = texto;

    bloco.append(h3, p);
    return bloco;
}

function criarDetalheCarregando(titulo) {
    const detalhe = document.createElement('div');
    detalhe.className = 'detalhe';
    detalhe.setAttribute('aria-busy', 'true');

    const poster = document.createElement('div');
    poster.className = 'skeleton-poster detalhe-poster';

    const info = document.createElement('div');
    info.className = 'detalhe-info';
    info.appendChild(criarTituloDetalhe(titulo));

    ['', '', 'curta'].forEach(extra => {
        const linha = document.createElement('div');
        linha.className = `skeleton-linha ${extra}`.trim();
        info.appendChild(linha);
    });

    detalhe.append(poster, info);
    return detalhe;
}

function criarDetalheComErro(titulo, erro, aoTentarNovamente) {
    const bloco = document.createElement('div');
    bloco.className = 'detalhe-erro';
    bloco.append(criarTituloDetalhe(titulo), criarBlocoDeErro(erro, aoTentarNovamente));
    return bloco;
}

function criarDetalhe(filme) {
    const titulo = filme.title || filme.name || 'Sem título';

    const detalhe = document.createElement('div');
    detalhe.className = 'detalhe';

    const img = document.createElement('img');
    img.className = 'detalhe-poster';
    img.src = filme.poster_path ? `${IMAGE_URL}${filme.poster_path}` : POSTER_VAZIO;
    img.alt = `Pôster do filme ${titulo}`;
    img.width = 500;
    img.height = 750;
    img.addEventListener('error', () => {
        if (img.src !== POSTER_VAZIO) img.src = POSTER_VAZIO;
    }, { once: true });

    const info = document.createElement('div');
    info.className = 'detalhe-info';
    info.appendChild(criarTituloDetalhe(titulo));

    if (filme.tagline) {
        const frase = document.createElement('p');
        frase.className = 'detalhe-tagline';
        frase.textContent = filme.tagline;
        info.appendChild(frase);
    }

    const ano = (filme.release_date || '').slice(0, 4);
    const nota = filme.vote_average ? `★ ${filme.vote_average.toFixed(1)}` : '';
    const textoMeta = [ano, formatarDuracao(filme.runtime), nota].filter(Boolean).join(' · ');
    if (textoMeta) {
        const meta = document.createElement('p');
        meta.className = 'detalhe-meta';
        meta.textContent = textoMeta;
        info.appendChild(meta);
    }

    if (Array.isArray(filme.genres) && filme.genres.length) {
        const generos = document.createElement('ul');
        generos.className = 'detalhe-generos';
        filme.genres.forEach(genero => {
            const li = document.createElement('li');
            li.textContent = genero.name;
            generos.appendChild(li);
        });
        info.appendChild(generos);
    }

    info.appendChild(criarBlocoDeTexto('Sinopse', filme.overview || 'Sinopse não disponível em português.'));

    const elenco = (filme.credits?.cast ?? []).slice(0, 6).map(pessoa => pessoa.name).filter(Boolean);
    if (elenco.length) {
        info.appendChild(criarBlocoDeTexto('Elenco principal', elenco.join(', ')));
    }

    const acoes = document.createElement('div');
    acoes.className = 'detalhe-acoes';
    acoes.appendChild(criarBotaoFavorito(filme, { comTexto: true }));

    const trailer = (filme.videos?.results ?? []).find(v => v.site === 'YouTube' && v.type === 'Trailer');
    if (trailer?.key) {
        const link = document.createElement('a');
        link.className = 'btn-trailer';
        link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Assistir trailer';
        acoes.appendChild(link);
    }

    info.appendChild(acoes);
    detalhe.append(img, info);
    return detalhe;
}

async function abrirDetalhes(id, tituloInicial = 'Carregando...') {
    const modal = document.getElementById('detalheModal');
    const corpo = document.getElementById('detalheCorpo');
    if (!modal || !corpo || !Number.isInteger(id)) return;

    controladorDetalhe?.abort();
    controladorDetalhe = new AbortController();
    const { signal } = controladorDetalhe;

    corpo.replaceChildren(criarDetalheCarregando(tituloInicial));
    if (!modal.open) modal.showModal();

    try {
        const filme = await buscarJson(urlDetalhe(id), { signal });
        if (signal.aborted) return;
        corpo.replaceChildren(criarDetalhe(filme));
    } catch (erro) {
        if (erro.name === 'AbortError' || signal.aborted) return;
        console.error('Falha ao carregar detalhes:', erro);
        corpo.replaceChildren(
            criarDetalheComErro(tituloInicial, erro, () => abrirDetalhes(id, tituloInicial))
        );
    }
}

function configurarDetalhes() {
    const modal = document.getElementById('detalheModal');
    const corpo = document.getElementById('detalheCorpo');
    const btnFechar = document.getElementById('fecharDetalhe');
    if (!modal || !corpo) return;

    btnFechar?.addEventListener('click', () => modal.close());

    // Clique no fundo (o próprio <dialog>) fecha
    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) modal.close();
    });

    // Ao fechar: cancela requisição pendente e limpa o conteúdo
    modal.addEventListener('close', () => {
        controladorDetalhe?.abort();
        corpo.replaceChildren();
    });
}

/* =========================================================
   Inicialização
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    log('Configuração em uso:', { BASE_URL, MAX_CARDS, DEBUG, padrao: DEFAULT_MAX_CARDS });

    carregarFavoritos();

    const definirMenu = configurarMenu();
    configurarNavegacao(definirMenu);
    configurarObservadorDeSecao();
    configurarTema();
    configurarPainelDeConfiguracoes();
    configurarDetalhes();
    configurarBusca();
    configurarSincronizacaoDeFavoritos();

    renderizarFavoritos();
    carregarSecoes();
});