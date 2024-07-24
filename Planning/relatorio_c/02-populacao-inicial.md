# Criação da população inicial do Algoritmo Genético (AG) {#cap2}

De modo a melhorar a população inicial do AG, usaremos as soluções fornecidas
pelas heurísticas de menor distância e heurística combinada de menor distância
e maior peso. Para tanto, necessitamos primeiramente gerar as soluções e
mapear a lista de armazéns a uma lista de entregas:

```prolog
% lista_entregas/2 
%   gera a lista de entregas de um trajeto que comeca e 
%   termina no armazém de origem
%     ?- lista_entregas([5, 17, 8, 3, 11, 9, 1, 5], X).
%     X = [4398, 4443, 4445, 4449, 4438, 4439].
lista_entregas(Trajeto, Entregas):-
	append([_|Armazens], [_], Trajeto),
	maplist(map_entrega, Armazens, Entregas),!.

% map_entrega/2
%   predicado auxiliar usado para mapear um armazém a uma entrega
%     ?- map_entrega(9, X).
%     X = 4438.
map_entrega(Armazem, Entrega):-entrega(Entrega,_,_,Armazem,_,_).
```

Para gerar a população inicial, ajustamos o predicado _gera_populacao/0_,
definido em [_Item 1.3_](#AG), criando um critério para adicionar a
solução das duas heurísticas à cauda da lista `Populacao`. No caso das
solucões heurísticas serem iguais, realizamos uma __mutacao__ em um dos
indivíduos. Os restantes indivíduos são gerados por permutações aleatórias
pelo predicado original, que não realiza repetição dos indivíduos na
população.

```prolog
% predicado inserido em sequência da condicão de paragem gera_populacao(0, ...)
gera_populacao(2,_,Populacao):-
	solucao_heuristica_menor_distancia(SolucaoA, _),
	solucao_heuristica_mista(SolucaoB, _),
	lista_entregas(SolucaoA, IndividuoA),  % armazens->entregas
	lista_entregas(SolucaoB, IndividuoB),  % armazens->entregas
	((IndividuoA == IndividuoB,            % muta-se indivíduo C
		length(IndividuoB, NumEntregas),
		gerar_pontos(0, NumEntregas, P1, P2),
		mutar(IndividuoB, P1, P2, IndividuoC),
		Populacao = [IndividuoA, IndividuoC]);
	 (Populacao = [IndividuoA, IndividuoB])).
```

\pagebreak
