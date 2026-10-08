export const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTkyY2MzYjRlZjNkZTIzM2I2MWJiYmU0OWRiYWQ1OSIsIm5iZiI6MTc5MDQ0NDQzOC4yODE5OTk4LCJzdWIiOiI2YWI4MDM5NjAxNTRhYWQ1N2VhZGE1YzciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-EzFkKXcjPyor-xa-6ux7C9WtSRP4pPDOGavtiV-8ps';

export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export const ENDPOINTS = {
    boxOffice: `${BASE_URL}/discover/movie?sort_by=revenue.desc&language=pt-BR`,
    topRated: `${BASE_URL}/movie/top_rated?language=pt-BR&page=1`,
    popularBr: `${BASE_URL}/discover/movie?certification_country=BR&sort_by=popularity.desc&language=pt-BR`,
    trending: `${BASE_URL}/trending/movie/week?language=pt-BR`,
    upcoming: `${BASE_URL}/movie/upcoming?language=pt-BR&page=1`
};

export const FETCH_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_TOKEN}`
    }
};