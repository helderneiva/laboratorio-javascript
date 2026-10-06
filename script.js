const meusExperimentos = [
  {
    id: 1,
    titulo: "Gerador de Paleta Cyber",
    categoria: "dom",
    descricao: "Injeta cores aleatórias no DOM e permite copiar o código HEX com um clique.",
    link: "#"
  },
  {
    id: 2,
    titulo: "Consumo de API GitHub",
    categoria: "api",
    descricao: "Usa o Fetch API para buscar e renderizar a foto e os repositórios de um usuário.",
    link: "#"
  },
  {
    id: 3,
    titulo: "Simulador de Upload Assíncrono",
    categoria: "async",
    descricao: "Trabalha com Promises e Async/Await para criar uma barra de progresso simulada.",
    link: "#"
  }
];

const gridProjetos = document.getElementById("grid-projetos");
const botoesFiltro = document.querySelectorAll(".btn-filtro");