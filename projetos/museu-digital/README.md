# Museu da Poesia Digital

Projeto de portfólio desenvolvido com HTML, CSS e JavaScript puro.

O museu apresenta obras da literatura brasileira organizadas por afinidades
temáticas e formais, com páginas dedicadas ao lirismo, à sátira e ao cordel.

## Recursos

- Catálogo criado a partir de um módulo de dados.
- Busca por título, autor e palavras do resumo.
- Tema claro e escuro.
- Poema do dia e seleção aleatória de poemas.
- Ajuste do tamanho dos versos.
- Marcação de obras como lidas.
- Sincronização das marcas de leitura entre abas.
- Navegação por teclado.
- Compartilhamento ou cópia do endereço da obra.

## Executar localmente

Abra a pasta do projeto no Visual Studio Code.

Use a extensão Live Server para abrir o arquivo `index.html`.

O projeto utiliza módulos ES e deve ser executado por um servidor HTTP local.

## Organização

| Pasta | Conteúdo |
|---|---|
| `dados` | Catálogo em `poemas.js` |
| `scripts` | Módulos JavaScript |
| `estilos` | Folhas de estilo |
| `imagens` | Ilustrações e capa |
| `fontes` | Grenze e Platypi |

## Adicionar uma obra

Inclua um objeto na lista `REGISTROS`, em `dados/poemas.js`.

Use um `id` único e informe título, autor, categoria, seção e resumo.

Para leitura interna, informe `versos`, `fonte` e a situação de domínio público.

Para leitura externa, informe `externo` e `rotulo`.

As chaves de autores ficam em `AUTORES`.

As coletâneas são identificadas pelo conjunto `COLETANEAS`.
Obras com `formato: "prosa"` são identificadas como prosa.

## Fontes

Arquivos utilizados:

- `Grenze-VariableFont_wght.ttf`: pesos de 100 a 900.
- `Platypi-VariableFont_wght.ttf`: pesos de 300 a 800.

Mantenha os arquivos e suas respectivas licenças.

## Curadoria

O catálogo inclui poemas individuais, coletâneas e obras em prosa.

A organização expressa escolhas de curadoria; uma obra pode dialogar com
mais de uma categoria.

Campos `revisar` registram pendências editoriais e não aparecem na interface.

Alguns links externos levam a livros completos ou a páginas de acervos.
Esses destinos são identificados pelos textos dos botões.

## Armazenamento

Tema, tamanho de leitura e marcas de obras lidas são armazenados
localmente no navegador.

Não há cadastro de usuário nem sincronização com um servidor.

## Licença

Consulte o arquivo `LICENSE` para a licença do código.

Os textos, fontes e demais materiais de terceiros mantêm suas próprias
condições de uso.