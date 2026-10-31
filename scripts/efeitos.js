(() => {
    'use strict';

    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cartao = document.getElementById('cartao-js');

    /* Giro do cartão */

    if (cartao) {
        const frente = document.getElementById('cartao-frente');
        const verso = document.getElementById('cartao-verso');

        function mostrarVerso(virado) {
            cartao.classList.toggle('esta-virado', virado);
            cartao.setAttribute('aria-pressed', String(virado));
            cartao.setAttribute('aria-label', virado ? 'Mostrar frente do cartão JavaScript' : 'Mostrar verso do cartão JavaScript');
            cartao.setAttribute('aria-describedby', virado ? 'cartao-verso' : 'cartao-frente');

            frente.setAttribute('aria-hidden', String(virado));
            verso.setAttribute('aria-hidden', String(!virado));

            frente.inert = virado;
            verso.inert = !virado;
        }

        cartao.addEventListener('click', () => {
            mostrarVerso(cartao.getAttribute('aria-pressed') !== 'true');
        });

        cartao.addEventListener('keydown', evento => {
            if (evento.key === 'Escape') {
                mostrarVerso(false);
            }
        });
    }

    /* Indicação da seção atual */

    const links = [...document.querySelectorAll('nav#menu a[href^="#"]')];
    const secoes = links.map(link => document.getElementById(link.hash.slice(1)));

    let atualizacaoPendente = false;

    function atualizarNavegacao() {
        atualizacaoPendente = false;

        const limite = (document.querySelector('.cabecalho')?.getBoundingClientRect().height || 80) + 32;
        let atual = 0;

        secoes.forEach((secao, indice) => {
            if (secao && secao.getBoundingClientRect().top <= limite) {
                atual = indice;
            }
        });

        const noFim = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;

        if (noFim && window.scrollY > 0) {
            atual = links.length - 1;
        }

        links.forEach((link, indice) => {
            const ativo = indice === atual;

            link.classList.toggle('ativo', ativo);

            if (ativo) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function agendarNavegacao() {
        if (atualizacaoPendente) {
            return;
        }

        atualizacaoPendente = true;
        requestAnimationFrame(atualizarNavegacao);
    }

    window.addEventListener('scroll', agendarNavegacao, { passive: true });
    window.addEventListener('resize', agendarNavegacao);
    window.addEventListener('load', agendarNavegacao, { once: true });

    if ('ResizeObserver' in window) {
        const observadorTamanho = new ResizeObserver(agendarNavegacao);

        document.querySelectorAll('main > section').forEach(secao => {
            observadorTamanho.observe(secao);
        });
    }

    agendarNavegacao();

    /* Preparação das barras */

    const barras = [];
    const animacoes = new Set();

    document.querySelectorAll('meter.habilidade-barra').forEach(medidor => {
        if (medidor.parentElement.classList.contains('barra-neon')) {
            return;
        }

        const intervalo = medidor.max - medidor.min;
        const percentual = intervalo > 0 ? ((medidor.value - medidor.min) / intervalo) * 100 : 0;
        const limite = Math.min(100, Math.max(0, percentual));

        const trilho = document.createElement('div');
        trilho.className = 'barra-neon';

        const preenchimento = document.createElement('span');
        preenchimento.className = 'barra-neon-preenchimento';
        preenchimento.setAttribute('aria-hidden', 'true');

        medidor.before(trilho);
        trilho.append(medidor, preenchimento);

        barras.push({
            trilho,
            preenchimento,
            largura: `${limite}%`
        });
    });

    function preencher(barra) {
        barra.preenchimento.style.width = barra.largura;

        if (movimentoReduzido.matches || typeof barra.preenchimento.animate !== 'function') {
            return;
        }

        const animacao = barra.preenchimento.animate(
            [{ width: '0%' }, { width: barra.largura }],
            {
                duration: 1400,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            }
        );

        animacoes.add(animacao);

        animacao.onfinish = () => animacoes.delete(animacao);
        animacao.oncancel = () => animacoes.delete(animacao);
    }

    if ('IntersectionObserver' in window && !movimentoReduzido.matches) {
        const porElemento = new Map(barras.map(barra => [barra.trilho, barra]));

        const observador = new IntersectionObserver(entradas => {
            entradas.forEach(entrada => {
                if (!entrada.isIntersecting) {
                    return;
                }

                preencher(porElemento.get(entrada.target));
                observador.unobserve(entrada.target);
            });
        }, {
            threshold: 0.5
        });

        barras.forEach(barra => observador.observe(barra.trilho));

        movimentoReduzido.addEventListener('change', evento => {
            if (!evento.matches) {
                return;
            }

            observador.disconnect();

            barras.forEach(barra => {
                barra.preenchimento.style.width = barra.largura;
            });

            animacoes.forEach(animacao => animacao.cancel());
        });
    } else {
        barras.forEach(preencher);
    }
})();