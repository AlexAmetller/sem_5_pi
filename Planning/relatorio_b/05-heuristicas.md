# Heuristicas

> *Implementar heurísticas que possam rapidamente gerar uma solução (não
> necessariamente a melhor) e avaliar a qualidade dessas heurísticas (por
> exemplo, entregar no armazém mais próximo; efetuar de seguida a entrega com
> maior massa; combinar distância para a entrega com massa entregue).*

## Heuristica da menor distância

Definimos um predicado `solucao_heuristica_menor_distancia/2` que retorna o
Trajeto utilizando a heurística de menor distância. Para gerar esse trajeto,
utilizamos um predicado auxiliar `trajeto_mais_proximo/3` que recebe como
parâmetro a cidade da entrega atual e as cidades ainda por visitar, e decide a
próxima cidade a visitar utilizando o predicado `cidade_mais_proxima/3`,
gerando assim uma lista em que o elemento a frente do anterior sempre é aquele
cuja distância é a menor.

```prolog
solucao_heuristica_menor_distancia(Trajeto, Tempo):-
	cidadeArmazem(Origem),
	findall(Cidade, entrega(_, _, _, Cidade, _, _), Cidades),
	trajeto_mais_proximo(Origem, Cidades, TrajetoMaisProximo),
	append([Origem|TrajetoMaisProximo], [Origem], Trajeto),
	calcula_tempo_total_trajeto_complexo(Trajeto, Tempo),!.

trajeto_mais_proximo(Origem, [], []):-true.
trajeto_mais_proximo(Origem, Cidades, Trajeto):-
	cidade_mais_proxima(Origem, Cidades, MaisProxima),
	delete(Cidades, MaisProxima, DemaisCidades),
	trajeto_mais_proximo(MaisProxima, DemaisCidades,
                         TrajetoRemanescente),
	[MaisProxima|TrajetoRemanescente] = Trajeto, !.
```

O predicado `cidade_mais_proxima/3` verifica, a partir da lista de cidades por
visitar, qual aquela que deve ser visitada em sequência de forma que o tempo
de trajeto com carga cheia do camião entre cidades seja o mínimo.

```prolog
cidade_mais_proxima(Origem, [Destino], Destino):-true.
cidade_mais_proxima(Origem, Destinos, MaisProxima):-
	[Cidade|DemaisCidades] = Destinos,
	cidade_mais_proxima(Origem, DemaisCidades,
                        MaisProximaDemaisCidades),
	dadosCam_t_e_ta(_,Origem,Cidade,Tempo1,_,_),
	dadosCam_t_e_ta(_,Origem,MaisProximaDemaisCidades,Tempo2,_,_),
	((Tempo1 < Tempo2, MaisProxima is Cidade);
	 (MaisProxima is MaisProximaDemaisCidades)),!.
```

## Heuristica da maior massa

A implementação da heurística de maior massa utiliza de predicados idênticos
aos predicados `solucao_heuristica_menor_distancia/2` e
`cidade_mais_proxima/3`, com a diferença que o critério de escolha da próxima
cidade a visitar é definido pelo predicado `cidade_maior_peso/2`. Este
predicado determina, com base nos destinos ainda por visitar, que a próxima
cidade a ser visita é aquela cuja entrega tem maior peso, de forma a reduzir o
peso carregado pelo camião o mais rapido possível.

```prolog
cidade_maior_peso([Destino], Destino):-true.
cidade_maior_peso(Destinos, CidadeMaiorPeso):-
	[Cidade|DemaisCidades] = Destinos,
	cidade_maior_peso(DemaisCidades,
                      CidadeMaiorPesoDemaisCidades),
	entrega(_,_,Peso1,Cidade,_,_),
	entrega(_,_,Peso2,CidadeMaiorPesoDemaisCidades,_,_),
	((Peso1 > Peso2, CidadeMaiorPeso is Cidade);
	 (CidadeMaiorPeso is CidadeMaiorPesoDemaisCidades)),!.
```

## Heuristica combinada

Semelhante às heurísticas anteriores, a heurística combinada utiliza de um
predicado para definir qual a próxima cidade a visitar, denominada aqui de
`cidade_mista/3`. Como aqui queremos combinar a solução de menor tempo de
trajeto e maior peso descarregado, utilizamos um parâmetro denominado `Misto`
definido como `Peso da entrega / Tempo entre cidades`.

```prolog
cidade_mista(Origem, [Destino], Destino):-true.
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
```

## Resultados

Calculamos as solução com as heurísticas e ótima, bem como as diferenças de
tempo obtidas.

| Nº Entregas | Tempo solução ótima | Tempo heurística menor distância | Tempo heurística maior massa | Tempo heurística combinada | Melhor solução heurísticas |
| ----------- | ------------------- | -------------------------------- | ---------------------------- | -------------------------- | -------------------------- |
| 1           | 195                 | 195 (+0%)                        | 195 (+0%)                    | 195 (+0%)                  | 195 (+0%)                  |
| 2           | 284                 | 292 (+3%)                        | 284 (+0%)                    | 292 (+3%)                  | 284 (+0%)                  |
| 3           | 317                 | 368 (+16%)                       | 444 (+40%)                   | 317 (+0%)                  | 317 (+0%)                  |
| 4           | 333                 | 384 (+15%)                       | 466 (+40%)                   | 384 (+15%)                 | 384 (+15%)                 |
| 5           | 412                 | 451 (+9%)                        | 574 (+39%)                   | 430 (+4%)                  | 430 (+4%)                  |
| 6           | 453                 | 497 (+10%)                       | 622 (+37%)                   | 489 (+8%)                  | 489 (+8%)                  |
| 7           | 500                 | 546 (+9%)                        | 653 (+31%)                   | 558 (+12%)                 | 546 (+9%)                  |
| 8           | 532                 | 585 (+10%)                       | 640 (+20%)                   | 632 (+19%)                 | 585 (+10%)                 |
| 9           | 562                 | 614 (+9%)                        | 696 (+24%)                   | 711 (+26%)                 | 614 (+9%)                  |
| 10          | 618                 | 668 (+8%)                        | 845 (+37%)                   | 773 (+25%)                 | 668 (+8%)                  |

Concluímos que cada uma das heurísticas podem fornecer resultados melhores que
as demais em determinadas situações, e que as diferenças encontradas até o
limite do que é calculável como solução ótima não ultrapassa 15%. Esse
resultado pode ou não ser aceitável, dependendo das especificações do cliente.
As heurísticas, no entanto, fornecem uma forma viável de cálculo da solução
para problemas com número de entregas acima de 10.
