// Ative o formulário no FormSubmit, copie o código alias que ele gera
// e cole no lugar de SEU_CODIGO_ALIAS (assim seu e-mail não fica exposto).
const ENDPOINT_CONTATO = 'https://formsubmit.co/ajax/SEU_CODIGO_ALIAS';

const URL_PROJETOS = 'dados/projetos.json'; // relativo ao index.html
const CHAVE_TEMA = 'laboratorio-tema';
const CLASSE_TEMA_CLARO = 'light-mode';
const LIMITE_CARROSSEL = 6; // acima disso, a grade vira carrossel
const GAP_CARDS = 24;

const reduzMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function normalizar(texto) {
  return String(texto ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function atualizarIcones() {
  if (window.lucide) window.lucide.createIcons();
  else console.warn('Lucide não foi carregado: os ícones não serão desenhados.');
}

function definirIconeTema(botao, nomeIcone) {
  const novo = document.createElement('i');
  novo.setAttribute('data-lucide', nomeIcone);
  const atual = botao.querySelector('[data-lucide], svg');
  if (atual) atual.replaceWith(novo);
  else botao.appendChild(novo);
  atualizarIcones();
}

function rotuloDaCategoria(slug) {
  const botao = document.querySelector(`.btn-filtro[data-categoria="${slug}"]`);
  return botao ? botao.textContent.trim() : slug;
}

/* ---------- Tema ---------- */
function configurarTema() {
  const raiz = document.documentElement;
  const btnTema = document.querySelector('.btn-tema');
  if (!btnTema) return;

  definirIconeTema(btnTema, raiz.classList.contains(CLASSE_TEMA_CLARO) ? 'sun' : 'moon-star');

  btnTema.addEventListener('click', () => {
    const claro = raiz.classList.toggle(CLASSE_TEMA_CLARO);
    definirIconeTema(btnTema, claro ? 'sun' : 'moon-star');
    try {
      localStorage.setItem(CHAVE_TEMA, claro ? 'light' : 'dark');
    } catch (erro) {
      console.warn('Não foi possível salvar o tema:', erro);
    }
  });
}

/* ---------- Barras de habilidade ---------- */
function rotuloDoNivel(nivel) {
  if (nivel < 50) return 'Básico';
  if (nivel < 75) return 'Intermediário';
  return 'Avançado';
}

function configurarBarras() {
  const barras = document.querySelectorAll('.progresso-interno');

  barras.forEach(barra => {
    const nivel = Number(barra.dataset.nivel) || 0;
    const titulo = barra.closest('.tech-item')?.querySelector('h3')?.textContent.trim() ?? 'Habilidade';
    const trilho = barra.parentElement;

    trilho.setAttribute('role', 'progressbar');
    trilho.setAttribute('aria-label', titulo);
    trilho.setAttribute('aria-valuemin', '0');
    trilho.setAttribute('aria-valuemax', '100');
    trilho.setAttribute('aria-valuenow', String(nivel));
    trilho.setAttribute('aria-valuetext', rotuloDoNivel(nivel));

    const rotulo = document.createElement('span');
    rotulo.className = 'tech-nivel';
    rotulo.textContent = rotuloDoNivel(nivel);
    trilho.after(rotulo);
  });

  const animar = (barra) => { barra.style.width = `${Number(barra.dataset.nivel) || 0}%`; };

  if (!('IntersectionObserver' in window) || reduzMovimento()) {
    barras.forEach(animar);
    return;
  }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      animar(entrada.target);
      obs.unobserve(entrada.target);
    });
  }, { threshold: 0.4 });

  barras.forEach(barra => observador.observe(barra));
}

/* ---------- Modal (<dialog> nativo) ---------- */
function abrirModal(titulo, conteudo, opcoes = {}) {
  const modal = document.getElementById('modal');
  const corpo = document.getElementById('modal-corpo');
  if (!modal || !corpo) return;

  modal.querySelector('.modal-conteudo').classList.toggle('modal-largo', Boolean(opcoes.largo));
  corpo.replaceChildren();

  if (titulo) {
    const h2 = document.createElement('h2');
    h2.id = 'modal-titulo';
    h2.textContent = titulo;
    corpo.appendChild(h2);
  }

  if (conteudo instanceof Node) {
    corpo.appendChild(conteudo);
  } else if (conteudo) {
    const p = document.createElement('p');
    p.textContent = conteudo;
    corpo.appendChild(p);
  }

  if (!modal.open) modal.showModal();
}

function configurarModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;

  document.getElementById('btn-fechar-modal')?.addEventListener('click', () => modal.close());

  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) modal.close();
  });

  // limpa o conteúdo (e para o iframe) ao fechar
  modal.addEventListener('close', () => {
    document.getElementById('modal-corpo')?.replaceChildren();
  });
}

function abrirProjetoNoModal(titulo, url) {
  const bloco = document.createElement('div');

  const moldura = document.createElement('iframe');
  moldura.className = 'modal-iframe';
  moldura.src = url;
  moldura.title = titulo;

  const novaAba = document.createElement('a');
  novaAba.className = 'card-link';
  novaAba.href = url;
  novaAba.target = '_blank';
  novaAba.rel = 'noopener noreferrer';
  novaAba.textContent = 'Abrir em nova aba';

  bloco.append(moldura, novaAba);
  abrirModal(titulo, bloco, { largo: true });
}

/* ---------- Cards ---------- */
function criarImagemDoCard(item, titulo) {
  const moldura = document.createElement('div');
  moldura.className = 'card-imagem';

  const img = document.createElement('img');
  img.src = item.imagem;
  img.alt = item.imagemAlt || `Captura de tela do projeto ${titulo}`;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 640;
  img.height = 360;

  // Se o arquivo não existir, mostra um espaço reservado em vez de ícone quebrado
  img.addEventListener('error', () => {
    img.remove();
    moldura.classList.add('sem-imagem');
    moldura.setAttribute('role', 'img');
    moldura.setAttribute('aria-label', `Sem imagem para ${titulo}`);
  }, { once: true });

  moldura.appendChild(img);
  return moldura;
}

function criarCard(item) {
  const titulo = item.titulo ?? 'Sem título';
  const categoria = normalizar(item.categoria);

  const card = document.createElement('article');
  card.className = 'card-projeto';
  card.dataset.categoria = categoria;

  if (item.imagem) card.appendChild(criarImagemDoCard(item, titulo));

  if (categoria) {
    const tag = document.createElement('span');
    tag.className = 'card-tag';
    tag.textContent = rotuloDaCategoria(categoria);
    card.appendChild(tag);
  }

  const h3 = document.createElement('h3');
  h3.textContent = titulo;
  card.appendChild(h3);

  if (item.descricao) {
    const p = document.createElement('p');
    p.textContent = item.descricao;
    card.appendChild(p);
  }

  if (Array.isArray(item.tecnologias) && item.tecnologias.length) {
    const lista = document.createElement('ul');
    lista.className = 'card-techs';
    item.tecnologias.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      lista.appendChild(li);
    });
    card.appendChild(lista);
  }

  if (item.detalhes) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card-link';
    btn.textContent = 'Ver detalhes';
    btn.addEventListener('click', () => abrirModal(titulo, item.detalhes));
    card.appendChild(btn);
  }

  if (item.link) {
    const a = document.createElement('a');
    a.className = 'card-link';
    a.href = item.link;
    a.textContent = 'Abrir projeto';
    a.addEventListener('click', (evento) => {
      if (evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
      evento.preventDefault();
      abrirProjetoNoModal(titulo, item.link);
    });
    card.appendChild(a);
  }

  if (item.repo) {
    const a = document.createElement('a');
    a.className = 'card-link card-link-sec';
    a.href = item.repo;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Ver código';
    card.appendChild(a);
  }

  return card;
}

function renderizarCards(lista) {
  const container = document.getElementById('grid-projetos');
  if (!container) return;

  container.removeAttribute('aria-busy');
  container.replaceChildren();

  if (!Array.isArray(lista) || lista.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'mensagem-vazia';
    vazio.textContent = 'Nenhum experimento para exibir ainda.';
    container.appendChild(vazio);
    return;
  }

  const fragmento = document.createDocumentFragment();
  lista.forEach(item => fragmento.appendChild(criarCard(item)));

  // Aviso exibido quando o filtro escolhido não tem nenhum projeto
  const aviso = document.createElement('p');
  aviso.id = 'filtro-vazio';
  aviso.className = 'mensagem-vazia';
  aviso.textContent = 'Nenhum experimento nesta categoria ainda. Novos projetos chegam em breve.';
  aviso.hidden = true;
  fragmento.appendChild(aviso);

  container.appendChild(fragmento);
}

function mostrarCarregando() {
  const container = document.getElementById('grid-projetos');
  if (!container) return;

  container.setAttribute('aria-busy', 'true');
  const p = document.createElement('p');
  p.className = 'mensagem-vazia';
  p.textContent = 'Carregando experimentos...';
  container.replaceChildren(p);
}

function mostrarErroDeCarga(aoTentarNovamente) {
  const container = document.getElementById('grid-projetos');
  if (!container) return;

  container.removeAttribute('aria-busy');

  const bloco = document.createElement('div');
  bloco.className = 'estado-erro';
  bloco.setAttribute('role', 'alert');

  const texto = document.createElement('p');
  texto.textContent = 'Não foi possível carregar os experimentos. Se você abriu o arquivo direto do computador, use um servidor local (como o Live Server).';

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'card-link';
  botao.textContent = 'Tentar novamente';
  botao.addEventListener('click', aoTentarNovamente);

  bloco.append(texto, botao);
  container.replaceChildren(bloco);
}

/* ---------- Dados (JSON via fetch) ---------- */
async function carregarProjetos() {
  const resposta = await fetch(URL_PROJETOS, { headers: { Accept: 'application/json' } });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

  const dados = await resposta.json();
  if (!Array.isArray(dados)) throw new Error('O JSON de projetos deve ser uma lista.');
  return dados;
}

/* ---------- Carrossel (liga sozinho acima do limite) ---------- */
function configurarCarrossel() {
  const secao = document.getElementById('painel-controle');
  const trilho = document.getElementById('grid-projetos');
  const anterior = document.getElementById('carrossel-anterior');
  const proximo = document.getElementById('carrossel-proximo');

  if (!secao || !trilho || !anterior || !proximo) {
    return { atualizar: () => {}, definirTotal: () => {} };
  }

  const comportamento = () => (reduzMovimento() ? 'auto' : 'smooth');

  const passo = () => {
    const card = [...trilho.querySelectorAll('.card-projeto')].find(c => c.style.display !== 'none');
    return card ? card.getBoundingClientRect().width + GAP_CARDS : 300;
  };

  const atualizar = () => {
    anterior.disabled = trilho.scrollLeft <= 1;
    proximo.disabled = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 1;
  };

  const definirTotal = (total) => {
    secao.classList.toggle('modo-carrossel', total > LIMITE_CARROSSEL);
    atualizar();
  };

  anterior.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: comportamento() }));
  proximo.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: comportamento() }));
  trilho.addEventListener('scroll', atualizar, { passive: true });
  window.addEventListener('resize', atualizar);
  atualizar();

  return { atualizar, definirTotal };
}

/* ---------- Filtros ---------- */
function configurarFiltros(aoFiltrar) {
  const botoes = document.querySelectorAll('.btn-filtro');
  const trilho = document.getElementById('grid-projetos');

  // Aplica o filtro que estiver ativo (também usado após carregar o JSON)
  const aplicar = () => {
    const ativo = document.querySelector('.btn-filtro.active');
    const valor = normalizar(ativo?.dataset.categoria);
    const mostrarTudo = valor === '' || valor === 'todos';

    let visiveis = 0;
    document.querySelectorAll('.card-projeto').forEach(card => {
      const visivel = mostrarTudo || card.dataset.categoria === valor;
      card.style.display = visivel ? '' : 'none';
      if (visivel) visiveis += 1;
    });

    const aviso = document.getElementById('filtro-vazio');
    if (aviso) aviso.hidden = visiveis > 0;

    trilho?.scrollTo({ left: 0 });
    aoFiltrar();
  };

  botoes.forEach(botao => {
    botao.setAttribute('aria-pressed', String(botao.classList.contains('active')));

    botao.addEventListener('click', () => {
      botoes.forEach(b => {
        const ativo = b === botao;
        b.classList.toggle('active', ativo);
        b.setAttribute('aria-pressed', String(ativo));
      });
      aplicar();
    });
  });

  return aplicar;
}

/* ---------- Formulário ---------- */
function configurarFormulario() {
  const form = document.getElementById('form-contato');
  if (!form) return;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const campos = Object.fromEntries(new FormData(form));
    if (campos._honey) return; // robô: ignora em silêncio

    const botao = form.querySelector('.btn-enviar');
    const textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Transmitindo...';

    try {
      const resposta = await fetch(ENDPOINT_CONTATO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...campos,
          _subject: 'Nova mensagem do Laboratório JavaScript',
          _template: 'table'
        })
      });

      const resultado = await resposta.json();
      if (!resposta.ok || String(resultado.success) !== 'true') {
        throw new Error(resultado.message || `HTTP ${resposta.status}`);
      }

      form.reset();
      abrirModal('Mensagem enviada', 'Obrigado pelo contato! Responderei em breve.');
    } catch (erro) {
      console.error('Falha ao enviar o formulário:', erro);
      abrirModal('Não foi possível enviar', 'Tente novamente em instantes.');
    } finally {
      botao.disabled = false;
      botao.textContent = textoOriginal;
    }
  });
}

/* ---------- Inicialização ---------- */
configurarTema();
configurarBarras();
configurarModal();
configurarFormulario();

const carrossel = configurarCarrossel();
const aplicarFiltroAtual = configurarFiltros(carrossel.atualizar);

async function iniciarProjetos() {
  mostrarCarregando();

  try {
    const projetos = await carregarProjetos();
    renderizarCards(projetos);
    carrossel.definirTotal(projetos.length);
    aplicarFiltroAtual();
    atualizarIcones();
  } catch (erro) {
    console.error('Falha ao carregar os projetos:', erro);
    mostrarErroDeCarga(iniciarProjetos);
  }
}

atualizarIcones();
iniciarProjetos();