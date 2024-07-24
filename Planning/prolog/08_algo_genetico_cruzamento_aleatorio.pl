% capítulo 3

prob_cruzamento(0.4).

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
		format(user_output, "Faz cruzamento: ~n", []),
		length(Individuo1, NumEntregas),
		gerar_pontos(0, NumEntregas, P1, P2),
		cruzar(Individuo1,Individuo2,P1,P2,Cruzado1),
		cruzar(Individuo2,Individuo1,P1,P2,Cruzado2));
	 (Cruzado1 = Individuo1, Cruzado2 = Individuo2)),
	% format(user_output, "Cruzado1: ~p~n", [Cruzado1]),
	% format(user_output, "Cruzado2: ~p~n", [Cruzado2]),
	% format(user_output, "Resto: ~p~n", [Resto]),
	cruzamento(Resto, PopulacaoCruzada),!.

% faz_cruzamento/0
faz_cruzamento():-
	prob_cruzamento(ProbCruzamento),
	random(0.0, 1.0, Probabilidade),!,
	Probabilidade =< ProbCruzamento.

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

% gerar_pontos/4
%   gera dois pontos aleatórios tal que: Min <= P1 > P2 < Max
%     ?- gerar_pontos(0, 3, P1, P2).
%     P1 = 0, P2 = 2.
gerar_pontos(Min, Max, P1, P2):-
	Max1 is Max - 1,
	random(Min, Max1, P1),
	P11 is P1 + 1,
	random(P11, Max, P2),!.

% ?- cruzamento([[4001,4002,4003], [4002,4001,4003], [4003,4001,4002], [4001,4003,4002], [4002,4003,4001]], X).
