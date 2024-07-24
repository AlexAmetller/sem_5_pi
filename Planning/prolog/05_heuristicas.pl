:- [ './03_trajeto_menor_tempo_complexo.pl' ].
% solucao_heuristica_menor_distancia {{{

cidade_mais_proxima(_, [Destino], Destino):-true.
cidade_mais_proxima(Origem, Destinos, MaisProxima):-
	[Cidade|DemaisCidades] = Destinos,
	cidade_mais_proxima(Origem, DemaisCidades, MaisProximaDemaisCidades),
	dadosCam_t_e_ta(_,Origem,Cidade,Tempo1,_,_),
	dadosCam_t_e_ta(_,Origem,MaisProximaDemaisCidades,Tempo2,_,_),
	((Tempo1 < Tempo2, MaisProxima is Cidade);
	 (MaisProxima is MaisProximaDemaisCidades)),!.

 trajeto_mais_proximo(_, [], []):-true.
 trajeto_mais_proximo(Origem, Cidades, Trajeto):-
	cidade_mais_proxima(Origem, Cidades, MaisProxima),
	delete(Cidades, MaisProxima, DemaisCidades),
	trajeto_mais_proximo(MaisProxima, DemaisCidades, TrajetoRemanescente),
	[MaisProxima|TrajetoRemanescente] = Trajeto, !.

solucao_heuristica_menor_distancia(Trajeto, Tempo):-
	cidadeArmazem(Origem),
	findall(Cidade, entrega(_, _, _, Cidade, _, _), Cidades),
	trajeto_mais_proximo(Origem, Cidades, TrajetoMaisProximo),
	append([Origem|TrajetoMaisProximo], [Origem], Trajeto),
	calcula_tempo_total_trajeto_complexo(Trajeto, Tempo),!.
	% format(user_output, "Trajeto: ~p Tempo: ~p~n", [Trajeto, Tempo]),!.

% }}}
% solucao_heuristica_menor_peso {{{
cidade_maior_peso([Destino], Destino):-true.
cidade_maior_peso(Destinos, CidadeMaiorPeso):-
	[Cidade|DemaisCidades] = Destinos,
	cidade_maior_peso(DemaisCidades, CidadeMaiorPesoDemaisCidades),
	entrega(_,_,Peso1,Cidade,_,_),
	entrega(_,_,Peso2,CidadeMaiorPesoDemaisCidades,_,_),
	((Peso1 > Peso2, CidadeMaiorPeso is Cidade);
	 (CidadeMaiorPeso is CidadeMaiorPesoDemaisCidades)),!.

 trajeto_menor_peso([], []):-true.
 trajeto_menor_peso(Cidades, Trajeto):-
	cidade_maior_peso(Cidades, MenorPeso),
	delete(Cidades, MenorPeso, DemaisCidades),
	trajeto_menor_peso(DemaisCidades, TrajetoRemanescente),
	[MenorPeso|TrajetoRemanescente] = Trajeto, !.

solucao_heuristica_menor_peso(Trajeto, Tempo):-
	cidadeArmazem(Origem),
	findall(Cidade, entrega(_, _, _, Cidade, _, _), Cidades),
	trajeto_menor_peso(Cidades, TrajetoMenorPeso),
	append([Origem|TrajetoMenorPeso], [Origem], Trajeto),
	calcula_tempo_total_trajeto_complexo(Trajeto, Tempo),!.
	% format(user_output, "Trajeto: ~p Tempo: ~p~n", [Trajeto, Tempo]),!.

% }}}
% solucao_heuristica_mista {{{

cidade_mista(_, [Destino], Destino):-true.
cidade_mista(Origem, Destinos, MelhorCidade):-
	[Cidade|DemaisCidades] = Destinos,
	cidade_mista(Origem, DemaisCidades, MelhorCidadeDemaisCidades),
	dadosCam_t_e_ta(_,Origem,Cidade,Tempo1,_,_),
	dadosCam_t_e_ta(_,Origem,MelhorCidadeDemaisCidades,Tempo2,_,_),
	entrega(_,_,Peso1,Cidade,_,_),
	entrega(_,_,Peso2,MelhorCidadeDemaisCidades,_,_),
	Misto1 is Peso1 / Tempo1,
	Misto2 is Peso2 / Tempo2,
	((Misto1 > Misto2, MelhorCidade is Cidade);
	 (MelhorCidade is MelhorCidadeDemaisCidades)),!.

trajeto_misto(_, [], []):-true.
trajeto_misto(Origem, Cidades, Trajeto):-
	cidade_mista(Origem, Cidades, Proxima),
	delete(Cidades, Proxima, DemaisCidades),
	trajeto_misto(Proxima, DemaisCidades, TrajetoRemanescente),
	[Proxima|TrajetoRemanescente] = Trajeto, !.

solucao_heuristica_mista(Trajeto, Tempo):-
	cidadeArmazem(Origem),
	findall(Cidade, entrega(_, _, _, Cidade, _, _), Cidades),
	trajeto_misto(Origem, Cidades, TrajetoMisto),
	append([Origem|TrajetoMisto], [Origem], Trajeto),
	calcula_tempo_total_trajeto_complexo(Trajeto, Tempo),!.
	% format(user_output, "Trajeto: ~p Tempo: ~p~n", [Trajeto, Tempo]),!.

% }}}

heuristica():-
	trajeto_menor_tempo_complexo(Trajeto, Tempo),
	solucao_heuristica_menor_distancia(_, Tempo1),
	solucao_heuristica_menor_peso(_,      Tempo2),
	solucao_heuristica_mista(_,           Tempo3),
	Min1 is min(Tempo1, Tempo2),
	Min2 is min(Min1, Tempo3),
	format(user_output, "| ~p | ~p | ~p | ~p | ~p | ~p~n", [Tempo, Tempo1, Tempo2, Tempo3, Min2, Trajeto]).

% ?- trajeto_menor_tempo_complexo(Trajeto,       Tempo), format(user_output, "trajeto_menor_tempo_complexo       - Tempo: ~p, Trajeto:~p~n", [Tempo, Trajeto]).
% ?- solucao_heuristica_menor_distancia(Trajeto, Tempo), format(user_output, "solucao_heuristica_menor_distancia - Tempo: ~p, Trajeto:~p~n", [Tempo, Trajeto]).
% ?- solucao_heuristica_menor_peso(Trajeto,      Tempo), format(user_output, "solucao_heuristica_menor_peso      - Tempo: ~p, Trajeto:~p~n", [Tempo, Trajeto]).
% ?- solucao_heuristica_mista(Trajeto,           Tempo), format(user_output, "solucao_heuristica_mista           - Tempo: ~p, Trajeto:~p~n", [Tempo, Trajeto]).

