// Token de leitura da API do TMDB.
export const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTkyY2MzYjRlZjNkZTIzM2I2MWJiYmU0OWRiYWQ1OSIsIm5iZiI6MTc5MDQ0NDQzOC4yODE5OTk4LCJzdWIiOiI2YWI4MDM5NjAxNTRhYWQ1N2VhZGE1YzciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-EzFkKXcjPyor-xa-6ux7C9WtSRP4pPDOGavtiV-8ps';

export const DEFAULT_BASE_URL = 'https://api.themoviedb.org/3';
export const DEFAULT_MAX_CARDS = 10;
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export const STORAGE_KEYS = {
  theme: 'metrica_theme',
  apiUrl: 'metrica_api_url',
  maxCards: 'metrica_max_cards',
  debug: 'metrica_debug',
  favorites: 'metrica_favorites'
};

export function lerStorage(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
    return true;
  } catch {
    return false;
  }
}

export function removerStorage(chave) {
  try {
    localStorage.removeItem(chave);
  } catch {
    // O navegador pode bloquear o armazenamento.
  }
}

// Aceita somente a URL base oficial, sem parâmetros extras.
export function normalizarUrlApi(valor) {
  try {
    const url = new URL(String(valor ?? '').trim());
    const caminho = url.pathname.replace(/\/+$/, '');

    if (
      url.origin !== 'https://api.themoviedb.org' ||
      caminho !== '/3' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    return DEFAULT_BASE_URL;
  } catch {
    return null;
  }
}

const urlSalva = normalizarUrlApi(lerStorage(STORAGE_KEYS.apiUrl));
const maxSalvo = Number(lerStorage(STORAGE_KEYS.maxCards));

export const BASE_URL = urlSalva ?? DEFAULT_BASE_URL;

export const MAX_CARDS = [5, 10, 15, 20].includes(maxSalvo)
  ? maxSalvo
  : DEFAULT_MAX_CARDS;

export const DEBUG = lerStorage(STORAGE_KEYS.debug) === 'true';

const agora = new Date();

const HOJE = [
  agora.getFullYear(),
  String(agora.getMonth() + 1).padStart(2, '0'),
  String(agora.getDate()).padStart(2, '0')
].join('-');

export const ENDPOINTS = {
  boxOffice:
    `${BASE_URL}/discover/movie?sort_by=revenue.desc&language=pt-BR&page=1`,

  topRated:
    `${BASE_URL}/movie/top_rated?language=pt-BR&page=1`,

  popular:
    `${BASE_URL}/movie/popular?language=pt-BR&page=1`,

  trending:
    `${BASE_URL}/trending/movie/week?language=pt-BR`,

  upcoming:
    `${BASE_URL}/discover/movie?language=pt-BR&include_adult=false&primary_release_date.gte=${HOJE}&sort_by=popularity.desc&page=1`
};

export const urlBusca = termo =>
  `${BASE_URL}/search/movie?language=pt-BR&include_adult=false&page=1&query=${encodeURIComponent(termo)}`;

export const urlDetalhe = id =>
  `${BASE_URL}/movie/${encodeURIComponent(id)}?language=pt-BR&append_to_response=videos,credits&include_video_language=pt,en,null`;

export const FETCH_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
  }
};