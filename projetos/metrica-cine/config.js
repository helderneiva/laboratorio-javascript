export const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTkyY2MzYjRlZjNkZTIzM2I2MWJiYmU0OWRiYWQ1OSIsIm5iZiI6MTc5MDQ0NDQzOC4yODE5OTk4LCJzdWIiOiI2YWI4MDM5NjAxNTRhYWQ1N2VhZGE1YzciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-EzFkKXcjPyor-xa-6ux7C9WtSRP4pPDOGavtiV-8ps';

export const DEFAULT_BASE_URL = 'https://api.themoviedb.org/3';
export const DEFAULT_MAX_CARDS = 10;
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export const STORAGE_KEYS = {
    theme: 'theme',
    apiUrl: 'metrica_api_url',
    maxCards: 'metrica_max_cards',
    debug: 'metrica_debug'
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
        if (url.protocol !== 'https:') return null;
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

export const FETCH_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_TOKEN}`
    }
};