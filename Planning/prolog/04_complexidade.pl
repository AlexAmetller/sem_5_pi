% entrega(4439, 20221205, 200, 1, 8, 10).
% entrega(4438, 20221205, 150, 9, 7, 9).
% entrega(4445, 20221205, 100, 3, 5, 7).
% entrega(4443, 20221205, 120, 8, 6, 8).
% entrega(4449, 20221205, 300, 11, 15, 20).
% entrega(4398, 20221205, 310, 17, 16, 20).
% entrega(4432, 20221205, 270, 14, 14, 18).
% entrega(4437, 20221205, 180, 12, 9, 11).
% entrega(4451, 20221205, 220, 6, 9, 12).
% entrega(4452, 20221205, 390, 13, 21, 26).
% entrega(4444, 20221205, 380, 2, 20, 25).
% entrega(4455, 20221205, 280, 7, 14, 19).
% entrega(4399, 20221205, 260, 15, 13, 18).
% entrega(4454, 20221205, 350, 10, 18, 22).
% entrega(4446, 20221205, 260, 4, 14, 17).
% entrega(4456, 20221205, 330, 16, 17, 21).

complexidade():-
	statistics(walltime, [_ | [_]]),
	trajeto_menor_tempo_complexo(Trajeto, Tempo),
	statistics(walltime, [_ | [TSol]]),
	format(user_output, "TSol: ~p ms, Tempo: ~p s, Trajeto: ~p~n", [TSol, Tempo, Trajeto]).
