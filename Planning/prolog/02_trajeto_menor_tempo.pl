% calcula_tempo_entre_armazens(IdOrigem,IdDestino,Tempo) {{{
% Dados o id de dois armazéns, calcula o tempo que um camião leva para
% percorrer o troco entre os dois, considerando somente o tempo do trajeto
% com carga cheia e o tempo de retirada dos produtos em funcão da entrega.
%
%   ?- calcula_tempo_entre_armazens(1,9,X).
%   X = 194.

calcula_tempo_entre_armazens(IdOrigem,IdDestino,Tempo):-
	\+ entrega(_,_,_,IdDestino,_,_),
	dadosCam_t_e_ta(_,IdOrigem, IdDestino, Tempo, _, _).

calcula_tempo_entre_armazens(IdOrigem,IdDestino,Tempo):-
	entrega(_,_,_,IdDestino,_,TempoRetirada),
	dadosCam_t_e_ta(_,IdOrigem, IdDestino, TempoCaminho, _, _),
	Tempo is TempoRetirada + TempoCaminho,!.

% }}}
% tempos_trajeto(Trajeto, Tempos) {{{
% Gera lista de tempos entre armazéns de um trajeto.
%
%   ?- tempos_trajeto([5, 1, 9, 3, 8, 11, 5], T).
%   T = [151, 194, 93, 46, 73, 55].

tempos_trajeto([_], []).
tempos_trajeto([IdOrigem,IdDestino|Trajeto], [Tempo|Tempos]):-
	tempos_trajeto([IdDestino|Trajeto], Tempos),
	calcula_tempo_entre_armazens(IdOrigem, IdDestino, Tempo),!.

% }}}
% calcula_tempo_total_trajeto(Trajeto, Tempo) {{{
% Soma os tempos de um trajeto, retornando o tempo total do trajeto.
%
%   ?- calcula_tempo_total_trajeto([5, 1, 9, 3, 8, 11, 5], T).
%   T = 612.

calcula_tempo_total_trajeto(Trajeto, Tempo):-
	tempos_trajeto(Trajeto,Tempos),
	sumlist(Tempos,Tempo).

% }}}
% trajeto_menor_tempo {{{
% Gera o trajeto de menor tempo (simplificado).
%
%   ?- trajeto_menor_tempo(Trajeto, Tempo).
%   Trajeto = [5, 8, 3, 1, 11, 9, 5],
%   Tempo = 510.

trajeto_menor_tempo(Trajeto,Tempo):-
	(tmt_run;true),var_menor_tempo(Trajeto,Tempo),!.

tmt_run:-
	retractall(var_menor_tempo(_,_)),
	assertz(var_menor_tempo(_,10000000)),
	!,
	gera_trajeto(Trajeto),
	calcula_tempo_total_trajeto(Trajeto,Tempo),
	% writeln([Trajeto,Tempo]),
	tmt_atualiza(Trajeto, Tempo),
	fail.

tmt_atualiza(Trajeto,Tempo):-
	var_menor_tempo(_,MenorTempo),
	((Tempo < MenorTempo,!,
		retract(var_menor_tempo(_,_)),
		assertz(var_menor_tempo(Trajeto,Tempo)));true).

% }}}
