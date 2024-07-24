% Bibliotecas HTTP
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_cors)).
% Bibliotecas JSON
:- use_module(library(http/json_convert)).
:- use_module(library(http/json)).
:- use_module(library(http/http_json)).

% CORS
:- set_setting(http:cors, [*]).
:- http_handler('/', health, []).
:- http_handler('/health', health, []).
:- http_handler('/schedule', schedule, []).
:- [
	'./01_gera_trajeto.pl',
	'./02_trajeto_menor_tempo.pl',
	'./03_trajeto_menor_tempo_complexo.pl'
].

run_server():-
	(getenv("PORT", PORT_STR); PORT_STR = "3003"),
	(getenv("HOST", HOST); HOST = "http://127.0.0.1"),
	atom_number(PORT_STR, PORT),
	http_server(http_dispatch,[port(PORT),host(HOST)]),
	format("Server started at ~s:~p~n", [HOST, PORT]),
	repeat, sleep(10), fail.

health(_):-
	format(user_output,"GET /health~n",[]),
	reply_json(data{message: "Server is up"}).

schedule(Request):-
	format(user_output,"POST /schedule~n",[]),
	http_read_json(Request, JSON, [json_object(dict)]),
	regista_cidade_armazem(JSON.origem),
	regista_camiao(JSON.camiao),
	regista_armazens(JSON.armazens),
	regista_entregas(JSON.entregas),
	regista_caminhos(JSON.caminhos),
	trajeto_menor_tempo_complexo(Trajeto, Tempo),
	% trajeto_menor_tempo(Trajeto, Tempo),
	reply_json_dict(data{trajeto: Trajeto, tempo: Tempo}),
	format(user_output, "Trajeto: ~p, Tempo: ~p~n", [Tempo, Trajeto]).

regista_cidade_armazem(JSONOrigem):-
	(retractall(cidadeArmazem(_));true),!,
	assertz(cidadeArmazem(JSONOrigem)),
	format(user_output, "Armazem principal: ~p~n", JSONOrigem).

regista_camiao(JSONCamiao):-
	(retractall(carateristicasCam(_,_,_,_,_,_));true),!,
	assertz(carateristicasCam(
		JSONCamiao.nome,
		JSONCamiao.tara,
		JSONCamiao.capacidade_carga,
		JSONCamiao.carga_total_baterias,
		JSONCamiao.autonomia,
		JSONCamiao.tempo_recarga)),
	carateristicasCam(JSONCamiao.nome,_,_,_,_,_),
	format(user_output, "Camiao: ~p~n", JSONCamiao.nome).

regista_armazens([]):-
	(retractall(idArmazem(_,_));true),!.
regista_armazens(JSONArmazens):-
	[Armazem|Armazens] = JSONArmazens,
	regista_armazens(Armazens),
	assertz(idArmazem(Armazem.nome,Armazem.id)),
	format(user_output, "Armazem: ~p~n", Armazem.nome).

regista_entregas([]):-
	(retractall(entrega(_,_,_,_,_,_));true),!.
regista_entregas(JSONEntregas):-
	[Entrega|Entregas] = JSONEntregas,
	regista_entregas(Entregas),
	assertz(entrega(
		Entrega.id,
		Entrega.data,
		Entrega.massa,
		Entrega.armazem,
		Entrega.tempo_colocacao,
		Entrega.tempo_retirada)),
	format(user_output, "Entrega: ~p~n", Entrega.id).

regista_caminhos([]):-
	(retractall(dadosCam_t_e_ta(_,_,_,_,_,_));true),!.
regista_caminhos(JSONCaminhos):-
	[Caminho|Caminhos] = JSONCaminhos,
	regista_caminhos(Caminhos),
	assertz(dadosCam_t_e_ta(
		Caminho.camiao,
		Caminho.origem,
		Caminho.destino,
		Caminho.tempo,
		Caminho.energia,
		0)),
	format(user_output, "Caminho: ~s ~p -> ~p~n", [Caminho.camiao, Caminho.origem, Caminho.destino]).
