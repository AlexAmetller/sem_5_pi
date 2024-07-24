% capítulo 1
% dados e entregas
:- [ './99_data.pl' ].
:- [ './03_trajeto_menor_tempo_complexo.pl' ].
entrega(4439, 20221205, 200, 1, 8, 10).
entrega(4438, 20221205, 150, 9, 7, 9).
entrega(4445, 20221205, 100, 3, 5, 7).
entrega(4443, 20221205, 120, 8, 6, 8).
entrega(4449, 20221205, 300, 11, 15, 20).
entrega(4398, 20221205, 310, 17, 16, 20).
entrega(4432, 20221205, 270, 14, 14, 18).
entrega(4437, 20221205, 180, 12, 9, 11).
entrega(4451, 20221205, 220, 6, 9, 12).
entrega(4452, 20221205, 390, 13, 21, 26).
entrega(4444, 20221205, 380, 2, 20, 25).
entrega(4455, 20221205, 280, 7, 14, 19).
% entrega(4399, 20221205, 260, 15, 13, 18).
% entrega(4454, 20221205, 350, 10, 18, 22).
% entrega(4446, 20221205, 260, 4, 14, 17).
% entrega(4456, 20221205, 330, 16, 17, 21).

% parameterização
nr_geracoes(20).
dim_populacao(30).
prob_cruzamento(0.4).
prob_mutacao(0.4).
entregas(NumEntregas, Entregas):-
	findall(Entrega, entrega(Entrega,_,_,_,_,_), Entregas),
	length(Entregas, NumEntregas).

algoritmo_genetico:-
	nr_geracoes(NumGeracoes),
	dim_populacao(DimPopulacao),
	prob_cruzamento(ProbCruzamento),
	prob_mutacao(ProbMutacao),
	% format(user_output, 'Inicializa ================== ~n', []),
	% format(user_output, '> Numero de geracoes: ~p~n', [NumGeracoes]),
	% format(user_output, '> Dimensao da populacao: ~p~n', [DimPopulacao]),
	% format(user_output, '> Probabilidade de cruzamento: ~p~n', [ProbCruzamento]),
	% format(user_output, '> Probabilidade de mutacao: ~p~n', [ProbMutacao]),
	check_input(),
	gera_populacao(Populacao),
	% format(user_output, '> Populacao Inicial: ~n', []),
	% print_lista(Populacao),
	avalia_populacao(Populacao, Avaliacoes),
	% format(user_output, '> Avaliacoes: ~n', []),
	% print_lista(Avaliacoes),
	ordena_populacao(Avaliacoes, AvaliacoesOrdenadas),
	% format(user_output, '> AvaliacoesOrdenadas: ~n', []),
	% print_lista(AvaliacoesOrdenadas),
	!,
	gera_geracao(0, NumGeracoes, AvaliacoesOrdenadas),!.


print_lista([]):-!.
print_lista([Elemento|Elementos]):-
	format(user_output, '  ~p~n', [Elemento]),
	print_lista(Elementos).

factorial(0, 1).
factorial(N, F):-N1 is N - 1, factorial(N1, F1), F is N * F1, !.

check_input():-
	dim_populacao(DimPopulacao),
	entregas(NumEntregas, _),
	factorial(NumEntregas, MaxPermutacoes),
	((DimPopulacao > MaxPermutacoes,
	 format(user_output, '[ERROR]: Dimensão da populacão super o número de possíveis permutacões: ~p > ~p~n', [DimPopulacao, MaxPermutacoes]),!,
	 fail);true),!.

% gera populacao
gera_populacao(Populacao):-
	dim_populacao(DimPopulacao),
	entregas(_, Entregas),
	gera_populacao(DimPopulacao, Entregas, Populacao).
gera_populacao(0,_,[]):-!.
gera_populacao(DimPopulacao, Entregas, [Individuo|Populacao]):-
	DimPopulacao1 is DimPopulacao - 1,
	gera_populacao(DimPopulacao1, Entregas, Populacao),
	repeat,
	random_permutation(Entregas, Individuo),
	not(member(Individuo, Populacao)).

% avalia: avalia um indivíduo da populacao
avalia(Individuo, Tempo):-
	cidadeArmazem(IdOrigem),
	maplist(armazem, Individuo, ListaArmazens),
	append([IdOrigem|ListaArmazens],[IdOrigem], Trajeto),
	calcula_tempo_total_trajeto_complexo(Trajeto, Tempo).
armazem(Entrega, Armazem):-entrega(Entrega,_,_,Armazem,_,_).

% avalia_populacao: avalia a populacao atual
avalia_populacao([], []).
avalia_populacao([Individuo|Populacao], [Avaliacao|Avaliacoes]):-
	avalia(Individuo, Valor),
	Avaliacao = Individuo*Valor,
	avalia_populacao(Populacao, Avaliacoes).

% ordena: ordena avaliacoes e devolve a populacao ordenada
ordena_populacao(Avaliacoes, AvaliacoesOrdenadas):-
	predsort(ordena, Avaliacoes, AvaliacoesOrdenadas).

ordena(R, _*V1, _*V2):- V2 > V1 -> R = < ; R = > .

media_avaliacoes(Avaliacoes, Media):-
	maplist(arg(2), Avaliacoes, Tempos),
	sum_list(Tempos, Soma),
	length(Avaliacoes, NR),
	Media is Soma / NR.

% gera_geracao: cria as novas geracoes com base na populacao original. Para
% cada geracao, aplica mutacoes e cruzamentos e são avaliados os indivíduos.
gera_geracao(NumGeracaoAtual,NumGeracoes,AtualPopulacaoAvaliada):- % paragem, última geracao
	NumGeracaoAtual == NumGeracoes,!,
	% format(user_output, '~nGeracao ~p: ==================== ~n', [NumGeracaoAtual]),
	% print_lista(AtualPopulacaoAvaliada),
	[Melhor | _] = AtualPopulacaoAvaliada,
	media_avaliacoes(AtualPopulacaoAvaliada, Media),
	format(user_output, '> Melhor resultado: ~p ', [Melhor]),
	format(user_output, '> Média dos resultados: ~p~n', [Media]).

gera_geracao(NumGeracaoAtual,NumGeracoes,AtualPopulacaoAvaliada):-
	% format(user_output, '~nGeracao ~p: ==================== ~n', [NumGeracaoAtual]),
	maplist(arg(1), AtualPopulacaoAvaliada, AtualPopulacao),
	% format(user_output, '> AtualPopulacao: ~n', []),
	% print_lista(AtualPopulacao),
	cruzamento(AtualPopulacao, NovaPopulacaoCruzada),
	% format(user_output, '> NovaPopulacaoCruzada: ~n', []),
	% print_lista(NovaPopulacaoCruzada),
	mutacao(NovaPopulacaoCruzada, NovaPopulacaoMutadaECruzada),
	% format(user_output, '> NovaPopulacaoMutadaECruzada: ~n', []),
	% print_lista(NovaPopulacaoMutadaECruzada),
	avalia_populacao(NovaPopulacaoMutadaECruzada,NovaPopulacaoAvaliada),
	ordena_populacao(NovaPopulacaoAvaliada,NovaPopulacaoOrdenada),
	% format(user_output, '> NovaPopulacaoOrdenada: ~n', []),
	% print_lista(NovaPopulacaoOrdenada),
	NumProximaGeracao is NumGeracaoAtual + 1,
	gera_geracao(NumProximaGeracao,NumGeracoes,NovaPopulacaoOrdenada).

% cruzamento: gera uma nova populacao com cruzamentos.
% usam-se 2 a 2 membros da populacao para realizar cruz
cruzamento([],[]).
cruzamento([Individuo],[Individuo]).
cruzamento([Individuo1, Individuo2 | Populacao], [Cruzado1, Cruzado2 | PopulacaoCruzada]):-
	length(Individuo1, NumEntregas),
	gerar_pontos(0, NumEntregas, P1, P2), % range [0, NumEntregas-1]
	((faz_cruzamento(),!,
		cruzar(Individuo1,Individuo2,P1,P2,Cruzado1),
		cruzar(Individuo2,Individuo1,P1,P2,Cruzado2)
		% format(user_output, 'Faz cruzamento: ~p, ~p -> ~p, ~p~n', [Individuo1, Individuo2, Cruzado1, Cruzado2])
	 );
	 (
		 % format(user_output, 'Não faz cruzamento: ~p, ~p~n', [Individuo1, Individuo2]),
		 Cruzado1 = Individuo1, Cruzado2 = Individuo2)),
	cruzamento(Populacao, PopulacaoCruzada),!.

% Gera valores P1 > P2 dentro do range [Min, Max[
gerar_pontos(Min, Max, P1, P2):-
	Max1 is Max - 1,
	random(Min, Max1, P1),
	P11 is P1 + 1,
	random(P11, Max, P2),!.

% Determina se faz ou não cruzamento
faz_cruzamento():-
	prob_cruzamento(ProbCruzamento),
	random(0.0, 1.0, Probabilidade),!,
	Probabilidade =< ProbCruzamento.

% Order 1 crossover
% Ponto1 e Ponto2 -> [0, NumEntregas-1]
% Se Ponto1 == Ponto2, 1 elemento é selecionado para corte
cruzar(Individuo1, Individuo2, Ponto1, Ponto2, NovoIndividuo):-
	% format(user_output, 'Cruzando: ~p, ~p, ~p, ~p, ~n', [Individuo1, Individuo2, Ponto1, Ponto2]),
	sublista(Individuo1, Ponto1, Ponto2, Corte, _, _),
	subtract(Individuo2, Corte, GenesRestantes),
	sublista(GenesRestantes, Ponto1, Ponto1, _, GenesEsquerda, GenesDireita),
	flatten([GenesEsquerda, Corte, GenesDireita], NovoIndividuo),!.

% 0-indexed, includes Start, End not included
sublista(List, Start, End, Take, Skip, Rest):-
   Count is End - Start,
   length(Skip, Start), append(Skip, _, List),
   append(Skip, Remaining, List),
   length(Take, Count), append(Take, Rest, Remaining),!.


% mutacao: muta um gene do indivíduo
% mutacao é tentada sobre cada indivíduo
mutacao([],[]):-!.
mutacao([Individuo | Populacao], [IndividuoMutado | PopulacaoMutada]):-
	length(Individuo, NumEntregas),
	gerar_pontos(0, NumEntregas, P1, P2), % range [0, NumEntregas-1]
	((faz_mutacao(),!,
		mutar(Individuo,P1,P2,IndividuoMutado)
		% format(user_output, 'Faz mutacao: ~p -> ~p~n', [Individuo, IndividuoMutado])
	 );
	 (
		 % format(user_output, 'Não faz mutacao: ~p~n', [Individuo]),
		 IndividuoMutado = Individuo)),
	mutacao(Populacao, PopulacaoMutada).

% Determina se faz ou não mutacao
faz_mutacao():-
	prob_mutacao(ProbMutacao),
	random(0.0, 1.0, Probabilidade),!,
	Probabilidade =< ProbMutacao.

% mutar: gera um indivíduo mutado
% P1 > P2 é necessário
mutar(Individuo, P1, P2, IndividuoMutado):-
	nth0(P1, Individuo, Gene1),
	nth0(P2, Individuo, Gene2),
	select(Gene2, Individuo, Gene1, Mutacao),
	select(Gene1, Mutacao, Gene2, IndividuoMutado),!.

?-algoritmo_genetico.
% ?- numlist(1, 10, L), forall(member(X,L),algoritmo_genetico).

lista_entregas(Trajeto, Entregas):-
	cidadeArmazem(IdOrigem),
	append([IdOrigem|Armazens], [IdOrigem], Trajeto),
	maplist(map_entrega, Armazens, Entregas),!.
map_entrega(Armazem, Entrega):-entrega(Entrega,_,_,Armazem,_,_).
