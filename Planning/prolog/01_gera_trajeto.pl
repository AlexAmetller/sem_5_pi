% gera_trajeto(Trajeto) {{{
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

% }}}
% gera_todos_trajetos(Trajetos) {{{
% Gera uma lista com todos os caminhos possíveis
%   ?- gera_todos_trajetos(L).
%   L = [[5, 1, 9, 3, 8, 11, 5], [5, 1, 9, 3, 11, 8, 5], [...]].

gera_todos_trajetos(Trajetos):-
	open("/tmp/trajetos.txt", write, Out),
	findall(Trajeto, (gera_trajeto(Trajeto), writeln(Out, Trajeto)), Trajetos),
	!,
	close(Out).

% }}}
