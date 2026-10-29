// Formulário de contato.
const ENDPOINT_CONTATO = 'https://api.web3forms.com/submit';
const CHAVE_WEB3FORMS = 'c7cf2255-d721-43ea-b511-99223d434514';

// Configurações do laboratório.
const URL_PROJETOS = 'dados/projetos.json';
const CHAVE_TEMA = 'laboratorio-tema';
const CLASSE_TEMA_CLARO = 'light-mode';
const LIMITE_CARROSSEL = 6;

const reduzMovimento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function normalizar(texto) {
  return String(texto ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function atualizarIcones() {
  if (window.lucide) {
    window.lucide.createIcons();
  } else {
    console.warn('Lucide não foi carregado.');
  }
}

function definirIconeTema(botao, nomeIcone) {
  const novo = document.createElement('i');
  novo.setAttribute('data-lucide', nomeIcone);

  const atual = botao.querySelector('[data-lucide], svg');

  if (atual) {
    atual.replaceWith(novo);
  } else {
    botao.appendChild(novo);
  }

  atualizarIcones();
}

function rotuloDaCategoria(slug) {
  const botoes = [...document.querySelectorAll('.btn-filtro')];
  const botao = botoes.find(item => item.dataset.categoria === slug);

  return botao ? botao.textContent.trim() : slug;
}

/* ---------- Tema ---------- */

function configurarTema() {
  const raiz = document.documentElement;
  const botao = document.querySelector('.btn-tema');

  if (!botao) return;

  const atualizar = () => {
    const claro = raiz.classList.contains(CLASSE_TEMA_CLARO);

    definirIconeTema(botao, claro ? 'sun' : 'moon-star');
    botao.setAttribute(
      'aria-label',
      claro ? 'Ativar tema escuro' : 'Ativar tema claro'
    );
  };

  atualizar();

  botao.addEventListener('click', () => {
    const claro = raiz.classList.toggle(CLASSE_TEMA_CLARO);

    atualizar();

    try {
      localStorage.setItem(CHAVE_TEMA, claro ? 'light' : 'dark');
    } catch (erro) {
      console.warn('Não foi possível salvar o tema:', erro);
    }
  });
}

/* ---------- Habilidades ---------- */

function rotuloDoNivel(nivel) {
  if (nivel < 50) return 'Básico';
  if (nivel < 75) return 'Intermediário';

  return 'Avançado';
}

function configurarBarras() {
  const barras = document.querySelectorAll('.progresso-interno');

  barras.forEach(barra => {
    const nivel = Math.min(
      100,
      Math.max(0, Number(barra.dataset.nivel) || 0)
    );

    barra.dataset.nivel = String(nivel);

    const titulo = barra
      .closest('.tech-item')
      ?.querySelector('h3')
      ?.textContent.trim() ?? 'Habilidade';

    const trilho = barra.parentElement;

    trilho.setAttribute('role', 'meter');
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

  const animar = barra => {
    barra.style.width = `${barra.dataset.nivel}%`;
  };

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

/* ---------- Modal ---------- */

function abrirModal(titulo, conteudo, opcoes = {}) {
  const modal = document.getElementById('modal');
  const corpo = document.getElementById('modal-corpo');

  if (!modal || !corpo) return;

  modal.querySelector('.modal-conteudo').classList.toggle(
    'modal-largo',
    Boolean(opcoes.largo)
  );

  corpo.replaceChildren();

  const h2 = document.createElement('h2');
  h2.id = 'modal-titulo';
  h2.textContent = titulo || 'Informações';

  corpo.appendChild(h2);

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

  document.getElementById('btn-fechar-modal')
    ?.addEventListener('click', () => modal.close());

  modal.addEventListener('click', evento => {
    if (evento.target === modal) modal.close();
  });

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
  img.alt = item.imagemAlt || `Capa do projeto ${titulo}`;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 640;
  img.height = 360;

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

  if (item.imagem) {
    card.appendChild(criarImagemDoCard(item, titulo));
  }

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

    item.tecnologias.forEach(tecnologia => {
      const li = document.createElement('li');
      li.textContent = tecnologia;

      lista.appendChild(li);
    });

    card.appendChild(lista);
  }

  if (item.detalhes) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'card-link';
    botao.textContent = 'Ver detalhes';

    botao.addEventListener('click', () => {
      abrirModal(titulo, item.detalhes);
    });

    card.appendChild(botao);
  }

  if (item.link) {
    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = item.link;
    link.textContent = 'Abrir projeto';

    link.addEventListener('click', evento => {
      if (
        evento.ctrlKey ||
        evento.metaKey ||
        evento.shiftKey ||
        evento.altKey
      ) return;

      evento.preventDefault();
      abrirProjetoNoModal(titulo, item.link);
    });

    card.appendChild(link);
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

  const aviso = document.createElement('p');
  aviso.id = 'filtro-vazio';
  aviso.className = 'mensagem-vazia';
  aviso.textContent =
    'Nenhum experimento nesta categoria ainda. Novos projetos chegam em breve.';
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
  texto.textContent =
    'Não foi possível carregar os experimentos. Confira sua conexão e abra o site por um servidor local, como o Live Server.';

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'card-link';
  botao.textContent = 'Tentar novamente';
  botao.addEventListener('click', aoTentarNovamente);

  bloco.append(texto, botao);
  container.replaceChildren(bloco);
}

/* ---------- Dados ---------- */

async function carregarProjetos() {
  const resposta = await fetch(URL_PROJETOS, {
    headers: { Accept: 'application/json' }
  });

  if (!resposta.ok) {
    throw new Error(`HTTP ${resposta.status}`);
  }

  const dados = await resposta.json();

  if (!Array.isArray(dados)) {
    throw new Error('O JSON de projetos deve ser uma lista.');
  }

  if (dados.some(item => !item || typeof item !== 'object')) {
    throw new Error('Cada projeto deve ser um objeto válido.');
  }

  return dados;
}

/* ---------- Carrossel ---------- */

function configurarCarrossel() {
  const secao = document.getElementById('painel-controle');
  const trilho = document.getElementById('grid-projetos');
  const anterior = document.getElementById('carrossel-anterior');
  const proximo = document.getElementById('carrossel-proximo');

  if (!secao || !trilho || !anterior || !proximo) {
    return {
      atualizar: () => {},
      definirTotal: () => {}
    };
  }

  const comportamento = () =>
    reduzMovimento() ? 'auto' : 'smooth';

  const passo = () => {
    const card = [...trilho.querySelectorAll('.card-projeto')]
      .find(elemento => elemento.style.display !== 'none');

    const gap = parseFloat(
      getComputedStyle(trilho).columnGap
    ) || 0;

    return card
      ? card.getBoundingClientRect().width + gap
      : 300;
  };

  const atualizar = () => {
    anterior.disabled = trilho.scrollLeft <= 1;

    proximo.disabled =
      trilho.scrollLeft + trilho.clientWidth >=
      trilho.scrollWidth - 1;
  };

  const definirTotal = total => {
    secao.classList.toggle(
      'modo-carrossel',
      total > LIMITE_CARROSSEL
    );

    atualizar();
  };

  anterior.addEventListener('click', () => {
    trilho.scrollBy({
      left: -passo(),
      behavior: comportamento()
    });
  });

  proximo.addEventListener('click', () => {
    trilho.scrollBy({
      left: passo(),
      behavior: comportamento()
    });
  });

  trilho.addEventListener('scroll', atualizar, { passive: true });
  window.addEventListener('resize', atualizar);

  atualizar();

  return { atualizar, definirTotal };
}

/* ---------- Filtros ---------- */

function configurarFiltros(aoFiltrar) {
  const botoes = document.querySelectorAll('.btn-filtro');
  const trilho = document.getElementById('grid-projetos');

  const aplicar = () => {
    const ativo = document.querySelector('.btn-filtro.active');
    const valor = normalizar(ativo?.dataset.categoria);
    const mostrarTudo = valor === '' || valor === 'todos';

    let visiveis = 0;

    trilho?.querySelectorAll('.card-projeto').forEach(card => {
      const visivel =
        mostrarTudo || card.dataset.categoria === valor;

      card.style.display = visivel ? '' : 'none';

      if (visivel) visiveis += 1;
    });

    const aviso = document.getElementById('filtro-vazio');

    if (aviso) aviso.hidden = visiveis > 0;

    trilho?.scrollTo({ left: 0, behavior: 'instant' });

    // O carrossel depende dos cards visíveis após o filtro.
    aoFiltrar(visiveis);
  };

  botoes.forEach(botao => {
    botao.setAttribute(
      'aria-pressed',
      String(botao.classList.contains('active'))
    );

    botao.addEventListener('click', () => {
      botoes.forEach(outro => {
        const ativo = outro === botao;

        outro.classList.toggle('active', ativo);
        outro.setAttribute('aria-pressed', String(ativo));
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

  const botao = form.querySelector('.btn-enviar');

  if (!botao) return;

  let enviando = false;

  form.addEventListener('submit', async evento => {
    evento.preventDefault();

    if (enviando || !form.reportValidity()) return;

    const dados = new FormData(form);

    if (dados.has('botcheck')) return;

    const nome = String(dados.get('nome') ?? '').trim();
    const email = String(dados.get('email') ?? '').trim();
    const mensagem = String(dados.get('mensagem') ?? '').trim();

    if (!nome || !email || !mensagem) {
      abrirModal(
        'Verifique os campos',
        'Preencha nome, e-mail e mensagem.'
      );
      return;
    }

    const textoOriginal = botao.textContent;

    enviando = true;
    botao.disabled = true;
    botao.textContent = 'Enviando...';
    form.setAttribute('aria-busy', 'true');

    const controlador = new AbortController();
    const prazo = setTimeout(() => controlador.abort(), 20000);

    try {
      const resposta = await fetch(ENDPOINT_CONTATO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: CHAVE_WEB3FORMS,
          subject: 'Nova mensagem do Laboratório JavaScript',
          name: nome,
          email,
          message: mensagem
        }),
        signal: controlador.signal
      });

      const resultado = await resposta.json();

      if (!resposta.ok || resultado.success !== true) {
        throw new Error(
          resultado.message || `Erro HTTP ${resposta.status}`
        );
      }

      form.reset();

      abrirModal(
        'Mensagem enviada',
        'Obrigado pelo contato! Responderei em breve.'
      );
    } catch (erro) {
      console.error('Falha ao enviar o formulário:', erro);

      abrirModal(
        'Envio não confirmado',
        'Não foi possível confirmar o envio. Seus campos foram preservados.'
      );
    } finally {
      clearTimeout(prazo);

      enviando = false;
      botao.disabled = false;
      botao.textContent = textoOriginal;
      form.removeAttribute('aria-busy');
    }
  });
}

/* ---------- Inicialização ---------- */

configurarTema();
configurarBarras();
configurarModal();
configurarFormulario();

const carrossel = configurarCarrossel();
const aplicarFiltroAtual = configurarFiltros(carrossel.definirTotal);

async function iniciarProjetos() {
  mostrarCarregando();

  try {
    const projetos = await carregarProjetos();

    renderizarCards(projetos);
    aplicarFiltroAtual();
    atualizarIcones();
  } catch (erro) {
    console.error('Falha ao carregar os projetos:', erro);
    mostrarErroDeCarga(iniciarProjetos);
  }
}

atualizarIcones();
iniciarProjetos();