// Cole aqui o NOVO token ("Token de Leitura da API") gerado no painel do TMDB.
// O token antigo foi exposto e deve ser revogado no TMDB.
export const TMDB_TOKEN = 'COLE_AQUI_SEU_NOVO_TOKEN';

export const DEFAULT_BASE_URL = 'https://api.themoviedb.org/3';
export const DEFAULT_MAX_CARDS = 10;
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Só estes hosts recebem o token (evita vazamento via URL personalizada)
const HOSTS_PERMITIDOS = ['api.themoviedb.org'];

export const STORAGE_KEYS = {
    theme: 'metrica_theme',
    apiUrl: 'metrica_api_url',
    maxCards: 'metrica_max_cards',
    debug: 'metrica_debug',
    favorites: 'metrica_favorites'
};

export function lerStorage(chave) {
    try { return localStorage.getItem(chave); } catch { return null; }
}

export function gravarStorage(chave, valor) {
    try { localStorage.setItem(chave, valor); return true; } catch { return false; }
}

export function removerStorage(chave) {
    try { localStorage.removeItem(chave); } catch { /* ignora */ }
}

export function normalizarUrlApi(valor) {
    try {
        const url = new URL(String(valor ?? '').trim());
        if (url.protocol !== 'https:' || !HOSTS_PERMITIDOS.includes(url.hostname)) return null;
        return url.href.replace(/\/+$/, '');
    } catch {
        return null;
    }
}

const urlSalva = normalizarUrlApi(lerStorage(STORAGE_KEYS.apiUrl));
const maxSalvo = Number.parseInt(lerStorage(STORAGE_KEYS.maxCards), 10);

export const BASE_URL = urlSalva ?? DEFAULT_BASE_URL;
export const MAX_CARDS = Number.isInteger(maxSalvo) && maxSalvo > 0 && maxSalvo <= 20
    ? maxSalvo
    : DEFAULT_MAX_CARDS;
export const DEBUG = lerStorage(STORAGE_KEYS.debug) === 'true';

const HOJE = new Date().toLocaleDateString('sv-SE');

export const ENDPOINTS = {
    boxOffice: `${BASE_URL}/discover/movie?sort_by=revenue.desc&language=pt-BR&page=1`,
    topRated: `${BASE_URL}/movie/top_rated?language=pt-BR&page=1`,
    popularBr: `${BASE_URL}/movie/popular?language=pt-BR&region=BR&page=1`,
    trending: `${BASE_URL}/trending/movie/week?language=pt-BR`,
    upcoming: `${BASE_URL}/discover/movie?language=pt-BR&include_adult=false&primary_release_date.gte=${HOJE}&sort_by=popularity.desc&page=1`
};

// Busca por título (o termo é codificado para não quebrar a URL)
export const urlBusca = (termo) =>
    `${BASE_URL}/search/movie?language=pt-BR&include_adult=false&page=1&query=${encodeURIComponent(termo)}`;

// Detalhes + vídeos + elenco numa única requisição
export const urlDetalhe = (id) =>
    `${BASE_URL}/movie/${encodeURIComponent(id)}?language=pt-BR&append_to_response=videos,credits&include_video_language=pt,en,null`;

export const FETCH_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_TOKEN}`
    }
};