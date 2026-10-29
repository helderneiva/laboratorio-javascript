const links = [
  ...document.querySelectorAll('.indice-subgeneros a[href^="#"]')
];

const pares = links.map(link => ({
  link,
  secao: document.getElementById(link.hash.slice(1))
})).filter(item => item.secao);

function mostrarNaBarra(link) {
  const lista = link.closest('ul');

  if (!lista || lista.scrollWidth <= lista.clientWidth) return;

  const item = link.getBoundingClientRect();
  const barra = lista.getBoundingClientRect();

  lista.scrollLeft +=
    item.left -
    barra.left -
    (barra.width - item.width) / 2;
}

let agendado = false;
let atual = null;

function atualizar() {
  agendado = false;

  const faixa = window.innerHeight * 0.3;

  const visiveis = pares.filter(item =>
    !item.secao.hidden
  );

  let escolhido = null;

  for (const item of visiveis) {
    const caixa = item.secao.getBoundingClientRect();

    if (caixa.top <= faixa && caixa.bottom > 0) {
      escolhido = item;
    }
  }

  if (!escolhido) {
    escolhido = visiveis.find(item => {
      const caixa = item.secao.getBoundingClientRect();

      return (
        caixa.top >= 0 &&
        caixa.top < window.innerHeight
      );
    }) ?? null;
  }

  links.forEach(link => {
    if (link === escolhido?.link) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  if (escolhido && escolhido.link !== atual) {
    mostrarNaBarra(escolhido.link);
  }

  atual = escolhido?.link ?? null;
}

function agendar() {
  if (agendado) return;

  agendado = true;
  requestAnimationFrame(atualizar);
}

if (pares.length) {
  window.addEventListener('scroll', agendar, {
    passive: true
  });

  window.addEventListener('resize', agendar);
  window.addEventListener('pageshow', agendar);

  document.addEventListener('museu:busca', agendar);

  agendar();
}