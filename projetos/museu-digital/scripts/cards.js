import {
    criar,
    criarCard as criarCardBase,
    normalizar,
    atualizarLidos,
    lidos,
    urlPoema,
    observarLeitura
} from "./util.js";

import { POEMAS } from "../dados/poemas.js";

const genero = document.body.dataset.genero;

let atualizarProgresso = () => {};

function sortear(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

function temLeituraInterna(obra) {
    return (
        !obra.externo &&
        obra.dominioPublico === true &&
        Array.isArray(obra.versos) &&
        obra.versos.length > 0
    );
}

/*
 * Aproveita a criação do cartão já existente no util.js.
 * Acrescenta somente as informações da apresentação visual.
 */
function criarCard(obra) {
    const card = criarCardBase(obra);
    const interna = temLeituraInterna(obra);

    const identificacao = criar(
        "p",
        "card-categoria",
        obra.subnome
    );

    card.prepend(identificacao);

    const acao = card.querySelector(".card-acao");

    if (acao) {
        acao.textContent = interna
            ? "Ler no museu →"
            : "Ver fonte externa →";
    }

    const acesso = criar(
        "p",
        "card-acesso",
        interna
            ? "Texto disponível no museu"
            : "Leitura em fonte externa"
    );

    card.insertBefore(
        acesso,
        card.querySelector(".card-rodape")
    );

    return card;
}

/*
 * A história completa passa a ficar depois das obras.
 * Os textos explicativos de cada seleção tornam-se expansíveis.
 * Nenhum conteúdo histórico é apagado.
 */
function organizarContexto() {
    const historia = document.querySelector(".historia");

    if (historia) {
        const titulo = historia.querySelector("h2");

        const detalhes = criar(
            "details",
            "contexto-historico"
        );

        const resumo = criar(
            "summary",
            "",
            titulo?.textContent || "História desta tradição"
        );

        const conteudo = criar(
            "div",
            "contexto-conteudo"
        );

        /*
         * Conserva o identificador usado pelo aria-labelledby
         * da seção original.
         */
        if (titulo) {
            resumo.id = titulo.id;
        }

        while (historia.firstChild) {
            conteudo.append(historia.firstChild);
        }

        titulo?.remove();

        detalhes.append(resumo, conteudo);
        historia.replaceChildren(detalhes);

        const outrosGeneros = document.querySelector(
            ".outros-generos"
        );

        if (outrosGeneros) {
            outrosGeneros.before(historia);
        }
    }

    document.querySelectorAll(".secao-subgenero").forEach(secao => {
        const textos = [...secao.children].filter(elemento => {
            return (
                elemento.tagName === "P" &&
                !elemento.classList.contains("chamada-lista")
            );
        });

        if (!textos.length) {
            return;
        }

        const detalhes = criar(
            "details",
            "contexto-secao"
        );

        detalhes.append(
            criar("summary", "", "Sobre esta seleção")
        );

        textos.forEach(texto => {
            detalhes.append(texto);
        });

        const titulo = secao.querySelector("h2");

        if (titulo) {
            titulo.after(detalhes);
        }
    });
}

function montarListas() {
    const listas = document.querySelectorAll(
        ".lista-cards[data-sub]"
    );

    listas.forEach(lista => {
        const obras = POEMAS.filter(obra => {
            return (
                obra.genero === genero &&
                obra.sub === lista.dataset.sub
            );
        });

        lista.replaceChildren(...obras.map(criarCard));
    });
}

function montarContagens() {
    const links = document.querySelectorAll(
        '.indice-subgeneros a[href^="#"]'
    );

    links.forEach(link => {
        const sub = link.hash.slice(1);

        const total = POEMAS.filter(obra => {
            return obra.genero === genero && obra.sub === sub;
        }).length;

        if (!total) {
            return;
        }

        const contagem = criar(
            "span",
            "contagem",
            total
        );

        contagem.setAttribute("aria-hidden", "true");
        link.append(contagem);
    });
}

function montarBusca() {
    const bloco = document.getElementById("busca");
    const campo = document.getElementById("busca-campo");
    const status = document.getElementById("busca-status");

    if (!bloco || !campo || !status) {
        return;
    }

    const cards = [
        ...document.querySelectorAll(".lista-cards .card")
    ];

    const secoes = [
        ...document.querySelectorAll(".secao-subgenero")
    ];

    const links = [
        ...document.querySelectorAll(
            '.indice-subgeneros a[href^="#"]'
        )
    ];

    let avisoTimer;

    function aplicar() {
        const termo = normalizar(campo.value.trim());
        let total = 0;

        cards.forEach(card => {
            const corresponde = (
                !termo ||
                card.dataset.busca.includes(termo)
            );

            card.hidden = !corresponde;

            if (corresponde) {
                total++;
            }
        });

        secoes.forEach(secao => {
            const temResultado = secao.querySelector(
                ".card:not([hidden])"
            );

            secao.hidden = Boolean(termo) && !temResultado;
        });

        links.forEach(link => {
            const secao = document.getElementById(
                link.hash.slice(1)
            );

            if (link.parentElement) {
                link.parentElement.hidden = Boolean(secao?.hidden);
            }
        });

        document.documentElement.classList.toggle(
            "buscando",
            Boolean(termo)
        );

        document.dispatchEvent(
            new Event("museu:busca")
        );

        clearTimeout(avisoTimer);

        avisoTimer = setTimeout(() => {
            if (!termo) {
                status.textContent = "";
            } else if (total === 0) {
                status.textContent = "Nenhuma obra encontrada.";
            } else {
                const mensagem = total === 1
                    ? "obra encontrada"
                    : "obras encontradas";

                status.textContent = (
                    `${total} ${mensagem}. ` +
                    "Pressione Enter para ver."
                );
            }
        }, 400);
    }

    campo.addEventListener("input", aplicar);

    campo.addEventListener("keydown", evento => {
        if (evento.key !== "Enter") {
            return;
        }

        evento.preventDefault();

        if (!campo.value.trim()) {
            return;
        }

        const primeiro = cards.find(card => !card.hidden);

        if (!primeiro) {
            return;
        }

        primeiro.closest(".secao-subgenero")?.scrollIntoView({
            block: "start"
        });

        primeiro.querySelector("a")?.focus({
            preventScroll: true
        });
    });

    window.addEventListener("pageshow", aplicar);

    aplicar();
    bloco.hidden = false;
}

function montarAcoesGenero() {
    const intro = document.querySelector(".introducao");
    const primeira = document.querySelector(".secao-subgenero");

    const obras = POEMAS.filter(obra => {
        return obra.genero === genero;
    });

    if (!intro || !primeira || !obras.length) {
        return;
    }

    const texto = criar("p", "progresso-texto");
    texto.id = "progresso-texto";

    const barra = criar("progress");
    barra.max = obras.length;
    barra.setAttribute("aria-labelledby", texto.id);

    const progresso = criar("div", "progresso");
    progresso.append(texto, barra);

    const ver = criar("a", "botao", "Ver as obras");
    ver.href = "#" + primeira.id;

    const surpresa = criar(
        "button",
        "botao botao-secundario",
        "Surpreenda-me"
    );

    surpresa.type = "button";

    surpresa.addEventListener("click", () => {
        location.href = urlPoema(sortear(obras).id);
    });

    const botoes = criar("div", "acoes-botoes");
    botoes.append(ver, surpresa);

    const faixa = criar("div", "acoes-genero");
    faixa.append(progresso, botoes);

    intro.after(faixa);

    atualizarProgresso = () => {
        const marcadas = new Set(lidos());

        const total = obras.filter(obra => {
            return marcadas.has(obra.id);
        }).length;

        barra.value = total;

        texto.textContent = total === 0
            ? "Nenhuma obra deste gênero marcada como lida."
            : (
                `${total} de ${obras.length} obras deste gênero ` +
                "marcadas como lidas."
            );
    };

    atualizarProgresso();
}

function montarPoemaDoDia() {
    const bloco = document.getElementById("poema-do-dia");
    const lista = bloco?.querySelector(".lista-cards");

    /*
     * O destaque usa somente poemas disponíveis dentro do museu.
     * Assim, o trecho apresentado pode ser continuado na página da obra.
     */
    const poemas = POEMAS.filter(obra => {
        return (
            obra.tipo === "poema" &&
            temLeituraInterna(obra)
        );
    });

    if (!bloco || !lista || !poemas.length) {
        return;
    }

    let diaAnterior = "";

    function atualizar() {
        const hoje = new Date();

        const dia = [
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate()
        ].join("-");

        if (dia === diaAnterior) {
            return;
        }

        const numero = Math.floor(
            Date.UTC(
                hoje.getFullYear(),
                hoje.getMonth(),
                hoje.getDate()
            ) / 86400000
        );

        const obra = poemas[numero % poemas.length];
        const card = criarCard(obra);

        const trecho = criar(
            "blockquote",
            "card-trecho",
            obra.versos[0]
        );

        card.querySelector(".autor")?.after(trecho);

        lista.replaceChildren(card);
        diaAnterior = dia;
    }

    atualizar();
    bloco.hidden = false;

    setInterval(atualizar, 60000);

    window.addEventListener("pageshow", atualizar);

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            atualizar();
        }
    });
}

function montarEstatisticas() {
    const lista = document.getElementById("estatisticas");

    if (!lista) {
        return;
    }

    const autores = new Set(
        POEMAS.map(obra => obra.autorId)
    );

    const categorias = new Set(
        POEMAS.map(obra => obra.genero)
    );

    const secoes = new Set(
        POEMAS.map(obra => `${obra.genero}/${obra.sub}`)
    );

    const numeros = [
        [POEMAS.length, "obras"],
        [autores.size, "autores"],
        [categorias.size, "categorias"],
        [secoes.size, "seções"]
    ];

    const itens = numeros.map(([numero, rotulo]) => {
        const item = criar("li");

        item.append(
            criar("strong", "", numero),
            document.createTextNode(rotulo)
        );

        return item;
    });

    lista.setAttribute(
        "aria-label",
        "O acervo em números"
    );

    lista.replaceChildren(...itens);
    lista.hidden = false;
}

function montarAleatorio() {
    const botao = document.getElementById("poema-aleatorio");

    const poemas = POEMAS.filter(obra => {
        return obra.tipo === "poema";
    });

    if (!botao || !poemas.length) {
        return;
    }

    botao.hidden = false;

    botao.addEventListener("click", () => {
        location.href = urlPoema(sortear(poemas).id);
    });
}

if (genero) {
    organizarContexto();
    montarListas();
    montarContagens();
    montarBusca();
    montarAcoesGenero();
}

montarPoemaDoDia();
montarEstatisticas();
montarAleatorio();

observarLeitura(() => {
    atualizarLidos(document);
    atualizarProgresso();
});