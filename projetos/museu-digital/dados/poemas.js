export const AUTORES = {
  "goncalves-dias": "Gonçalves Dias (1823–1864)",
  "oswald-de-andrade": "Oswald de Andrade (1890–1954)",
  "mario-de-andrade": "Mário de Andrade (1893–1945)",
  "antonio-francisco-da-costa-e-silva": "Antônio Francisco da Costa e Silva (1885–1950)",
  "cecilia-meireles": "Cecília Meireles (1901–1964)",
  "gregorio-de-matos": "Gregório de Matos (1636–1696)",
  "castro-alves": "Castro Alves (1847–1871)",
  "manuel-botelho-de-oliveira": "Manuel Botelho de Oliveira (1636–1711)",
  "leandro-gomes-de-barros": "Leandro Gomes de Barros (1865–1918)",
  "silvino-piraua-de-lima": "Silvino Pirauá de Lima (1848–1913)",
  "jose-pacheco": "José Pacheco (1890–1954)",
  "francisco-das-chagas-batista": "Francisco das Chagas Batista (1882–1930)",
  "visconde-de-taunay": "Visconde de Taunay (1843–1899)",
  "jose-de-alencar": "José de Alencar (1829–1877)",
  "tomas-antonio-gonzaga": "Tomás Antônio Gonzaga (1744–1810)",
  "fagundes-varela": "Fagundes Varela (1841–1875)",
  "luis-gama": "Luís Gama (1830–1882)"
};

// "revisar" registra pendências editoriais e não aparece na interface.
const REGISTROS = [
  {"id":"ode-ao-burgues","titulo":"Ode ao Burguês","autor":"mario-de-andrade","genero":"lirico","sub":"ode","subnome":"Ode","resumo":"Ataque verbal a um burguês rico e hipócrita, que põe o dinheiro acima de tudo. Mário de Andrade faz da ode um manifesto contra a mediocridade social.","externo":"https://digital.bbm.usp.br/handle/bbm/7651","rotulo":"Ler em Pauliceia Desvairada (1922, Biblioteca Brasiliana Mindlin)","dominioPublico":true},

  {"id":"o-navio-negreiro","titulo":"O Navio Negreiro","autor":"castro-alves","genero":"lirico","sub":"ode","subnome":"Ode","resumo":"Grande ode de clamor social: em tom solene e eloquente, Castro Alves canta o horror da escravidão e invoca a justiça humana.","externo":"https://codap.ufs.br/uploads/page_attach/path/8283/Navio_negreiro_-_Castro_Alves.pdf","rotulo":"Ler o poema (PDF hospedado pelo Codap/UFS)","dominioPublico":true},

  {"id":"cancao-do-exilio","titulo":"Canção do Exílio","autor":"goncalves-dias","genero":"lirico","sub":"ode","subnome":"Ode","resumo":"Um dos poemas mais lembrados do Brasil. Musical e nostálgico, exalta a natureza da terra natal e pode ser lido como uma ode de exaltação patriótica.","versos":["Minha terra tem palmeiras,\nOnde canta o Sabiá;\nAs aves, que aqui gorjeiam,\nNão gorjeiam como lá.","Nosso céu tem mais estrelas,\nNossas várzeas têm mais flores,\nNossos bosques têm mais vida,\nNossa vida mais amores.","Em cismar, sozinho, à noite,\nMais prazer encontro eu lá;\nMinha terra tem palmeiras,\nOnde canta o Sabiá.","Minha terra tem primores,\nQue tais não encontro eu cá;\nEm cismar — sozinho, à noite —\nMais prazer encontro eu lá;\nMinha terra tem palmeiras,\nOnde canta o Sabiá.","Não permita Deus que eu morra,\nSem que eu volte para lá;\nSem que desfrute os primores\nQue não encontro por cá;\nSem que inda aviste as palmeiras,\nOnde canta o Sabiá."],"fonte":"Gonçalves Dias, Primeiros Cantos (1846). Texto em domínio público.","dominioPublico":true,"revisar":"Conferir a transcrição com a edição usada como fonte."},

  {"id":"ode-ao-dois-de-julho","titulo":"Ode ao Dois de Julho","autor":"castro-alves","genero":"lirico","sub":"ode","subnome":"Ode","resumo":"Homenagem ao 2 de Julho, data em que a Bahia celebra sua independência. A exaltação da liberdade e da pátria marca o Romantismo social de Castro Alves.","externo":"https://biblioteca.torres.rs.gov.br/wp-content/uploads/2021/10/alves-castro-espumas-flutuantes.pdf","rotulo":"Ler em Espumas Flutuantes (PDF da Biblioteca de Torres, RS)","dominioPublico":true},

  {"id":"canto-do-piaga","titulo":"Canto do Piaga","autor":"goncalves-dias","genero":"lirico","sub":"elegia","subnome":"Elegia","resumo":"Em tom de elegia heroica, o piaga (pajé) profetiza e lamenta a destruição de seu povo e de sua cultura com a chegada dos colonizadores.","externo":"https://projetos.uel.br/bibliotecacomum/bc-texto/obras/ua00119a.pdf","rotulo":"Ler em Primeiros Cantos (Biblioteca Comum UEL, PDF)","dominioPublico":true},

  {"id":"mocidade-e-morte","titulo":"Mocidade e Morte","autor":"castro-alves","genero":"lirico","sub":"elegia","subnome":"Elegia","resumo":"Poema composto em 1864 e incluído em Espumas Flutuantes (1870), em que o jovem poeta medita sobre a morte precoce, tema recorrente do Romantismo.","externo":"https://biblioteca.torres.rs.gov.br/wp-content/uploads/2021/10/alves-castro-espumas-flutuantes.pdf","rotulo":"Ler em Espumas Flutuantes (PDF da Biblioteca de Torres, RS)","dominioPublico":true},

  {"id":"cantico-do-calvario","titulo":"Cântico do Calvário","autor":"fagundes-varela","genero":"lirico","sub":"elegia","subnome":"Elegia","resumo":"Uma das elegias mais conhecidas do Romantismo, escrita após a morte do filho pequeno do poeta. Lamento pessoal, em tom grave e comovido.","externo":"https://digital.bbm.usp.br/handle/bbm/4927","rotulo":"Ler em Cantos e Fantasias (1865, Biblioteca Brasiliana Mindlin)","dominioPublico":true},

  {"id":"elegia","titulo":"Elegia","autor":"cecilia-meireles","genero":"lirico","sub":"elegia","subnome":"Elegia","resumo":"Poema de luto e memória dedicado à avó da autora, em oito partes, que fecha o livro Mar Absoluto (1945). Transforma a perda em homenagem ao afeto cotidiano.","externo":"https://periodicos.usp.br/teresa/article/download/146124/149234/324762","rotulo":"Consultar o artigo sobre a obra (revista Teresa, USP)","dominioPublico":false,"revisar":"Conferir a fonte de leitura e as condições da reprodução apresentada no artigo."},

  {"id":"iracema","titulo":"Iracema","autor":"jose-de-alencar","genero":"lirico","sub":"idilio","subnome":"Idílio","resumo":"Romance de 1865 sobre o amor entre a índia Iracema e o português Martim. Prosa de ritmo poético, com a natureza como cenário.","formato":"prosa","externo":"https://www.gutenberg.org/ebooks/67740","rotulo":"Ler a obra completa (Projeto Gutenberg)","dominioPublico":true},

  {"id":"inocencia","titulo":"Inocência","autor":"visconde-de-taunay","genero":"lirico","sub":"idilio","subnome":"Idílio","resumo":"Considerado pela crítica um idílio sertanejo: o amor proibido e trágico entre Inocência e o médico Cirino, no sertão de Mato Grosso. Obra em prosa.","formato":"prosa","externo":"https://www.gutenberg.org/ebooks/68635","rotulo":"Ler a obra completa (Projeto Gutenberg)","dominioPublico":true},

  {"id":"marilia-de-dirceu","titulo":"Marília de Dirceu","autor":"tomas-antonio-gonzaga","genero":"lirico","sub":"idilio","subnome":"Idílio","resumo":"Expressão máxima do idílio pastoral no Brasil colonial: o pastor Dirceu canta seu amor idealizado por Marília em cenário de natureza perfeita.","externo":"https://www.gutenberg.org/ebooks/18082","rotulo":"Ler a obra completa (Projeto Gutenberg)","dominioPublico":true},

  {"id":"cinco-minutos","titulo":"Cinco Minutos","autor":"jose-de-alencar","genero":"lirico","sub":"idilio","subnome":"Idílio","resumo":"Romance urbano e idealizado: o atraso de cinco minutos para pegar o ônibus vira um jogo de perseguição amorosa entre o narrador e Carlota. Obra em prosa.","formato":"prosa","externo":"https://www.gutenberg.org/ebooks/44540","rotulo":"Ler a obra completa (Projeto Gutenberg)","dominioPublico":true},

  {"id":"musica-do-parnasso","titulo":"Música do Parnasso","autor":"manuel-botelho-de-oliveira","genero":"lirico","sub":"madrigal","subnome":"Madrigal","resumo":"Primeiro livro de poesia de um brasileiro publicado em vida (1705). Reúne rimas em quatro línguas, entre elas madrigais em louvor à amada Anarda.","externo":"https://pt.wikisource.org/wiki/M%C3%BAsica_do_Parnaso","rotulo":"Consultar a obra (Wikisource, transcrição incompleta)","dominioPublico":true},

  {"id":"madrigal-do-truco","titulo":"Madrigal do Truco","autor":"mario-de-andrade","genero":"lirico","sub":"madrigal","subnome":"Madrigal","resumo":"Mário de Andrade recria o madrigal com uma cena popular brasileira: uma barulhenta partida de truco, em versos para solista e coro.","versos":["Um jogador solista (em parlato):\n— Truco!\n\n(cantando):\nArreda porteira! Aí vai\nOs peitos do Zé Migué\nLaranja não tem caroço\nJacaré não tem pescoço\nTruco de baralho velho!","O grupo madrigalista:\n\nSeis papudo! Sai tapera\nSeis seu cara de tatu\nSeu portão de cemitério\nArapuca de bambu\nToma seis que três é pouco!","Sai do caminho porqueira\nToma nove, seis é pouco\nE diga porque não quer\nQuem não pode não me espera\nSeu cara de jacaré!","Truco mesmo! Sai perneta\nReboco de igreja velha\nEsteira de bexiguento\nSapicuá de lazarento\nSumítico arrisque o tento!","Trucou, aguenta a parada\nCarrapato é bicho feio\nTem cabelo até no joeio\nMosquito não leva freio\nPernilongo não se capa!"],"fonte":"Mário de Andrade (1893–1945), Madrigal do Truco. Obra em domínio público no Brasil.","dominioPublico":true,"revisar":"Texto copiado do site Toda Matéria; conferir com a edição impressa (Poesias completas, Itatiaia, 1987)."},

  {"id":"madrigal-de-um-louco","titulo":"Madrigal de um Louco","autor":"antonio-francisco-da-costa-e-silva","genero":"lirico","sub":"madrigal","subnome":"Madrigal","resumo":"Poema figurativo do simbolista Da Costa e Silva: os versos formam um losango dedicado à Lua. Por usar o espaço da página, é lembrado como antecedente do Concretismo.","figurado":true,"versos":["Lua!\nCamélia\nQue flutua\nNo azul. Ofélia\nSerene e dolente,\nFria, vagando pelas\nAlturas, serenamente,\nPor entre os lírios das estrelas,\nSantelmo aceso para a Saudade,\nUnge meu ser na apoteose\nDa tua luz, e eu frua,\nCismando, a pureza\nDa luz e goze\nToda a tua\nTristeza,\nLua!"],"fonte":"Da Costa e Silva (1885–1950). Obra em domínio público no Brasil.","dominioPublico":true,"revisar":"Texto transcrito do blog Sacrário das Plangências; conferir com a edição impressa (Poesias completas, Nova Fronteira, 1985)."},

  {"id":"encarecimento-dos-rigores-de-anarda","titulo":"Encarecimento dos rigores de Anarda","autor":"manuel-botelho-de-oliveira","genero":"lirico","sub":"madrigal","subnome":"Madrigal","resumo":"Madrigal de Manuel Botelho de Oliveira, pioneiro do gênero no país, em louvor a Anarda e sob forte influência do modelo barroco espanhol.","externo":"https://www.todamateria.com.br/madrigal-o-que-e-e-caracteristicas-do-genero-literario-com-exemplos/","rotulo":"Ler o madrigal (site Toda Matéria)","dominioPublico":true,"revisar":"Conferir o poema com uma edição de Música do Parnaso e preferir uma fonte primária."},

  {"id":"juizo-anatomico-dos-achaques-que-padecia-o-corpo-da-republica","titulo":"Juízo anatômico dos achaques que padecia o corpo da República","autor":"gregorio-de-matos","genero":"satirico","sub":"satira-de-costumes","subnome":"Sátira de Costumes","resumo":"Em perguntas e respostas, o poeta examina a Bahia como um corpo doente e aponta as corrupções da vida colonial: justiça, comércio, clero e povo.","externo":"https://www.gutenberg.org/ebooks/71724","rotulo":"Ler nas Obras poéticas de Gregório de Matos (1882, Projeto Gutenberg)","dominioPublico":true},

  {"id":"a-cidade-da-bahia-triste-bahia","titulo":"À Cidade da Bahia (Triste Bahia)","autor":"gregorio-de-matos","genero":"satirico","sub":"satira-de-costumes","subnome":"Sátira de Costumes","resumo":"O poeta lamenta o empobrecimento da Bahia, comparando o que a cidade foi ao que se tornou, num dos textos mais conhecidos de sua obra satírica.","externo":"https://projetos.uel.br/bibliotecacomum/bc-texto/obras/ua00124a.pdf","rotulo":"Ler o soneto (Biblioteca Comum UEL, PDF)","dominioPublico":true},

  {"id":"aos-principais-da-bahia-chamados-os-caramurus","titulo":"Aos principais da Bahia chamados os Caramurus","autor":"gregorio-de-matos","genero":"satirico","sub":"satira-de-costumes","subnome":"Sátira de Costumes","resumo":"Dirigido aos “Caramurus”, mestiços do Recôncavo, o poema zomba das pretensões de nobreza de quem se dizia principal da terra, em linguagem que mistura português, tupi e línguas africanas.","externo":"https://www.gutenberg.org/ebooks/71724","rotulo":"Ler nas Obras poéticas de Gregório de Matos (1882, Projeto Gutenberg)","dominioPublico":true},

  {"id":"quem-sou-eu-bodarrada","titulo":"Quem sou eu? (Bodarrada)","autor":"luis-gama","genero":"satirico","sub":"satira-de-costumes","subnome":"Sátira de Costumes","resumo":"Publicado em Primeiras Trovas Burlescas de Getulino (1859), responde com humor ácido a quem ofendia o poeta por sua origem e devolve a ofensa a uma sociedade mestiça e hierárquica.","externo":"https://digital.bbm.usp.br/bitstream/bbm/4270/1/008936_COMPLETO.pdf","rotulo":"Ler em Primeiras Trovas Burlescas (3ª ed., Biblioteca Brasiliana Mindlin, PDF)","dominioPublico":true},

  {"id":"retrato-do-governador-antonio-luis-da-camara-coutinho","titulo":"Retrato do Governador Antônio Luís da Câmara Coutinho","autor":"gregorio-de-matos","genero":"satirico","sub":"epigrama","subnome":"Epigrama","resumo":"Em versos curtos e ágeis, o poeta ridiculariza fisicamente o governador da Bahia, de quem era desafeto, num retrato caricatural que rebaixa o poder pelo riso.","externo":"https://www.gutenberg.org/ebooks/71724","rotulo":"Ler nas Obras poéticas de Gregório de Matos (1882, Projeto Gutenberg)","dominioPublico":true},

  {"id":"amor","titulo":"Amor","autor":"oswald-de-andrade","genero":"satirico","sub":"epigrama","subnome":"Epigrama","resumo":"Poema de duas palavras, “amor” e “humor”, que reduz o tema mais solene da lírica a uma piada. Abre o Primeiro Caderno do Aluno de Poesia Oswald de Andrade (1927).","versos":["amor\nhumor"],"fonte":"Oswald de Andrade, Primeiro Caderno do Aluno de Poesia Oswald de Andrade (1927). Obra em domínio público no Brasil desde 2025.","dominioPublico":true},

  {"id":"erro-de-portugues","titulo":"Erro de português","autor":"oswald-de-andrade","genero":"satirico","sub":"epigrama","subnome":"Epigrama","resumo":"Em poucos versos, o poeta relê a chegada dos colonizadores com humor: o desfecho inverte a versão oficial da história do Brasil.","versos":["Quando o português chegou\nDebaixo de uma bruta chuva\nVestiu o índio\nQue pena!\nFosse uma manhã de sol\nO índio tinha despido\nO português"],"fonte":"Oswald de Andrade, Primeiro Caderno do Aluno de Poesia Oswald de Andrade (1927). Obra em domínio público no Brasil desde 2025.","dominioPublico":true},

  {"id":"pronominais","titulo":"Pronominais","autor":"oswald-de-andrade","genero":"satirico","sub":"epigrama","subnome":"Epigrama","resumo":"Publicado em Pau-Brasil (1925), contrapõe a gramática escolar à fala real dos brasileiros e ironiza o apego às regras da norma culta.","versos":["Dê-me um cigarro\nDiz a gramática\nDo professor e do aluno\nE do mulato sabido\nMas o bom negro e o bom branco\nDa Nação Brasileira\nDizem todos os dias\nDeixa disso camarada\nMe dá um cigarro"],"fonte":"Oswald de Andrade, Pau-Brasil (1925). Obra em domínio público no Brasil desde 2025.","dominioPublico":true,"revisar":"Conferir o texto com uma edição impressa."},

  {"id":"historia-da-princesa-rosa","titulo":"História da Princesa Rosa","autor":"silvino-piraua-de-lima","genero":"cordel","sub":"romance","subnome":"Romance","resumo":"Folheto de um dos pioneiros do cordel, a quem se atribui a criação do romance em versos, no gosto das histórias de princesas e aventuras populares.","externo":"https://cordel.casaruibarbosa.gov.br/","rotulo":"Procurar o folheto no acervo digital da Casa de Rui Barbosa","dominioPublico":true,"revisar":"Substituir pelo endereço permanente do folheto quando localizado."},

  {"id":"juvenal-e-o-dragao","titulo":"Juvenal e o Dragão","autor":"leandro-gomes-de-barros","genero":"cordel","sub":"romance","subnome":"Romance","resumo":"Um dos grandes clássicos do cordel de maravilhas: o herói Juvenal enfrenta um dragão numa narrativa de aventura e fantasia, no estilo dos contos tradicionais.","externo":"https://dspace.bc.uepb.edu.br/jspui/handle/123456789/27380","rotulo":"Ler o folheto no Repositório Digital da UEPB","dominioPublico":true,"revisar":"Confirmar a disponibilidade do registro e do arquivo."},

  {"id":"historia-da-donzela-teodora","titulo":"História da Donzela Teodora","autor":"leandro-gomes-de-barros","genero":"cordel","sub":"romance","subnome":"Romance","resumo":"Clássico do cordel que leva ao sertão uma história de tradição europeia, centrada em uma jovem de grande sabedoria.","externo":"https://cordel.casaruibarbosa.gov.br/","rotulo":"Procurar o folheto no acervo digital da Casa de Rui Barbosa","dominioPublico":true,"revisar":"Substituir pelo endereço permanente do folheto quando localizado."},

  {"id":"o-cachorro-dos-mortos","titulo":"O Cachorro dos Mortos","autor":"leandro-gomes-de-barros","genero":"cordel","sub":"romance","subnome":"Romance","resumo":"Um dos maiores sucessos de Leandro, a narrativa em versos tem como protagonista o cachorro Calar e figura entre os clássicos do cordel narrativo.","externo":"https://cordel.casaruibarbosa.gov.br/","rotulo":"Procurar o folheto no acervo digital da Casa de Rui Barbosa","dominioPublico":true,"revisar":"Substituir pelo endereço permanente do folheto quando localizado."},

  {"id":"peleja-de-manoel-riachao-com-o-diabo","titulo":"Peleja de Manoel Riachão com o Diabo","autor":"leandro-gomes-de-barros","genero":"cordel","sub":"peleja","subnome":"Peleja","resumo":"Em 58 estrofes de seis versos, o poeta recria por escrito um desafio de cantoria: o repentista Manoel Riachão enfrenta o Diabo e vence com astúcia, viola e conhecimento das Escrituras.","externo":"https://dspace.bc.uepb.edu.br/jspui/handle/123456789/27764","rotulo":"Ler o folheto no Repositório Digital da UEPB","dominioPublico":true,"revisar":"Confirmar a disponibilidade do registro e do arquivo."},

  {"id":"peleja-de-vicente-sabia-com-antonio-coqueiro","titulo":"Peleja de Vicente Sabiá com Antônio Coqueiro","autor":"jose-pacheco","genero":"cordel","sub":"peleja","subnome":"Peleja","resumo":"Folheto de peleja em que dois cantadores se enfrentam em desafio de versos, publicado pela editora Luzeiro do Norte, do Recife.","externo":"https://cordel.casaruibarbosa.gov.br/","rotulo":"Procurar o folheto no acervo digital da Casa de Rui Barbosa","dominioPublico":true,"revisar":"Substituir pelo endereço permanente do folheto quando localizado."},

  {"id":"a-chegada-de-lampiao-no-inferno","titulo":"A Chegada de Lampião no Inferno","autor":"jose-pacheco","genero":"cordel","sub":"cangaco-conflito","subnome":"Cangaço e Conflito","resumo":"O cangaceiro Lampião chega ao inferno e deixa os demônios assombrados, num folheto que transforma o terror do sertão em humor e fantasia.","externo":"https://cordel.casaruibarbosa.gov.br/","rotulo":"Procurar o folheto no acervo digital da Casa de Rui Barbosa","dominioPublico":true,"revisar":"Substituir pelo endereço permanente do folheto quando localizado."},

  {"id":"a-vida-de-antonio-silvino","titulo":"A Vida de Antônio Silvino","autor":"francisco-das-chagas-batista","genero":"cordel","sub":"cangaco-conflito","subnome":"Cangaço e Conflito","resumo":"Publicado em 1905, é um dos primeiros folhetos sobre o cangaço e acompanha a trajetória do cangaceiro Antônio Silvino, figura que dividiu o sertão entre admiradores e vítimas.","externo":"https://cordel.casaruibarbosa.gov.br/","rotulo":"Procurar o folheto no acervo digital da Casa de Rui Barbosa","dominioPublico":true,"revisar":"Substituir pelo endereço permanente do folheto quando localizado."},

  {"id":"o-nascimento-de-antonio-silvino","titulo":"O Nascimento de Antônio Silvino","autor":"leandro-gomes-de-barros","genero":"cordel","sub":"cangaco-conflito","subnome":"Cangaço e Conflito","resumo":"Leandro Gomes de Barros narra as origens do cangaceiro Antônio Silvino, personagem que o poeta retratou em vários folhetos.","externo":"https://cordel.casaruibarbosa.gov.br/","rotulo":"Procurar o folheto no acervo digital da Casa de Rui Barbosa","dominioPublico":true,"revisar":"Substituir pelo endereço permanente do folheto quando localizado."}
];

const COLETANEAS = new Set([
  'marilia-de-dirceu',
  'musica-do-parnasso'
]);

export const POEMAS = REGISTROS.map(obra => ({
  ...obra,
  autorId: obra.autor,
  autor: AUTORES[obra.autor] || obra.autor,
  tipo: obra.formato === 'prosa'
    ? 'prosa'
    : COLETANEAS.has(obra.id)
      ? 'coletanea'
      : 'poema'
}));