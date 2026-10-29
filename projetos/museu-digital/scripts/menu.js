const menu = document.getElementById('menu-principal');

if (menu) {
  const botao = document.createElement('button');

  botao.type = 'button';
  botao.className = 'menu-toggle';
  botao.setAttribute('aria-controls', menu.id);

  const icone = document.createElement('span');
  icone.className = 'menu-toggle-icone';
  icone.setAttribute('aria-hidden', 'true');

  botao.append(icone);
  menu.before(botao);

  const telaMovel = window.matchMedia('(max-width: 64rem)');

  const estaAberto = () =>
    botao.getAttribute('aria-expanded') === 'true';

  const definirEstado = aberto => {
    botao.setAttribute('aria-expanded', String(aberto));

    botao.setAttribute(
      'aria-label',
      aberto ? 'Fechar menu' : 'Abrir menu'
    );
  };

  definirEstado(false);

  botao.addEventListener('click', () => {
    definirEstado(!estaAberto());
  });

  document.addEventListener('keydown', evento => {
    if (
      evento.key === 'Escape' &&
      telaMovel.matches &&
      estaAberto()
    ) {
      definirEstado(false);
      botao.focus();
    }
  });

  menu.addEventListener('click', evento => {
    const link = evento.target.closest('a');

    if (
      !link ||
      !telaMovel.matches ||
      evento.ctrlKey ||
      evento.metaKey ||
      evento.shiftKey ||
      evento.altKey
    ) return;

    const destino = new URL(link.href, location.href);

    definirEstado(false);

    const mesmaPagina =
      destino.pathname === location.pathname &&
      destino.search === location.search;

    if (mesmaPagina && destino.hash) {
      const alvo = document.getElementById(
        decodeURIComponent(destino.hash.slice(1))
      );

      if (alvo) {
        alvo.setAttribute('tabindex', '-1');
        alvo.focus({ preventScroll: true });
        return;
      }
    }

    botao.focus({ preventScroll: true });
  });

  telaMovel.addEventListener('change', () => {
    const focoNoMenu = menu.contains(document.activeElement);
    const focoNoBotao = document.activeElement === botao;

    definirEstado(false);

    if (telaMovel.matches && focoNoMenu) {
      botao.focus();
    }

    if (!telaMovel.matches && focoNoBotao) {
      menu.querySelector('a')?.focus();
    }
  });
}