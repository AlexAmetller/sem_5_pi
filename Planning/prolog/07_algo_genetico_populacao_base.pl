% capítulo 2
:- [ './99_data.pl' ].
:- [ './05_heuristicas.pl' ].

entrega(4439, 20221205, 200, 1, 8, 10).
entrega(4438, 20221205, 150, 9, 7, 9).
entrega(4445, 20221205, 100, 3, 5, 7).
entrega(4443, 20221205, 120, 8, 6, 8).
entrega(4449, 20221205, 300, 11, 15, 20).
entrega(4398, 20221205, 310, 17, 16, 20).


dim_populacao(5).

gerar_pontos(Min, Max, P1, P2):-
	Max1 is Max - 1,
	random(Min, Max1, P1),
	P11 is P1 + 1,
	random(P11, Max, P2),!.

lista_entregas(Trajeto, Entregas):-
	append([_|Armazens], [_], Trajeto),
	maplist(map_entrega, Armazens, Entregas),!.
map_entrega(Armazem, Entrega):-entrega(Entrega,_,_,Armazem,_,_).


% gera_populacao/1
%   gera o conjunto inicial de indivíduos da populacao
gera_populacao(Populacao):-
	dim_populacao(DimPopulacao),
	findall(Entrega, entrega(Entrega,_,_,_,_,_), Entregas),
	gera_populacao(DimPopulacao, Entregas, Populacao),!.

% ALTERCAO
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
