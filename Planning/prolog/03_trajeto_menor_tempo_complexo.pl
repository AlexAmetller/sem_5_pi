energia80(Camiao, Energia80):-
	carateristicasCam(Camiao,_,_,Energia100,_,_),
	Energia80 is 0.8 * Energia100.

energia20(Camiao, Energia20):-
	carateristicasCam(Camiao,_,_,Energia100,_,_),
	Energia20 is 0.2 * Energia100.

tempo_carregamento(Camiao, EnergiaAtual, EnergiaFinal, Tempo):-
	carateristicasCam(Camiao,_,_,_,_,TempoCarregamento20a80),
	energia80(Camiao, Energia80),
	energia20(Camiao, Energia20),
	Tempo is (EnergiaFinal - EnergiaAtual) * TempoCarregamento20a80 / (Energia80 - Energia20).

faz_carregamento(Camiao, EnergiaAtual, EnergiaProximoCaminho):-
	energia20(Camiao, Energia20),
	EnergiaFinal is EnergiaAtual - EnergiaProximoCaminho,
	EnergiaFinal < Energia20.

faz_paragem_adicional(Camiao, EnergiaAtual):-
	energia20(Camiao, Energia20),
	EnergiaAtual < Energia20.

calcula_caminho(Camiao, CidadeOrigem, CidadeDestino, CargaEntrega, Energia, Tempo):-
	carateristicasCam(Camiao,Tara,CapacidadeCarga,_,_,_),
	dadosCam_t_e_ta(Camiao,CidadeOrigem,CidadeDestino,TempoCaminho,EnergiaCaminho,_),
	PesoAtualCamiao is Tara + CargaEntrega,
	PesoMaximoCamiao is Tara + CapacidadeCarga,
	Energia is EnergiaCaminho * PesoAtualCamiao / PesoMaximoCamiao,
	Tempo is TempoCaminho * PesoAtualCamiao / PesoMaximoCamiao.

cargaTotal([], 0).
cargaTotal([Entrega|Entregas], CargaTotal):-
	cargaTotal(Entregas, CargaSubTotal),
	entrega(Entrega, _, Carga, _, _, _),
	CargaTotal is CargaSubTotal + Carga.


calcula_trajeto(_, _, [], _, _, Tempo):- Tempo is 0.
calcula_trajeto(_, _, [_], _, _, Tempo):- Tempo is 0.
calcula_trajeto(Camiao, CidadeAnterior, [Cidade|Trajeto], CargaAtual, EnergiaAtual, Tempo):-
	[ProximaCidade|_] = Trajeto,
	(
		(entrega(_, _, CargaEntrega, Cidade, _, TempoRetirada), Entrega = true);
		(CargaEntrega is 0, TempoRetirada is 0, Entrega = false)
	),

	CargaFinal is CargaAtual - CargaEntrega,

	calcula_caminho(Camiao, Cidade, ProximaCidade, CargaFinal, EnergiaCaminho, TempoCaminho),

	((length(Trajeto, 1), UltimaEntrega = true); UltimaEntrega = false),
	energia20(Camiao, Energia20),
	energia80(Camiao, Energia80),

	(
		(faz_paragem_adicional(Camiao, EnergiaAtual),
			FazParagem = true,
			FazCarregamento = true,
			((UltimaEntrega,
				energia20(Camiao, Energia20), EnergiaSaida is Energia20 + EnergiaCaminho);
			 (EnergiaSaida is Energia80)),
			tempo_carregamento(Camiao, Energia20, EnergiaSaida, TempoCarregamento),
			dadosCam_t_e_ta(Camiao,CidadeAnterior,Cidade,_,_,TempoAdicional)
		);
		(faz_carregamento(Camiao, EnergiaAtual, EnergiaCaminho),
			FazParagem = false,
			FazCarregamento = true,
			((UltimaEntrega,
				energia20(Camiao, Energia20),
				EnergiaSaida is Energia20 + EnergiaCaminho);
			 (EnergiaSaida is Energia80)),
			tempo_carregamento(Camiao, EnergiaAtual, EnergiaSaida, TempoCarregamento),
			TempoAdicional is 0
		);
		(
			FazParagem = false,
			FazCarregamento = false,
			EnergiaSaida is EnergiaAtual,
			TempoCarregamento is 0,
			TempoAdicional is 0
		)
	),

	EnergiaFinal is EnergiaSaida - EnergiaCaminho,

	TempoEspera is max(TempoRetirada, TempoCarregamento),
	TempoEntrega is TempoCaminho + TempoAdicional + TempoEspera,

	% format(user_output, "Cidade: ~p~n", [Cidade]),
	% format(user_output, "  ProximaCidade: ~p~n", [ProximaCidade]),
	% format(user_output, "  EnergiaAtual: ~p~n", [EnergiaAtual]),
	% format(user_output, "  Entrega: ~p~n", [Entrega]),
	% format(user_output, "  CargaEntrega: ~p~n", [CargaEntrega]),
	% format(user_output, "  TempoRetirada ~p~n", [TempoRetirada]),
	% format(user_output, "  CargaAtual: ~p~n", [CargaAtual]),
	% format(user_output, "  CargaFinal: ~p~n", [CargaFinal]),
	% format(user_output, "  EnergiaCaminho: ~p~n", [EnergiaCaminho]),
	% format(user_output, "  TempoCaminho: ~p~n", [TempoCaminho]),
	% format(user_output, "  UltimaEntrega: ~p~n", [UltimaEntrega]),
	% format(user_output, "  EnergiaSaida: ~p~n", [EnergiaSaida]),
	% format(user_output, "  EnergiaFinal: ~p~n", [EnergiaFinal]),
	% format(user_output, "  FazParagem: ~p~n", [FazParagem]),
	% format(user_output, "  FazCarregamento: ~p~n", [FazCarregamento]),
	% format(user_output, "  TempoCarregamento: ~p~n", [TempoCarregamento]),
	% format(user_output, "  + TempoAdicional: ~p~n", [TempoAdicional]),
	% format(user_output, "  + TempoEspera: ~p~n", [TempoEspera]),
	% format(user_output, "  + TempoCaminho: ~p~n~n", [TempoCaminho]),

	calcula_trajeto(Camiao, Cidade, Trajeto, CargaFinal, EnergiaFinal, TempoTotal),
	Tempo is TempoTotal + TempoEntrega.

calcula_tempo_total_trajeto_complexo(Trajeto, Tempo):-
	findall(Entrega, entrega(Entrega, _, _, _, _, _), Entregas),
	cargaTotal(Entregas, CargaTotal),
 	carateristicasCam(Camiao,_,_,EnergiaInicial,_,_),
	calcula_trajeto(Camiao, _, Trajeto, CargaTotal, EnergiaInicial, Tempo),!.
	% format(user_output, "Trajeto: ~p Tempo: ~p~n", [Trajeto, Tempo]),!.

trajeto_menor_tempo_complexo(Trajeto,Tempo):-
	(tmtc_run;true),var_menor_tempo_complexo(Trajeto,Tempo),!.

tmtc_run:-
	retractall(var_menor_tempo_complexo(_,_)),
	assertz(var_menor_tempo_complexo(_,10000000)),
	!,
	gera_trajeto(Trajeto),
	calcula_tempo_total_trajeto_complexo(Trajeto,Tempo),
	tmtc_atualiza(Trajeto, Tempo),
	fail.

tmtc_atualiza(Trajeto,Tempo):-
	var_menor_tempo_complexo(_,MenorTempo),
	((Tempo < MenorTempo,!,
		retract(var_menor_tempo_complexo(_,_)),
		assertz(var_menor_tempo_complexo(Trajeto,Tempo)));true).

% ?- trajeto_menor_tempo_complexo(Trajeto, Tempo).
