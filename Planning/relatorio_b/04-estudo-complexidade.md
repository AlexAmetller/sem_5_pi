# Estudo de complexidade

> *Aumentar a dimensão do problema (colocando mais armazéns a visitar) e
> verificar até que dimensão é viável proceder do modo adotado (com um gerador
> de todas as soluções) efetuando um estudo de complexidade do problema.*


São criadas entregas seguind o o seguinte esquema para avaliação da
complexidade:

```prolog
entrega(4439, 20221205, 200, 1,  8,  10).
entrega(4438, 20221205, 150, 9,  7,  9).
entrega(4445, 20221205, 100, 3,  5,  7).
entrega(4443, 20221205, 120, 8,  6,  8).
entrega(4449, 20221205, 300, 11, 15, 20).
entrega(4398, 20221205, 310, 17, 16, 20).
entrega(4432, 20221205, 270, 14, 14, 18).
entrega(4437, 20221205, 180, 12, 9,  11).
entrega(4451, 20221205, 220, 6,  9,  12).
entrega(4452, 20221205, 390, 13, 21, 26).
```

O tempo despendido no cálculo é medido utilizando o seguinte predicado:

```prolog
complexidade():-
	statistics(walltime, [TimeSinceStart | [TimeSinceLastCall]]),
	trajeto_menor_tempo_complexo(Trajeto, Tempo),
	statistics(walltime, [NewTimeSinceStart | [TSol]]),
	format(user_output, "TSol: ~p ms, Tempo: ~p s, Trajeto: ~p~n",
           [TSol, Tempo, Trajeto]).
```

O número de soluções calculadas é `n!` onde `n` é o número de entregas.
Concluímos, a partir da tabela gerada, portanto, que o tempo de cálculo é
proporcional ao número de soluções, sendo a a complexidade temporal do
problema `O(n!)`.

| Nº Entregas   | Nº de soluções   | Sequência de entregas                        | Melhor tempo   | Tempo de geração de solução   |
| ------------- | ---------------- | -----------------------                      | -------------- | ----------------------------- |
| 1             | 1                | [5, 1,  5]                                   | 195 min        | 13 ms                         |
| 2             | 2                | [5, 9,  1, 5]                                | 294 min        | 11 ms                         |
| 3             | 6                | [5, 9,  3, 1,  5]                            | 324 min        | 11 ms                         |
| 4             | 24               | [5, 9,  8, 3,  1,  5]                        | 347 min        | 12 ms                         |
| 5             | 120              | [5, 8,  1, 3,  11, 9,  5]                    | 418 min        | 15 ms                         |
| 6             | 720              | [5, 8,  3, 1,  17, 11, 9,  5]                | 454 min        | 33 ms                         |
| 7             | 5040             | [5, 17, 8, 3,  1,  14, 11, 9,  5]            | 497 min        | 184 ms                        |
| 8             | 40320            | [5, 17, 8, 3,  12, 1,  14, 11, 9,  5]        | 530 min        | 1570 ms                       |
| 9             | 362880           | [5, 8,  3, 12, 6,  14, 1,  17, 11, 9,  5]    | 559 min        | 15246 ms (~15s)               |
| 10            | 3628800          | [5, 17, 8, 3,  12, 6,  14, 1,  11, 13, 9, 5] | 602 min        | 172727 ms (~3m)               |
| 11            | 39916800         | -                                            | -              | 30m+                          |

\pagebreak
