% Capítulo 5
% dados e entregas
:- [ './99_data.pl' ].
:- [ './03_trajeto_menor_tempo_complexo.pl' ].
:- [ './05_heuristicas.pl' ].
entrega(4439, 20221205, 200, 1, 8, 10).
entrega(4438, 20221205, 150, 9, 7, 9).
entrega(4445, 20221205, 100, 3, 5, 7).
entrega(4443, 20221205, 120, 8, 6, 8).
entrega(4449, 20221205, 300, 11, 15, 20).
entrega(4398, 20221205, 310, 17, 16, 20).
entrega(4432, 20221205, 270, 14, 14, 18).
% entrega(4437, 20221205, 180, 12, 9, 11).
% entrega(4451, 20221205, 220, 6, 9, 12).
% entrega(4452, 20221205, 390, 13, 21, 26).
% entrega(4444, 20221205, 380, 2, 20, 25).
% entrega(4455, 20221205, 280, 7, 14, 19).
% entrega(4399, 20221205, 260, 15, 13, 18).
% entrega(4454, 20221205, 350, 10, 18, 22).
% entrega(4446, 20221205, 260, 4, 14, 17).
% entrega(4456, 20221205, 330, 16, 17, 21).

% parameterização
nr_geracoes(20).
dim_populacao(30).
prob_cruzamento(0.4).
prob_mutacao(0.4).
ganho_torneio(1.2).

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
	 format(user_output, '[ERROR]: Dimensão da populacão super o número de possíveis permutacões: ~p > ~p.~n', [DimPopulacao, MaxPermutacoes]),!,
	 fail);
	 (DimPopulacao < 3,
	 format(user_output, '[ERROR]: Dimensão da populacão ~p deve ser superior a 3.~n', [DimPopulacao]),!,
	 fail);true),!.

% gera_populacao/1
%   gera o conjunto inicial de indivíduos da populacao
gera_populacao(Populacao):-
	dim_populacao(DimPopulacao),
	findall(Entrega, entrega(Entrega,_,_,_,_,_), Entregas),
	gera_populacao(DimPopulacao, Entregas, Populacao),!.
gera_populacao(0,_,[]):-!.
gera_populacao(2,_,Populacao):-
	solucao_heuristica_menor_distancia(SolucaoA, _),
	solucao_heuristica_mista(SolucaoB, _),
	lista_entregas(SolucaoA, IndividuoA),
	lista_entregas(SolucaoB, IndividuoB),
	((IndividuoA == IndividuoB,
		length(IndividuoB, NumEntregas),
		gerar_pontos(0, NumEntregas, P1, P2),
		mutar(IndividuoB, P1, P2, IndividuoC),
		Populacao = [IndividuoA, IndividuoC]);
	 (Populacao = [IndividuoA, IndividuoB])).
gera_populacao(DimPopulacao, Entregas, [Individuo|Populacao]):-
	DimPopulacao1 is DimPopulacao - 1,
	gera_populacao(DimPopulacao1, Entregas, Populacao),
	repeat,
	random_permutation(Entregas, Individuo),
	not(member(Individuo, Populacao)).

lista_entregas(Trajeto, Entregas):-
	cidadeArmazem(IdOrigem),
	append([IdOrigem|Armazens], [IdOrigem], Trajeto),
	maplist(map_entrega, Armazens, Entregas),!.
map_entrega(Armazem, Entrega):-entrega(Entrega,_,_,Armazem,_,_).

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

% ordena_populacao_torneio/2 {{{
%   ordena as populacoes avaliadas no formato de tuplo Individuo*Valor,
%   permite indivíduos de menor avaliacao tomar posicões mais elevadas
%     ?- ordena_populacao_torneio([[]*11, []*15, []*10], X).
%     X = [[]*11, []*10, []*15].
%     ?- ordena_populacao_torneio([[]*11, []*15, []*10], X).
%     X = [[]*10, []*11, []*15].
ordena_populacao_torneio(Avaliacoes, AvaliacoesOrdenadas):-
	predsort(ordena_torneio, Avaliacoes, AvaliacoesOrdenadas),!.
% ordena_torneio/3 
%   implementacao do +Pred do predicado `predsort`.
%   permite atribuir o valor `>` a R no caso V1 = 11, V2 = 10
%   se o Peso gerado aleatóriamente for superior a 1.1
%   exemplo:
%     ?- ordena_torneio(R, []*11, []*10). % Peso aleatório < 1.1
%     R = (<).
%     ?- ordena_torneio(R, []*11, []*10). % Peso aleatório > 1.1
%     R = (>).
ordena_torneio(R, _*V1, _*V2):-
	ganho_torneio(Ganho),
    random(1, Ganho, Peso),
	V1 > V2,!,
	(V1 > V2 * Peso -> R = > ; R = < ).
ordena_torneio(R, _*V1, _*V2):-
	ganho_torneio(Ganho),
    random(1, Ganho, Peso),
	V1 < V2,!,
	(V1 * Peso < V2 -> R = < ; R = > ).
ordena_torneio(R, _, _):- R = > .

media_avaliacoes(Avaliacoes, Media):-
	maplist(arg(2), Avaliacoes, Tempos),
	sum_list(Tempos, Soma),
	length(Avaliacoes, NR),
	Media is Soma / NR.

gera_geracao(NumGeracaoAtual,NumGeracoes,AtualPopulacaoAvaliada):- % paragem, última geracao
	NumGeracaoAtual == NumGeracoes,!,
	format(user_output, '~nGeracao ~p: ==================== ~n', [NumGeracaoAtual]),
	print_lista(AtualPopulacaoAvaliada),
	[Melhor | _] = AtualPopulacaoAvaliada,
	media_avaliacoes(AtualPopulacaoAvaliada, Media),
	format(user_output, '> Melhor resultado: ~p ', [Melhor]),
	format(user_output, '> Média dos resultados: ~p~n', [Media]).
gera_geracao(_, NumGeracoes, AtualPopulacaoAvaliada):-
	estabilizou_populacao(AtualPopulacaoAvaliada);
	melhor_solucao_suficiente(AtualPopulacaoAvaliada),
	gera_geracao(NumGeracoes, NumGeracoes, AtualPopulacaoAvaliada).
gera_geracao(NumGeracaoAtual,NumGeracoes,AtualPopulacaoAvaliada):-
	format(user_output, '~nGeracao ~p: ==================== ~n', [NumGeracaoAtual]),
	print_lista(AtualPopulacaoAvaliada),
	maplist(arg(1), AtualPopulacaoAvaliada, P1), % P1 populacao atual
	cruzamento(P1, P2),        % P2 populacao cruzada
	mutacao(P2, P3),           % P3 populacao mutada
    append([P1, P2, P3], Q0),  % Q0 = P1 + P2 + P3 = populacao total
	list_to_set(Q0, Q1),       % Q1 = populacao total sem repeticoes
	avalia_populacao(Q1, A1),  % A1 avaliacoes na forma [...]*Valor
	ordena_populacao(A1, O1),  % O1 avaliacoes ordenadas menor->maior
    select(Melhor1, O1, O2),   % Melhor1 = melhor indivíduo do set
	select(Melhor2, O2, O3),   % Melhor2 = segundo melhor do set
							   % O3 populacao total sem Melhor1 e Melhor2
    ordena_populacao_torneio(O3, O4), % ordenacao do restante por torneio
	dim_populacao(DimPopulacao), N is DimPopulacao - 2,
	% selecionam-se os primeiros N-2 elementos restantes para prox. geracao
    sublista(O4, 0, N, O5, _, _),
	append([Melhor1, Melhor2], O5, NovaPopulacaoOrdenada),

	% % debug log
	% format(user_output, '> P1: populacao atual ~n', []),
	% print_lista(P1),
	% format(user_output, '> P2: populacao cruzada ~n', []),
	% print_lista(P2),
	% format(user_output, '> P3: populacao mutada ~n', []),
	% print_lista(P3),
	% format(user_output, '> Q0: populacao total ~n', []),
	% print_lista(Q0),
	% format(user_output, '> Q1: populacao total repeticoes removidas ~n', []),
	% print_lista(Q1),
	% format(user_output, '> A1: avaliacoes ~n', []),
	% print_lista(A1),
	% format(user_output, '> O1: avaliacoes ordenadas ~n', []),
	% print_lista(O1),
	% format(user_output, '> O3: avaliacoes restantes ordenadas (sem M1, M2) ~n', []),
	% print_lista(O3),
	% format(user_output, '> O4: avaliacoes restantes ordenadas por torneio ~n', []),
	% print_lista(O4),
	% format(user_output, '> O5: avaliacoes de torneio selecionadas ~n', []),
	% print_lista(O5),
	% format(user_output, '> Melhor1: ~p~n, Melhor2: ~p~n', [Melhor1, Melhor2]),
	% format(user_output, '> DimPopulacao: ~p, N: ~p~n', [DimPopulacao, N]),
	% format(user_output, '> NovaPopulacaoOrdenada: ~n', []),
	% print_lista(NovaPopulacaoOrdenada),

	NumProximaGeracao is NumGeracaoAtual + 1,
	gera_geracao(NumProximaGeracao,NumGeracoes,NovaPopulacaoOrdenada).

% cruzamento/4
%   gera uma nova populacao com indivíduos cruzados, tomando 2 a 2 elementos
%     ?- cruzamento([[4001,4002,4003],
%                    [4002,4001,4003],
%                    [4003,4001,4002],
%                    [4001,4003,4002],
%                    [4002,4003,4001]], X).
cruzamento([],[]).
cruzamento([Individuo],[Individuo]).
% ========> Método modificado
cruzamento(Populacao, [Cruzado1, Cruzado2 | PopulacaoCruzada]):-
	random_select(Individuo1, Populacao, Resto1),
	random_select(Individuo2, Resto1, Resto),
	% format(user_output, "Individuo1: ~p~n", [Individuo1]),
	% format(user_output, "Individuo2: ~p~n", [Individuo2]),
	((faz_cruzamento(),!,
		% format(user_output, "Faz cruzamento: ~n", []),
		length(Individuo1, NumEntregas),
		gerar_pontos(0, NumEntregas, P1, P2),
		cruzar(Individuo1,Individuo2,P1,P2,Cruzado1),
		cruzar(Individuo2,Individuo1,P1,P2,Cruzado2));
	 (Cruzado1 = Individuo1, Cruzado2 = Individuo2)),
	% format(user_output, "Cruzado1: ~p~n", [Cruzado1]),
	% format(user_output, "Cruzado2: ~p~n", [Cruzado2]),
	% format(user_output, "Resto: ~p~n", [Resto]),
	cruzamento(Resto, PopulacaoCruzada),!.

% gerar_pontos/4
%   gera dois pontos aleatórios tal que: Min <= P1 > P2 < Max
%     ?- gerar_pontos(0, 3, P1, P2).
%     P1 = 0, P2 = 2.
gerar_pontos(Min, Max, P1, P2):-
	Max1 is Max - 1,
	random(Min, Max1, P1),
	P11 is P1 + 1,
	random(P11, Max, P2),!.

% faz_cruzamento/0
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

% ?- algoritmo_genetico.


% TODO
estabilizou_populacao(NumGeracaoAtual, AtualPopulacaoAvaliada):-
	maplist(arg(1), AtualPopulacaoAvaliada, PopulacaoAtual),
	assertz(geracao_anterior(NumGeracaoAtual, PopulacaoAtual)),
	NumGeracaoAtual > 4, % aqui fazemos a comparacao
	NumGeracaoAnterior = NumGeracaoAtual - 4,
	geracao_anterior(NumGeracaoAnterior, PopulacaoAnterior),
	PopulacaoAnterior == PopulacaoAtual.





% TODO
melhor_solucao_suficiente(AtualPopulacaoAvaliada):-fail.




% ?- numlist(1, 10, L), forall(member(X,L),algoritmo_genetico).
