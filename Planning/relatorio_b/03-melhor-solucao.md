# Melhor solução

> *Avaliar essas trajetórias de acordo com o tempo para completar todas as
> entregas e voltar ao armazém base de Matosinhos e escolher a solução que
> permite a volta com o camião mais cedo.*

## Cálculo de todas soluções

Definimos o predicado `trajeto_menor_tempo_complexo/2` que, para cada trajeto
gerado por `gera_trajeto/2`, utiliza o predicado
`calcula_tempo_total` `_trajeto_complexo/2` para calcular o tempo total de um
trajeto, e o compara com o melhor trajeto encontrado até o momento. O melhor
trajeto é salvo como fato `var_menor_tempo_complexo/2`. Após calcular os
tempos de todos os trajetos, retorna o trajeto de menor tempo.

```prolog

% trajeto_menor_tempo_complexo(Trajeto, Tempo)
% Calcula o trajeto com menor tempo.
%   ?- trajeto_menor_tempo_complexo(Trajeto, Tempo).
%   Trajeto = [5, 8, 1, 3, 11, 9, 5],
%   Tempo = 418.9673728813559.
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
```

\pagebreak
## Cálculo do tempo total

O cálculo realizado pelo predicado `calcula_tempo_total` `_trajeto_complexo/2`
é um tanto complexo, em função das regras de negócio definidas. Calculamos
incialmente a carga total levada pelo camião a partir do armazém de origem, a
energia inicial do camião e utilizamos um predicado auxiliar
`calcula_trajeto/6`.

```prolog

% calcula_tempo_total_trajeto_complexo(Trajeto, Tempo)
% Calcula o tempo total de um Trajeto
%   ?- calcula_tempo_total_trajeto_complexo([5,11,8,1,9,3,5], 
%                                                     Tempo).
%   Tempo = 583.3203389830508.
calcula_tempo_total_trajeto_complexo(Trajeto, Tempo):-
	findall(Entrega, entrega(_, _, _, _, _, _), Entregas),
	cargaTotal(Entregas, CargaTotal),
 	carateristicasCam(Camiao,_,_,EnergiaInicial,_,_),
	calcula_trajeto(Camiao, _, Trajeto, CargaTotal,
                    EnergiaInicial, Tempo).
```

O predicado `calcula_trajeto/6` visita cada uma das cidades do trajeto,
recebendo como parâmetros:

- O camião que realiza as entregas
- Qual a cidade anteriormente visitada pelo camião
- Quais as cidades ainda por visitar
- Qual a carga com que o camião chega na cidade
- Qual a energia com a qual o camião chega na cidade
- [Variável] quanto tempo o camião leva  para realizar as entregas das cidades
  ainda por visitar

A partir destes parâmetros, o predicado calcula:

- Qual a próxima cidade por visitar
- Se o camião deve ou não fazer carregamento na cidade
- Se o camião fez ou não uma paragem adicional para chegar na cidade
- Qual a energia com a qual o camião sai da cidade
- Qual o tempo do percurso para a próxima cidade
- Qual o tempo de descarregamento da entrega na idade
- Se a cidade atual é uma cidade de entrega, ou a cidade do armazém de origem
- Qual a carga com a qual o camião chega na próxima cidade
- O tempo total gasto na cidade.

Dessa forma, conseguimos calcular o tempo total que um camião leva para
realizar cada entrega.

\pagebreak

```prolog
% calcula_trajeto(Camiao, CidadeAnterior, Trajeto, CargaAtual,
%                 EnergiaAtual, Tempo)
% Calcula o Tempo total que o camião leva para realizar as
% entregas dado um contexto de Trajeto. Este predicado é auxiliar
% ao predicado calcula_tempo_total_trajeto_complexo/2
calcula_trajeto(_, _, [_], _, _, Tempo):- Tempo is 0.
calcula_trajeto(Camiao, CidadeAnterior, [Cidade|Trajeto],
                        CargaAtual, EnergiaAtual, Tempo):-

	[ProximaCidade|_] = Trajeto,
	(
		(entrega(_, _, CargaEntrega, Cidade, _, TempoRetirada),
         Entrega = true);
		(CargaEntrega is 0, TempoRetirada is 0, Entrega = false)
	),

	CargaFinal is CargaAtual - CargaEntrega,

	calcula_caminho(Camiao, Cidade, ProximaCidade, CargaFinal, 
                    EnergiaCaminho, TempoCaminho),

	((length(Trajeto, 1), UltimaEntrega = true);
      (UltimaEntrega = false)),

	energia20(Camiao, Energia20),
	energia80(Camiao, Energia80),

	(
		(faz_paragem_adicional(Camiao, EnergiaAtual),
			FazParagem = true,
			FazCarregamento = true,
			((UltimaEntrega,
				energia20(Camiao, Energia20), 
                EnergiaSaida is Energia20 + EnergiaCaminho
             );
			 (EnergiaSaida is Energia80)),
			tempo_carregamento(Camiao, Energia20, EnergiaSaida,
                               TempoCarregamento),
			dadosCam_t_e_ta(Camiao,CidadeAnterior,Cidade,_,_,
                            TempoAdicional)
		);




		(faz_carregamento(Camiao, EnergiaAtual, EnergiaCaminho),
			FazParagem = false,
			FazCarregamento = true,
			((UltimaEntrega,
				energia20(Camiao, Energia20),
				EnergiaSaida is Energia20 + EnergiaCaminho);
			 (EnergiaSaida is Energia80)),
			tempo_carregamento(Camiao, EnergiaAtual, EnergiaSaida,
                               TempoCarregamento),
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

	calcula_trajeto(Camiao, Cidade, Trajeto, CargaFinal,
                    EnergiaFinal, TempoTotal),
	Tempo is TempoTotal + TempoEntrega.
```

Exemplo de cálculo do caminho `[5,1,9,3,8,11,5]`:

```

Cidade: 5
  ProximaCidade: 1;     EnergiaAtual: 80;       Entrega: false;
  CargaEntrega: 0;      TempoRetirada 0;        CargaAtual: 1000;
  CargaFinal: 1000;     EnergiaCaminho: 36.73;  TempoCaminho: 101.56;
  UltimaEntrega: false; EnergiaSaida: 80;       EnergiaFinal: 43.26;
  FazParagem: false;    FazCarregamento: false; TempoCarregamento: 0;
  + TempoAdicional: 0;  + TempoEspera: 0;       + TempoCaminho: 101.56;

Cidade: 1
  ProximaCidade: 9;     EnergiaAtual: 43.26;    Entrega: true;
  CargaEntrega: 200;    TempoRetirada 10;       CargaAtual: 1000;
  CargaFinal: 800;      EnergiaCaminho: 52.05;  TempoCaminho: 130.12;
  UltimaEntrega: false; EnergiaSaida: 64.0;     EnergiaFinal: 11.94;
  FazParagem: false;    FazCarregamento: true;  TempoCarregamento: 25.92;
  + TempoAdicional: 0;  + TempoEspera: 25.92;   + TempoCaminho: 130.12;

Cidade: 9
  ProximaCidade: 3;     EnergiaAtual: 11.94;    Entrega: true;
  CargaEntrega: 150;    TempoRetirada 9;        CargaAtual: 800;
  CargaFinal: 650;      EnergiaCaminho: 24.17;  TempoCaminho: 59.39;
  UltimaEntrega: false; EnergiaSaida: 64.0;     EnergiaFinal: 39.82;
  FazParagem: true;     FazCarregamento: true;  TempoCarregamento: 60.0;
  + TempoAdicional: 53; + TempoEspera: 60.0;    + TempoCaminho: 59.39;

Cidade: 3
  ProximaCidade: 8;     EnergiaAtual: 39.82;    Entrega: true;
  CargaEntrega: 100;    TempoRetirada 7;        CargaAtual: 650;
  CargaFinal: 550;      EnergiaCaminho: 5.45;   TempoCaminho: 25.92;
  UltimaEntrega: false; EnergiaSaida: 39.82;    EnergiaFinal: 34.36;
  FazParagem: false;    FazCarregamento: false; TempoCarregamento: 0;
  + TempoAdicional: 0;  + TempoEspera: 7;       + TempoCaminho: 25.92;

Cidade: 8
  ProximaCidade: 11;    EnergiaAtual: 34.36;    Entrega: true;
  CargaEntrega: 120;    TempoRetirada 8;        CargaAtual: 550;
  CargaFinal: 430;      EnergiaCaminho: 14.78;  TempoCaminho: 35.61;
  UltimaEntrega: false; EnergiaSaida: 34.36;    EnergiaFinal: 19.58;
  FazParagem: false;    FazCarregamento: false; TempoCarregamento: 0;
  + TempoAdicional: 0;  + TempoEspera: 8;       + TempoCaminho: 35.61;

Cidade: 11
  ProximaCidade: 5;     EnergiaAtual: 19.58;    Entrega: true;
  CargaEntrega: 300;    TempoRetirada 20;       CargaAtual: 430;
  CargaFinal: 130;      EnergiaCaminho: 16.16;  TempoCaminho: 35.56;
  UltimaEntrega: true;  EnergiaSaida: 32.16;    EnergiaFinal: 16.00;
  FazParagem: false;    FazCarregamento: true;  TempoCarregamento: 15.72;
  + TempoAdicional: 0;  + TempoEspera: 20;      + TempoCaminho: 35.56;
```

\pagebreak
## Predicados auxiliares

A seguir são definidos os predicados auxiliares utilizados nos predicados 
`calcula_tempo_total` `_trajeto_complexo/2` e `calcula_trajeto/6`:

```prolog

% energia80(Camiao, Energia80)
% Calcula o valor da energia do camião quando carregado a 80%
%   ?- energia80(eTruck01, Energia80).
%   Energia80 = 64.0.
energia80(Camiao, Energia80):-
	carateristicasCam(Camiao,_,_,Energia100,_,_),
	Energia80 is 0.8 * Energia100.

% energia20(Camiao, Energia20)
% Calcula o valor da energia do camião quando carregado a 20%
%   ?- energia20(eTruck01, Energia20).
%   Energia20 = 16.0.
energia20(Camiao, Energia20):-
	carateristicasCam(Camiao,_,_,Energia100,_,_),
	Energia20 is 0.2 * Energia100.

% tempo_carregamento(Camiao, EnergiaAtual, EnergiaFinal, Tempo)
% Calcula o Tempo que um camião leva para carregar de
% EnergiaInicial a Energia Final
%   ?- tempo_carregamento(eTruck01, 43.26, 64, Tempo).
%   Tempo = 25.925.
tempo_carregamento(Camiao, EnergiaAtual, EnergiaFinal, Tempo):-
	carateristicasCam(Camiao,_,_,_,_,TempoCarregamento20a80),
	energia80(Camiao, Energia80),
	energia20(Camiao, Energia20),
	Tempo is (EnergiaFinal - EnergiaAtual) *
      TempoCarregamento20a80 / (Energia80 - Energia20).

% faz_carregamento(Camiao, EnergiaAtual, EnergiaProximoCaminho):-
% Decide se o camião deve ou não carregamento, em função da sua
% energia atual e da energia necessária para completar a próxima
% viagem.
%   ?- faz_carregamento(eTruck01, 80, 36.73).
%   false.
faz_carregamento(Camiao, EnergiaAtual, EnergiaProximoCaminho):-
	energia20(Camiao, Energia20),
	EnergiaFinal is EnergiaAtual - EnergiaProximoCaminho,
	EnergiaFinal < Energia20.



% faz_paragem_adicional(Camiao, EnergiaAtual)
% Decide se o camião fez ou não fez uma paragem adicional para
% que chegasse até sua EnergiaAtual (abaixo de 20%).
%   ?- faz_paragem_adicional(eTruck01, 11.94).
%   true.
faz_paragem_adicional(Camiao, EnergiaAtual):-
	energia20(Camiao, Energia20),
	EnergiaAtual < Energia20.

% calcula_caminho(Camiao, CidadeOrigem, CidadeDestino, 
%                 CargaEntrega, Energia, Tempo)
% Calcula a Energia e o Tempo gastos no trajeto de CidadeOrigem
% e CidadeEntrega
%   ?- calcula_caminho(eTruck01, 5,1, 870, Energia, Tempo).
%   Energia = 36.17542372881356,
%   Tempo = 100.01440677966102.
calcula_caminho(Camiao, CidadeOrigem, CidadeDestino, CargaEntrega,
                Energia, Tempo):-
	carateristicasCam(Camiao,Tara,CapacidadeCarga,_,_,_),
	dadosCam_t_e_ta(Camiao, CidadeOrigem, CidadeDestino,
                    TempoCaminho, EnergiaCaminho, _),
	PesoAtualCamiao is Tara + CargaEntrega,
	PesoMaximoCamiao is Tara + CapacidadeCarga,
	Energia is EnergiaCaminho *
      PesoAtualCamiao / PesoMaximoCamiao,
	Tempo is TempoCaminho * PesoAtualCamiao / PesoMaximoCamiao.

% cargaTotal(Entregas, CargaTotal)
% Calcula a carga total de um conjunto de entregas
%   ?- cargaTotal([ 4439, 4438, 4445, 4443, 4449 ], CargaTotal).
%   CargaTotal = 870.
cargaTotal([], 0).
cargaTotal([Entrega|Entregas], CargaTotal):-
	cargaTotal(Entregas, CargaSubTotal),
	entrega(Entrega, _, Carga, _, _, _),
	CargaTotal is CargaSubTotal + Carga.
```

\pagebreak
