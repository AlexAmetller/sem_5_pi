# Aleatoriedade no cruzamento entre indivíduos da população {#cap3}

Queremos evitar que o cruzamento se dê sempre entre elementos consecutivos da
população, i.e.: 1º e 2º elementos, 3º e 4º elementos, etc. Para tanto,
modificamos o predicado _cruzamento/2_ definido no [_Item 1.3_](#AG) de forma
a selecionar 2 elementos aleatoriamente, removê-los da lista e aplicar os
cruzamentos:

```prolog
% cruzamento/4
%   gera uma nova populacao com indivíduos cruzados, 
%   tomando 2 a 2 elementos aleatoriamente
%     ?- cruzamento([[4333,4334,4335], [4335, 4334, 4333]], X).
%     X = [[4333, 4334, 4335], [4335, 4334, 4333]].
cruzamento([],[]).
cruzamento([Individuo],[Individuo]).
cruzamento(Populacao, [Cruzado1, Cruzado2 | PopulacaoCruzada]):-
	random_select(Individuo1, Populacao, Resto1),
	random_select(Individuo2, Resto1, Resto),
	((faz_cruzamento(),!,
		length(Individuo1, NumEntregas),
		gerar_pontos(0, NumEntregas, P1, P2),
		cruzar(Individuo1,Individuo2,P1,P2,Cruzado1),
		cruzar(Individuo2,Individuo1,P1,P2,Cruzado2));
	 (Cruzado1 = Individuo1, Cruzado2 = Individuo2)),
	cruzamento(Resto, PopulacaoCruzada),!.
```

\pagebreak
