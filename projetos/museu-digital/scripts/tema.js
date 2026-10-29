(function () {
  const CHAVE = 'tema-museu';
  const raiz = document.documentElement;

  const sistema = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  const Museu = window.Museu = window.Museu || {};

  const LUA =
    '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';

  const SOL =
    '<circle cx="12" cy="12" r="4.5"/>' +
    '<path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" ' +
    'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';

  function lerEscolha() {
    try {
      const valor = localStorage.getItem(CHAVE);

      return valor === 'claro' || valor === 'escuro'
        ? valor
        : null;
    } catch {
      return null;
    }
  }

  let escolha = lerEscolha();
  let atualizarBotao = () => {};

  const estaEscuro = () =>
    raiz.dataset.tema === 'escuro';

  function sincronizarCor() {
    const meta = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (!meta || !document.body) return;

    const fundo = getComputedStyle(document.body)
      .getPropertyValue('--fundo-principal')
      .trim();

    meta.content = estaEscuro() && fundo
      ? fundo
      : '#4A2E16';
  }

  Museu.sincronizarCor = sincronizarCor;

  function aplicar() {
    raiz.dataset.tema =
      escolha || (sistema.matches ? 'escuro' : 'claro');

    sincronizarCor();
    atualizarBotao();
  }

  aplicar();

  document.addEventListener('DOMContentLoaded', () => {
    const lista = document.querySelector('.menu ul');

    if (!lista) return;

    const botao = document.createElement('button');

    botao.type = 'button';
    botao.className = 'tema-toggle';

    botao.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"></svg>' +
      '<span class="tema-toggle-texto"></span>';

    atualizarBotao = () => {
      const escuro = estaEscuro();

      botao.querySelector('svg').innerHTML =
        escuro ? LUA : SOL;

      botao.querySelector('span').textContent =
        escuro ? 'Tema escuro' : 'Tema claro';

      botao.setAttribute(
        'aria-label',
        escuro
          ? 'Tema escuro ativo. Mudar para o tema claro.'
          : 'Tema claro ativo. Mudar para o tema escuro.'
      );

      sincronizarCor();
    };

    botao.addEventListener('click', () => {
      escolha = estaEscuro() ? 'claro' : 'escuro';

      aplicar();

      try {
        localStorage.setItem(CHAVE, escolha);
      } catch {
        // A escolha continua aplicada à página atual.
      }
    });

    const item = document.createElement('li');
    item.append(botao);
    lista.append(item);

    atualizarBotao();
  });

  sistema.addEventListener('change', () => {
    if (!escolha) aplicar();
  });

  window.addEventListener('storage', evento => {
    if (
      evento.key !== CHAVE &&
      evento.key !== null
    ) return;

    escolha = lerEscolha();
    aplicar();
  });

  window.addEventListener('pageshow', () => {
    escolha = lerEscolha();
    aplicar();
  });
})();