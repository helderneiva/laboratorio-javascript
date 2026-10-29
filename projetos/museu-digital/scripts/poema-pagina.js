import {
  criar,
  ler,
  gravar,
  lidos,
  marcarLido,
  urlPoema,
  observarLeitura
} from './util.js';

import { POEMAS } from '../dados/poemas.js';

const NOMES = {
  lirico: 'Lírico',
  satirico: 'Satírico',
  cordel: 'Cordel'
};

const TAMANHOS = [1, 1.15, 1.3, 1.5, 1.7];
const TAMANHO_PADRAO = 1;
const CHAVE_TAMANHO = 'museu-tamanho';

const area = document.getElementById('poema');

function criarSeta(simbolo) {
  const seta = criar('span', '', simbolo);
  seta.setAttribute('aria-hidden', 'true');

  return seta;
}

function mostrarNaoEncontrado() {
  document.title =
    'Obra não encontrada | Museu da Poesia Digital';

  const aviso = criar(
    'p',
    '',
    'Não encontramos essa obra. '
  );

  const voltar = criar('a', '', 'Voltar para o início');
  voltar.href = 'index.html';

  aviso.append(voltar);

  area.replaceChildren(
    criar('h1', 'poema-titulo', 'Obra não encontrada'),
    aviso
  );
}

function definirMeta(seletor, valor) {
  const meta = document.querySelector(seletor);

  if (meta) meta.setAttribute('content', valor);
}

/* ---------- Leitura ---------- */

function montarLeitura(obra) {
  if (obra.externo) {
    const link = criar(
      'a',
      'botao-leitura',
      obra.rotulo || 'Consultar a obra'
    );

    link.href = obra.externo;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    link.append(
      criar('span', 'visually-hidden', ' (abre em nova aba)')
    );

    const paragrafo = criar('p');
    paragrafo.append(link);

    const aviso = obra.dominioPublico === false
      ? 'Leitura externa: consulte a obra na fonte indicada.'
      : 'Consulte a obra na fonte indicada. Alguns destinos abrem livros completos ou acervos.';

    const partes = [
      criar('p', 'poema-nota', aviso),
      paragrafo
    ];

    if (obra.formato === 'prosa') {
      partes.unshift(
        criar(
          'p',
          'poema-nota',
          'Esta é uma obra em prosa, de ritmo e linguagem poéticos.'
        )
      );
    }

    if (obra.tipo === 'coletanea') {
      partes.unshift(
        criar(
          'p',
          'poema-nota',
          'Este registro apresenta uma coletânea de poemas.'
        )
      );
    }

    if (obra.resumo) {
      partes.unshift(
        criar('p', 'poema-resumo', obra.resumo)
      );
    }

    return partes;
  }

  if (obra.dominioPublico !== true) {
    return [
      criar(
        'p',
        'poema-nota',
        'A leitura desta obra ainda não está disponível neste site.'
      )
    ];
  }

  if (
    !Array.isArray(obra.versos) ||
    obra.versos.length === 0
  ) {
    return [
      criar(
        'p',
        'poema-nota',
        'O texto desta obra ainda não está disponível.'
      )
    ];
  }

  const versos = criar(
    'div',
    obra.figurado ? 'versos versos-figura' : 'versos'
  );

  if (obra.versos.length > 1) {
    versos.classList.add('numerado');
  }

  obra.versos.forEach(estrofe => {
    versos.append(criar('p', '', estrofe));
  });

  return [
    versos,
    criar(
      'p',
      'poema-fonte',
      'Fonte: ' + (obra.fonte || 'Fonte não informada.')
    )
  ];
}

/* ---------- Ferramentas ---------- */

function montarFerramentas(obra) {
  const barra = criar('div', 'ferramentas');

  barra.setAttribute('role', 'group');
  barra.setAttribute('aria-label', 'Ferramentas de leitura');

  const status = criar('p', 'ferramentas-status');
  status.setAttribute('role', 'status');

  const leituraInterna =
    !obra.externo &&
    Array.isArray(obra.versos) &&
    obra.versos.length > 0 &&
    obra.dominioPublico === true;

  if (leituraInterna) {
    const tamanhoSalvo = Number.parseInt(
      ler(CHAVE_TAMANHO),
      10
    );

    let posicao =
      Number.isInteger(tamanhoSalvo) &&
      tamanhoSalvo >= 0 &&
      tamanhoSalvo < TAMANHOS.length
        ? tamanhoSalvo
        : TAMANHO_PADRAO;

    const menos = criar('button', '', 'A−');
    const mais = criar('button', '', 'A+');

    menos.type = 'button';
    mais.type = 'button';

    menos.setAttribute('aria-label', 'Diminuir a letra');
    mais.setAttribute('aria-label', 'Aumentar a letra');

    const aplicar = salvar => {
      document.documentElement.style.setProperty(
        '--tamanho-versos',
        TAMANHOS[posicao] + 'em'
      );

      menos.disabled = posicao === 0;
      mais.disabled = posicao === TAMANHOS.length - 1;

      if (salvar) {
        const salvou = gravar(CHAVE_TAMANHO, String(posicao));

        if (!salvou) {
          status.textContent =
            'O tamanho foi alterado, mas não pôde ser salvo neste navegador.';
        }
      }
    };

    menos.addEventListener('click', () => {
      posicao = Math.max(0, posicao - 1);
      aplicar(true);
    });

    mais.addEventListener('click', () => {
      posicao = Math.min(
        TAMANHOS.length - 1,
        posicao + 1
      );

      aplicar(true);
    });

    aplicar(false);
    barra.append(menos, mais);
  }

  const compartilhar = criar(
    'button',
    '',
    'Compartilhar'
  );

  compartilhar.type = 'button';

  compartilhar.addEventListener('click', async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: obra.titulo,
          url
        });

        return;
      } catch (erro) {
        if (erro.name === 'AbortError') return;
      }
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Cópia indisponível');
      }

      await navigator.clipboard.writeText(url);
      status.textContent = 'Link copiado.';
    } catch {
      status.textContent = 'Copie este endereço: ' + url;
    }
  });

  const botaoLido = criar('button');
  botaoLido.type = 'button';

  const atualizarLido = () => {
    const marcado = lidos().includes(obra.id);

    botaoLido.setAttribute(
      'aria-pressed',
      String(marcado)
    );

    botaoLido.textContent = marcado
      ? 'Remover marca de leitura'
      : 'Marcar como lida';
  };

  atualizarLido();
  observarLeitura(atualizarLido);

  botaoLido.addEventListener('click', () => {
    const marcado = !lidos().includes(obra.id);
    const salvou = marcarLido(obra.id, marcado);

    if (!salvou) {
      status.textContent =
        'Não foi possível salvar a marca neste navegador.';
      return;
    }

    atualizarLido();

    status.textContent = marcado
      ? 'Obra marcada como lida.'
      : 'Marca de leitura removida.';
  });

  barra.append(compartilhar, botaoLido);

  return [barra, status];
}

/* ---------- Anterior e próximo ---------- */

function montarAnteriorProximo(obra) {
  const nav = document.getElementById('anterior-proximo');

  if (!nav) return;

  nav.replaceChildren();
  nav.hidden = true;

  const irmaos = POEMAS.filter(item =>
    item.genero === obra.genero &&
    item.sub === obra.sub
  );

  const posicao = irmaos.findIndex(item =>
    item.id === obra.id
  );

  const anterior = irmaos[posicao - 1];
  const proximo = irmaos[posicao + 1];

  if (!anterior && !proximo) return;

  const montar = (alvo, rel, partes) => {
    const link = criar('a');
    link.href = urlPoema(alvo.id);
    link.rel = rel;

    const rotulo = criar('small');
    rotulo.append(...partes);

    link.append(
      rotulo,
      document.createTextNode(alvo.titulo)
    );

    nav.append(link);
  };

  if (anterior) {
    montar(anterior, 'prev', [
      criarSeta('←'),
      document.createTextNode(' Anterior')
    ]);
  }

  if (proximo) {
    montar(proximo, 'next', [
      document.createTextNode('Próxima '),
      criarSeta('→')
    ]);
  }

  nav.hidden = false;
}

/* ---------- Continue lendo ---------- */

function montarMaisPoemas(obra) {
  const bloco = document.getElementById('mais-poemas');
  const titulo = document.getElementById('mais-poemas-titulo');

  if (!bloco || !titulo) return;

  const lista = bloco.querySelector('ul');

  if (!lista) return;

  lista.replaceChildren();
  bloco.hidden = true;

  const outros = POEMAS.filter(item =>
    item.genero === obra.genero &&
    item.sub === obra.sub &&
    item.id !== obra.id
  );

  if (!outros.length) return;

  titulo.textContent = 'Continue lendo: ' + obra.subnome;

  outros.forEach(outro => {
    const item = criar('li');
    const link = criar('a', '', outro.titulo);

    link.href = urlPoema(outro.id);
    item.append(link);
    lista.append(item);
  });

  bloco.hidden = false;
}

/* ---------- Inicialização ---------- */

if (area) {
  const id = new URLSearchParams(
    window.location.search
  ).get('id');

  const obra = POEMAS.find(item => item.id === id);

  if (!obra) {
    mostrarNaoEncontrado();
  } else {
    document.title =
      obra.titulo + ' | Museu da Poesia Digital';

    const autorCurto = obra.autor.split(' (')[0];

    const descricao =
      `${obra.titulo}, de ${autorCurto}. Conheça a obra no Museu da Poesia Digital.`;

    definirMeta('meta[name="description"]', descricao);
    definirMeta('meta[property="og:title"]', document.title);
    definirMeta('meta[property="og:description"]', descricao);

    document.body.dataset.genero = obra.genero;

    window.Museu?.sincronizarCor?.();

    const voltar = document.getElementById('voltar');

    if (voltar) {
      voltar.href =
        obra.genero + '.html#' + obra.sub;

      voltar.replaceChildren(
        criarSeta('←'),
        document.createTextNode(
          ' Voltar para ' + obra.subnome
        )
      );
    }

    area.replaceChildren(
      criar('h1', 'poema-titulo', obra.titulo),
      criar('p', 'poema-autor', obra.autor),
      criar(
        'p',
        'poema-tag',
        NOMES[obra.genero] + ' · ' + obra.subnome
      ),
      ...montarFerramentas(obra),
      ...montarLeitura(obra)
    );

    montarAnteriorProximo(obra);
    montarMaisPoemas(obra);
  }
}