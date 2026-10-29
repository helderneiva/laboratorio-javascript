export const CHAVE_LIDOS = 'museu-lidos';
export const EVENTO_LEITURA = 'museu:leitura';

export function criar(tag, classe = '', texto) {
  const elemento = document.createElement(tag);

  if (classe) elemento.className = classe;

  if (texto !== undefined && texto !== null) {
    elemento.textContent = String(texto);
  }

  return elemento;
}

export function ler(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
    return true;
  } catch {
    return false;
  }
}

export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function urlPoema(id) {
  return 'poema.html?id=' + encodeURIComponent(id);
}

/* ---------- Leituras ---------- */

export function lidos() {
  try {
    const lista = JSON.parse(ler(CHAVE_LIDOS) || '[]');

    if (!Array.isArray(lista)) return [];

    return [...new Set(
      lista.filter(id =>
        typeof id === 'string' && id.trim()
      )
    )];
  } catch {
    return [];
  }
}

export function marcarLido(id, marcado) {
  if (typeof id !== 'string' || !id.trim()) return false;

  const lista = lidos().filter(item => item !== id);

  if (marcado) lista.push(id);

  const salvou = gravar(CHAVE_LIDOS, JSON.stringify(lista));

  if (salvou) {
    window.dispatchEvent(new Event(EVENTO_LEITURA));
  }

  return salvou;
}

export function observarLeitura(atualizar) {
  window.addEventListener(EVENTO_LEITURA, atualizar);
  window.addEventListener('pageshow', atualizar);

  window.addEventListener('storage', evento => {
    if (
      evento.key === CHAVE_LIDOS ||
      evento.key === null
    ) {
      atualizar();
    }
  });
}

export function atualizarLidos(raiz = document) {
  const marcados = new Set(lidos());

  raiz.querySelectorAll('.card[data-id]').forEach(card => {
    const selo = card.querySelector('.selo-lido');

    if (selo) {
      selo.hidden = !marcados.has(card.dataset.id);
    }
  });
}

/* ---------- Cards ---------- */

export function criarCard(obra) {
  const card = criar('li', 'card');

  card.dataset.id = obra.id;
  card.dataset.genero = obra.genero;
  card.dataset.busca = normalizar(
    [obra.titulo, obra.autor, obra.resumo].join(' ')
  );

  const titulo = criar('h3');
  const link = criar('a', '', obra.titulo);

  link.href = urlPoema(obra.id);
  titulo.append(link);

  card.append(
    titulo,
    criar('p', 'autor', obra.autor),
    criar('p', '', obra.resumo)
  );

  if (obra.dominioPublico === false) {
    card.append(
      criar('span', 'status', 'Obra protegida · leitura externa')
    );
  } else if (obra.formato === 'prosa') {
    card.append(
      criar('span', 'status', 'Obra em prosa')
    );
  } else if (obra.tipo === 'coletanea') {
    card.append(
      criar('span', 'status', 'Coletânea de poemas')
    );
  }

  const rodape = criar('div', 'card-rodape');
  const acao = criar('span', 'card-acao', 'Ver obra →');

  acao.setAttribute('aria-hidden', 'true');

  const selo = criar('span', 'selo-lido', '✓ Lido');
  selo.hidden = !lidos().includes(obra.id);

  rodape.append(acao, selo);
  card.append(rodape);

  return card;
}