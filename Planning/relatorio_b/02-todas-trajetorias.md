# Gerar todas as trajetórias

> *Recebendo os dados das entregas a fazer por 1 camião e dos troços entre
> armazéns: gerar todas as trajetórias possíveis através de sequências de
> armazéns onde deverão ser feitas as entregas.*

Geramos um trajeto possível agrupando todas as cidades a ser visitadas em uma
lista e gerando permutações. Adicionamos a cidade de origem e destino no
início e fim da lista. Para gerar todas as soluções, agrupamos cara trajeto
com o predicado `findall/3`.

```prolog
% gera_trajeto(Trajeto)
% Gera um trajeto possível com base nos fatos de entrega e caminhos
%   ?- trajeto(L).
%   L = [5, 1, 9, 3, 8, 11, 5] ;
%   L = [5, 1, 9, 3, 11, 8, 5] ;
%   L = [5, 1, 9, 8, 3, 11, 5] .
gera_trajeto(Trajeto):-
	cidadeArmazem(IdOrigem),
	findall(IdArmazem, entrega(_, _, _, IdArmazem, _, _), Destinos),
	permutation(Destinos, Permuta),
	append([IdOrigem|Permuta],[IdOrigem], Trajeto).

% gera_todos_trajetos(Trajetos)
% Gera uma lista com todos os caminhos possíveis
%   ?- gera_todos_trajetos(L).
%   L = [[5, 1, 9, 3, 8, 11, 5], [5, 1, 9, 3, 11, 8, 5], [...]].
gera_todos_trajetos(Trajetos):-
	open("/tmp/trajetos.txt", write, Out),
	findall(Trajeto, (gera_trajeto(Trajeto), writeln(Out, Trajeto)), Trajetos),
	!,
	close(Out).
```

\pagebreak
