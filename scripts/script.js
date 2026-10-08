const ENDPOINT_CONTATO = 'https://formsubmit.co/ajax/helderneiva07@gmail.com';

const CHAVE_TEMA = 'laboratorio-tema';
const CLASSE_TEMA_CLARO = 'light-mode'; 
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
    console.warn('Lucide não foi carregado: os ícones não serão desenhados.');
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
  const botao = document.querySelector(`.btn-filtro[data-categoria="${slug}"]`);
  return botao ? botao.textContent.trim() : slug;
}

function animarBarrasProgresso() {
  const barras = document.querySelectorAll('.progresso-interno');

  barras.forEach(barra => {
    const techItem = barra.closest('.tech-item');
    if (!techItem) return;

    
    const estiloInline = barra.getAttribute('style') || '';
    const correspondencia = estiloInline.match(/width:\s*(\d+(?:\.\d+)?%)/);

    let larguraAlvo = '0%';

    if (correspondencia) {
      larguraAlvo = correspondencia[1];
    } else {
      // Contingência, caso o style inline seja removido do HTML
      const h3 = techItem.querySelector('h3');
      const titulo = h3 ? h3.textContent.trim() : '';
      const valores = {
        'JS (ES6+)': '85%',
        'Manipulação DOM': '90%',
        'AJAX': '75%',
        'Async (Promises / APIs)': '80%',
        'Data (Estruturas e Storage)': '70%',
        'Lógica Pura': '95%'
      };
      larguraAlvo = valores[titulo] || '50%';
    }

    
    barra.style.width = '0%';
    setTimeout(() => {
      barra.style.width = larguraAlvo;
    }, 150);
  });
}


function configurarNavegacaoEMenu() {
  const raiz = document.documentElement;
  const linksMenu = document.querySelectorAll('nav#menu ul li a:not(.btn-tema)');
  const btnTema = document.querySelector('nav#menu .btn-tema');

 
  linksMenu.forEach(link => {
    link.addEventListener('click', (evento) => {
      const idAlvo = link.getAttribute('href');
      if (!idAlvo || !idAlvo.startsWith('#') || idAlvo.length < 2) return;

      const secaoAlvo = document.querySelector(idAlvo);
      if (!secaoAlvo) return;

      evento.preventDefault();
      secaoAlvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  
  const modoClaroInicial = raiz.classList.contains(CLASSE_TEMA_CLARO);
  document.body.classList.toggle(CLASSE_TEMA_CLARO, modoClaroInicial);

  if (!btnTema) return;

  definirIconeTema(btnTema, modoClaroInicial ? 'sun' : 'moon-star');

  btnTema.addEventListener('click', (evento) => {
    evento.preventDefault();
    const claro = raiz.classList.toggle(CLASSE_TEMA_CLARO);
    document.body.classList.toggle(CLASSE_TEMA_CLARO, claro);

    definirIconeTema(btnTema, claro ? 'sun' : 'moon-star');

    try {
      localStorage.setItem(CHAVE_TEMA, claro ? 'light' : 'dark');
    } catch (erro) {
      console.warn('Não foi possível salvar o tema:', erro);
    }
  });
}

let elementoAntesDoModal = null;
let limpezaModal = null; 

function abrirModal(titulo, conteudo, opcoes = {}) {
  const modal = document.getElementById('modal-container');
  const corpo = document.getElementById('modal-corpo');
  if (!modal || !corpo) return;

  const caixa = modal.querySelector('.modal-conteudo');
  if (caixa) caixa.classList.toggle('modal-largo', Boolean(opcoes.largo));

  corpo.replaceChildren();

  if (titulo) {
    const h2 = document.createElement('h2');
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

  elementoAntesDoModal = document.activeElement;
  modal.classList.remove('modal-oculto');
  modal.classList.add('visivel');
  modal.setAttribute('aria-hidden', 'false');

  const btnFechar = document.getElementById('btn-fechar-modal');
  if (btnFechar) btnFechar.focus();
}

function fecharModal() {
  const modal = document.getElementById('modal-container');
  if (!modal) return;
  if (typeof limpezaModal === 'function') limpezaModal();
  limpezaModal = null;

  modal.classList.remove('visivel');
  modal.classList.add('modal-oculto');
  modal.setAttribute('aria-hidden', 'true');

  if (elementoAntesDoModal && typeof elementoAntesDoModal.focus === 'function') {
    elementoAntesDoModal.focus();
  }
  elementoAntesDoModal = null;

  
  setTimeout(() => {
    if (modal.classList.contains('visivel')) return;
    const corpo = document.getElementById('modal-corpo');
    if (corpo) corpo.replaceChildren();
  }, 350);
}

function configurarModal() {
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  const btnFechar = document.getElementById('btn-fechar-modal');
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);

  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) fecharModal();
  });

  
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && modal.classList.contains('visivel')) {
      fecharModal();
    }
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

function renderizarCards(lista) {
  const container = document.getElementById('grid-projetos');
  if (!container) {
    console.warn('Elemento #grid-projetos não encontrado no HTML.');
    return;
  }

  container.replaceChildren();

  if (!Array.isArray(lista) || lista.length === 0) {
    const vazio = document.createElement('p');
    vazio.textContent = 'Nenhum experimento para exibir ainda.';
    container.appendChild(vazio);
    return;
  }

  lista.forEach(item => {
    const titulo = item.titulo ?? 'Sem título';
    const categoria = normalizar(item.categoria);

    const card = document.createElement('article');
    card.className = 'card-projeto';
    card.dataset.categoria = categoria;

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

    if (item.detalhes) {
      const btnDetalhes = document.createElement('button');
      btnDetalhes.type = 'button';
      btnDetalhes.className = 'card-link';
      btnDetalhes.textContent = 'Ver detalhes';
      btnDetalhes.addEventListener('click', () => abrirModal(titulo, item.detalhes));
      card.appendChild(btnDetalhes);
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
  container.appendChild(card);
});

}

function configurarFiltros() {
  const botoes = document.querySelectorAll('.btn-filtro');
  if (botoes.length === 0) return;

  botoes.forEach(botao => {
    botao.setAttribute('aria-pressed', String(botao.classList.contains('active')));

    botao.addEventListener('click', () => {
      const valor = normalizar(botao.dataset.categoria);
      const mostrarTudo = valor === '' || valor === 'todos';

      botoes.forEach(b => {
        const ativo = b === botao;
        b.classList.toggle('active', ativo);
        b.setAttribute('aria-pressed', String(ativo));
      });

      document.querySelectorAll('.card-projeto').forEach(card => {
        const visivel = mostrarTudo || card.dataset.categoria === valor;
        card.style.display = visivel ? '' : 'none';
      });
    });
  });
}

function configurarFormulario() {
  const form = document.getElementById('form-contato');
  if (!form) return;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // evita recarregar a página

    if (!ENDPOINT_CONTATO) {
      abrirModal(
        'Envio indisponível',
        'O formulário ainda não está conectado a um serviço de envio.'
      );
      return;
    }

    const botao = form.querySelector('.btn-enviar');
    const textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Transmitindo...';

    try {
      const campos = Object.fromEntries(new FormData(form));

      const resposta = await fetch(ENDPOINT_CONTATO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          ...campos,
          _subject: 'Nova mensagem do Laboratório JavaScript',
          _template: 'table',
          _captcha: 'false'
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

document.addEventListener('DOMContentLoaded', () => {
  configurarNavegacaoEMenu();
  animarBarrasProgresso();
  configurarModal();
  configurarFiltros();
  configurarFormulario();
  atualizarIcones();

  console.log('Experimentos:', meusExperimentos);
  renderizarCards(meusExperimentos);
});