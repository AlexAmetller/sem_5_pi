# Introducao

Pretende-se neste relatório apresentar uma solução para o problema de
escalonamento de entregas, apresentado no relatório `Grupo 80 - ALGAV - Sprint
A`, consistindo na utilização de um _Algoritmo Genético_ adaptado ao problema.

O Algoritmo Genético (AG) utiliza de um conjunto de possíveis soluções
(_população_) para gerar um novo conjunto de soluções (a próxima _geração_) a
partir de _permutações_ e _mutações_, realizando a avaliação da qualidade das
soluções por uma _funcão-objetivo_ a cada _geração_.

O processo de _cruzamento_ utiliza de dois elementos da população (pais) para
geração de um terceiro (filho), através da seleção de uma sequência de _genes_
do pai e da mãe. Por sua vez, a mutação consiste na modificação de um dos
indivíduos através da alteração de um dos seus genes, levando a criação de um
novo indivíduo mutado.

Diferentes métodos de _cruzamento_ podem ser usados. Interessamo-nos aqui no
método `Order 1 Crossover`[8], que se trata de um método de permutação
_crossover_ simples.

## Definições

Definimos, portanto, a nomenclatura utilizada, adaptada ao problema em questão:

- __Conjunto de entregas__: conjunto total de entregas a serem realizadas pelo
  camião.
- __Indivíduo da população__: consiste numa permutação do conjunto completo
  de entregas.
- __Gene do indivíduo__: consiste numa entrega específica. Uma sequência de
  genes, por sua vez, representa uma sequência ordenada de entregas.
- __População__: Conjunto de _indivíduos_ pertencentes a uma _geração_.
- __Geração__: Etapa do algoritmo relativa a uma _população_, onde a próxima
  _população_ é gerada e avaliada através da _função objetivo_.
- __Função objetivo__: No problema dos camiões, corresponde a função que
  calcula o tempo total necessário para realizar um conjunto de entregas
  específico, i.e.: um _indivíduo_ da _população_. Esta, desenvolvida no
  relatório anterior.
- __Cruzamento__: processo em que sequências genéticas de dois indivíduos da
  população são usadas para gerar um terceiro indivíduo.
- __Mutação__: processo em que um indivíduo gera um novo indivíduo através da
  alteração de um gene. No caso em questão, corresponde a trocar a posição de
  uma das entregas na lista.
- __Avaliação/qualidade__: resultado da aplicação da _função objetivo_ sobre
  um indivíduo da _população_ de uma _geração_, utilizado no ordenamento dessa
  _população_.

## Descrição do algoritmo genético

A base estrutural do algoritmo consiste em:

1. Criar uma população inicial, a partir de permutações aleatórias, ou
   utilizando de heurísticas que forneçam bons resultados.
2. Gerar uma nova geração de indivíduos a partir da população inicial (`P'`):
    a. Geram-se cruzamentos de indivíduos da população atual (`P''`).
    b. Geram-se possíveis mutações sobre os novos indivíduos (`P'''`)
3. Avaliar a qualidade da nova população (`P'''`) através da _função objetivo_.
4. Ordenar a população conforme a qualidade.
5. Selecionar um conjunto da população ordenada a ser usada como população da
   próxima geração.
6. Repetir o procedimento do item _2._ ao _5._ até uma condição de paragem.

As mutações e cruzamentos ocorrem aleatoriamente em parte da população, sendo
definidos os parâmetros _probabilidade de cruzamento_ e _probabilidade de
mutacao_ o mesmo. De forma semelhante, os genes modificados são escolhidos
aleatoriamente. A condição de paragem se dá de diversas formas, das quais nos
interessam: o número de gerações, o tempo máximo para o cálculo da solução, e
a estabilização da melhor solução encontrada.

## Adaptação do algoritmo genético em Prolog {#AG}

Um gene, neste contexto, é representado pelo identificador de uma entrega,
especificada pelo seguinte fato:

```prolog
% entrega(<id>,<data>,<massa>,<armazem>,<tempoColoc>,<tempoRet>)
entrega(4439, 20221205, 200, 1, 8, 10).
```

Iniciamos pela parametrização do algoritmo:

```prolog
nr_geracoes(3).         % número total de geracões a calcular
dim_populacao(3).       % dimensão total da populacao
prob_cruzamento(0.4).   % propabilidade [0-1] de haver cruzamento
prob_mutacao(0.4).      % propabilidade [0-1] de haver mutacao
```

Em seguida, descrevemos como gerar um novo indivíduo através do predicado
_mutar/4_, que recebe o indivíduo original e as duas posições de troca dos genes:

```prolog
% mutar/4
%   cria um novo indivíduo trocando os genes da posicão P1 e P2
%     ?- mutar([4398,4439,4449,4438], 0, 2, X).
%     X = [4449, 4439, 4398, 4438].
mutar(Individuo, P1, P2, IndividuoMutado):-
	nth0(P1, Individuo, Gene1),
	nth0(P2, Individuo, Gene2),
	select(Gene2, Individuo, Gene1, Mutacao),
	select(Gene1, Mutacao, Gene2, IndividuoMutado),!.
```

Podemos dessa forma mutar a população de uma geração através do predicado
_mutacao/2_, que seleciona pontos posições aleatórias de genes pelo predicado
_gerar_pontos/4_, verifica se deve ou não realizar mutação pelo predicado
_faz_mutacao/0_ e substitui o indivíduo original pelo mutado caso positivo:

```prolog
% mutacao/2
%   gera uma nova populacao mutada
%     ?- mutacao([[4333,4334,4335], [4335, 4334, 4333]], X).
%     X = [[4333, 4335, 4334], [4333, 4334, 4335]].
mutacao([],[]):-!.
mutacao([Individuo | Populacao], [IndividuoMutado | PopulacaoMutada]):-
	length(Individuo, NumEntregas),
	gerar_pontos(0, NumEntregas, P1, P2), % range [0, NumEntregas-1]
	((faz_mutacao(), mutar(Individuo,P1,P2,IndividuoMutado));
	 (IndividuoMutado = Individuo)),
	mutacao(Populacao, PopulacaoMutada).

% gerar_pontos/4
%   gera dois pontos aleatórios tal que: Min <= P1 > P2 < Max
%     ?- gerar_pontos(0, 3, P1, P2).
%     P1 = 0, P2 = 2.
gerar_pontos(Min, Max, P1, P2):-
	Max1 is Max - 1,
	random(Min, Max1, P1),
	P11 is P1 + 1,
	random(P11, Max, P2),!.

% faz_mutacao/0
faz_mutacao():-
	prob_mutacao(ProbMutacao),
	random(0.0, 1.0, Probabilidade),!,
	Probabilidade =< ProbMutacao.
```

Podemos gerar um novo indivíduo por cruzamento através do predicado
_cruzar/5_, utilizando o método de `Order 1 Crossover`[1], que recorda o
trecho genético entre Ponto1 e Ponto2 do primeiro indivíduo e o insere na
posição Ponto1 da lista de genes do segundo indivíduo subtraído do dos genes
copiados:

```prolog
% cruzar/5
%   gera um novo indivíduo através do método `Order 1 Crossover`
%     ?- cruzar([4333,4334,4335], [4335, 4334, 4333], 0, 1, X).
%     X = [4333, 4335, 4334].
cruzar(Individuo1, Individuo2, Ponto1, Ponto2, NovoIndividuo):-
	sublista(Individuo1, Ponto1, Ponto2, Corte, _, _),
	subtract(Individuo2, Corte, GenesRestantes),
	sublista(GenesRestantes, Ponto1, Ponto1, _, GenesEsquerda, GenesDireita),
	flatten([GenesEsquerda, Corte, GenesDireita], NovoIndividuo),!.

% sublista/5
%   secciona a lista List comecando do ponto Start e terminando em End,
%   gerando uma sublista Take. Elementos não selecionados à esquerda são
%   colocados na lista Skip, e à diretira na lista Rest. Indexado a 0.
%     ?- sublista([a,b,c,d], 1, 2, Take, Skip, Rest).
%     Take = [b], Skip = [a], Rest = [c, d].
sublista(List, Start, End, Take, Skip, Rest):-
   Count is End - Start,
   length(Skip, Start), append(Skip, _, List),
   append(Skip, Remaining, List),
   length(Take, Count), append(Take, Rest, Remaining),!.
```

Geramos uma nova população de indivíduos cruzados através do predicado
_cruzamento/2_. Este seleciona elementos 2 a 2 da população, verifica se deve
fazer cruzamento aleatoriamente e substitui os 2 indivíduos por 2 novos
indivíduos cruzados através do predicado _cruzar/4_: o primeiro referente ao
cruzamento entre indivíduos 1 e 2, e o segundo referente ao cruzamento entre
indivíduos 2 e 1:

```prolog
% cruzamento/4
%   gera uma nova populacao com indivíduos cruzados, tomando 2 a 2 elementos
%     ?- cruzamento([[4333,4334,4335], [4335, 4334, 4333]], X).
%     X = [[4333, 4335, 4334], [4335, 4333, 4334]].
cruzamento([],[]).
cruzamento([Individuo],[Individuo]).
cruzamento([Individuo1, Individuo2 | Populacao],
           [Cruzado1, Cruzado2 | PopulacaoCruzada]):-
	length(Individuo1, NumEntregas),
	gerar_pontos(0, NumEntregas, P1, P2),
	((faz_cruzamento(),!,
		cruzar(Individuo1,Individuo2,P1,P2,Cruzado1),
		cruzar(Individuo2,Individuo1,P1,P2,Cruzado2));
	 (Cruzado1 = Individuo1, Cruzado2 = Individuo2)),
	cruzamento(Populacao, PopulacaoCruzada),!.

% faz_cruzamento/0
faz_cruzamento():-
	prob_cruzamento(ProbCruzamento),
	random(0.0, 1.0, Probabilidade),!,
	Probabilidade =< ProbCruzamento.
```

Para avaliar a qualidade de uma solução, definimos o predicado _avaliar/2_
(função objetivo). Esta mapeia a lista de entregas a uma lista de armazéns,
adiciona o armazém de origem ao início e fim da lista e em sequência calcula o
tempo total para realizar as entregas dado o trajeto, recorrendo ao predicado
de cálculo de tempo definido no relatório `Grupo 80 - ALGAV Sprint A`:

```prolog
% avalia/2
%   determina a qualidade da solucao representada por um indivíduo.
%   a qualidade é definida pelo tempo de viagem, quanto maior o tempo, menor a
%   qualidade da solucao.
%     ?- avalia([4439, 4438, 4445], X).
%     X = 476.3550847457627.
avalia(Individuo, Tempo):-
	cidadeArmazem(IdOrigem),
	maplist(armazem, Individuo, ListaArmazens),
	append([IdOrigem|ListaArmazens],[IdOrigem], Trajeto),
	calcula_tempo_total_trajeto_complexo(Trajeto, Tempo).

% armazem/2
%   predicado auxiliar usado para mapear uma entrega a um armazem
armazem(Entrega, Armazem):-entrega(Entrega,_,_,Armazem,_,_).
```

Com uso do predicado _avalia/2_, podemos avaliar a população inteira através
do predicado _avalia_populacao/2_:

```prolog
% avalia_populacao: avalia a populacao atual
%   avalia uma populacao, gerando uma populacao avaliada
%     ?- avalia_populacao([[4439, 4438, 4445]], X).
%     X = [[4439, 4438, 4445]*476.3550847457627].
avalia_populacao([], []).
avalia_populacao([Individuo|Populacao], [Avaliacao|Avaliacoes]):-
	avalia(Individuo, Valor),
	Avaliacao = Individuo*Valor,
	avalia_populacao(Populacao, Avaliacoes).
```

Após avaliadas, as soluções devem ser ordenadas. Ordenamos de menor para maior
os valores obtidos pela avaliação através do predicado _ordena_populacao/2_.

```prolog
% ordena_populacao/2
%   ordena as populacoes avaliadas no formato de tuplo Individuo*Valor
ordena_populacao(Avaliacoes, AvaliacoesOrdenadas):-
	predsort(ordena, Avaliacoes, AvaliacoesOrdenadas).
ordena(R, _*V1, _*V2):- V2 > V1 -> R = < ; R = > .
```

Para iniciar o algoritmo, precisamos criar uma população inicial. No algoritmo
base, geramos essa população inicial aleatoriamente através do predicado
_gera_populacao/1_, que cria permutações aleatórias do conjunto de entregas e
as adiciona a população, sem adicionar indivíduos duplicados.

\pagebreak

```prolog
% gera_populacao/1
%   gera o conjunto inicial de indivíduos da populacao
gera_populacao(Populacao):-
	dim_populacao(DimPopulacao),
    findall(Entrega, entrega(Entrega,_,_,_,_,_), Entregas),
	gera_populacao(DimPopulacao, Entregas, Populacao).
gera_populacao(0,_,[]):-!.
gera_populacao(DimPopulacao, Entregas, [Individuo|Populacao]):-
	DimPopulacao1 is DimPopulacao - 1,
	gera_populacao(DimPopulacao1, Entregas, Populacao),
    repeat,
	random_permutation(Entregas, Individuo),
	not(member(Individuo, Populacao)).
```

Por fim, definimos o algoritmo genético (AG) base através do predicado
_algoritmo_genetico/0_. Este realiza os passos descritos no item `1.1
Descrição do algoritmo genético`:

```prolog
% algoritmo_genetico/0
%   executa o algoritmo genético, gerando populacao inicial, avaliando e
%   ordenando a populacao e gerando as geracoes seguintes, utilizando como
%   condicao de paragem um número específico de geracoes
algoritmo_genetico:-
	gera_populacao(Populacao),
	avalia_populacao(Populacao, Avaliacoes),
	ordena_populacao(Avaliacoes, AvaliacoesOrdenadas),
	gera_geracao(0, NumGeracoes, AvaliacoesOrdenadas),!.

% gera_geracao/3
%   gera a próxima geracao, avalia e ordena, recursivamente, até que se esgote
%   o número de geracoes
gera_geracao(NumGeracaoAtual,NumGeracoes,AtualPopulacaoAvaliada):-
	NumGeracaoAtual == NumGeracoes,!.
gera_geracao(NumGeracaoAtual,NumGeracoes,AtualPopulacaoAvaliada):-
	maplist(arg(1), AtualPopulacaoAvaliada, AtualPopulacao),
	cruzamento(AtualPopulacao, NovaPopulacaoCruzada),
	mutacao(NovaPopulacaoCruzada, NovaPopulacaoMutadaECruzada),
	avalia_populacao(NovaPopulacaoMutadaECruzada,NovaPopulacaoAvaliada),
	ordena_populacao(NovaPopulacaoAvaliada,NovaPopulacaoOrdenada),
	NumProximaGeracao is NumGeracaoAtual + 1,
	gera_geracao(NumProximaGeracao,NumGeracoes,NovaPopulacaoOrdenada).
```

\pagebreak
