# Seleção da nova geração da população {#cap4}

Até o momento os indivíduos da geração atual eram possivelmente substituídos
pelos novos elementos cruzados e mutados, que passam a compor a próxima
geração. Deseja-se agora permitir a passagem dos melhores indivíduos da
geração atual para próxima geração, bem como dos melhores elementos cruzados e
os melhores elementos mutados. O predicado _gera_geração/3_ definido em
[_Item 1.3_](#AG) é, portanto, alterado para realizar os seguintes
passos:

1. Realiza-se cruzamento da população atual `P'`, gerando a população `P''`
2. Realiza-se a mutação da população `P''` gerando a população `P'''`
3. Agrupam-se os indivíduos das populações `P'`, `P''`e `P'''`, removendo
   indivíduos duplicados e gerando a população `Q` .
4. Avalia-se a população `Q` e ordena-se por melhor qualidade
5. Selecionam-se os 2 melhores indivíduos da população `Q` passar à próxima
   geração.
6. Ordenam-se os indivíduos restantes partir de um algoritmo de _torneio_, onde
   indivíduos com menor avaliação possam passar para a próxima geração, mas
   possuam menor probabilidade de o fazê-lo.

## Ordenação por torneio

Iniciamos por definir os novos predicados _ordena_torneio/2_ e
_ordena_população_torneio/2_, baseado nos predicados de ordenação _orderna/2_
e _ordena_população/2_, definidos em [_Item 1.2_](#AG). Adicionaremos um
_peso_ aleatório com valor variando entre `1` e `1.2` que deve ser
multiplicado pela qualidade do pior indivíduo quando comparado a um indivíduo
melhor. Dessa forma, há a possibilidade de um indivíduo com desempenho até
20% inferior ao outro ser selecionado para a próxima geração.

Utilizamos do predicado `predsort/3` para realizar a ordenação. O predicado
toma como argumento um predicado que compara dois elementos `+Pred`, aqui
definido como `ordena_torneio/3`. O predicado retorna uma atribuição para `R`,
seja essa `>, < ou =`, comparando dois elementos. Utilizamos do peso adicional
para definir esse valor.

```prolog
% ordena_populacao_torneio/2
%   ordena as populacoes avaliadas no formato de tuplo Individuo*Valor,
%   permite indivíduos de menor avaliacao tomar posicões mais elevadas
%     ?- ordena_populacao_torneio([[]*11, []*15, []*10], X).
%     X = [[]*11, []*10, []*15].
%     ?- ordena_populacao_torneio([[]*11, []*15, []*10], X).
%     X = [[]*10, []*11, []*15].
ordena_populacao_torneio(Avaliacoes, AvaliacoesOrdenadas):-
	predsort(ordena_torneio, Avaliacoes, AvaliacoesOrdenadas),!.


% ordena_torneio/3 
%   implementacao do +Pred do predicado `predsort`.
%   permite atribuir o valor `>` a R no caso V1 = 11, V2 = 10
%   se o Peso gerado aleatóriamente for superior a 1.1
%   exemplo:
%     ?- ordena_torneio(R, []*11, []*10). % Peso aleatório < 1.1
%     R = (<).
%     ?- ordena_torneio(R, []*11, []*10). % Peso aleatório > 1.1
%     R = (>).
ordena_torneio(R, _*V1, _*V2):-
    random(1, 1.2, Peso),
	V1 > V2,!,
	(V1 > V2 * Peso -> R = > ; R = < ).

ordena_torneio(R, _*V1, _*V2):-
    random(1, 1.2, Peso),
	V1 < V2,!,
	(V1 * Peso < V2 -> R = < ; R = > ).

ordena_torneio(R, _, _):- R = > .
```

Definida a forma de ordenação, reimplantamos o predicado _gera_geração/3_
para adequar-se aos passos definidos neste capítulo, gerando todas as listas
referidas:

```prolog
% gera_geracao/3
gera_geracao(NumGeracoes,NumGeracoes,AtualPopulacaoAvaliada):-!.
gera_geracao(NumGeracaoAtual,NumGeracoes,AtualPopulacaoAvaliada):-
	format(user_output, '~n===> Geracao ~p: ~n', [NumGeracaoAtual]),
	maplist(arg(1), AtualPopulacaoAvaliada, P1), % P1 populacao atual
	cruzamento(P1, P2),        % P2 populacao cruzada
	mutacao(P2, P3),           % P3 populacao mutada
    append([P1, P2, P3], Q0),  % Q0 = P1 + P2 + P3 = populacao total
	list_to_set(Q0, Q1),       % Q1 = populacao total sem repeticoes
	avalia_populacao(Q1, A1),  % A1 avaliacoes na forma [...]*Valor
	ordena_populacao(A1, O1),  % O1 avaliacoes ordenadas menor->maior
    select(Melhor1, O1, O2),   % Melhor1 = melhor indivíduo do set
	select(Melhor2, O2, O3),   % Melhor2 = segundo melhor do set
							   % O3 populacao total sem Melhor1 e Melhor2
    ordena_populacao_torneio(O3, O4), % ordenacao do restante por torneio
	dim_populacao(DimPopulacao),
    N is DimPopulacao - 2,
    sublista(O4, 0, N, O5, _, _), % O5 = N-2 inidívudos restantes
	append([Melhor1, Melhor2], O5, NovaPopulacaoOrdenada),
	NumProximaGeracao is NumGeracaoAtual + 1,
	gera_geracao(NumProximaGeracao,NumGeracoes,NovaPopulacaoOrdenada).
```

Exemplo de aplicação do novo algoritmo de geração:

```txt
Geracao 3: ==================== 
> P1: populacao atual 
  [4398,4443,4449,4445,4439,4432,4438], [4398,4445,4443,4449,4439,4432,4438]
  [4398,4439,4432,4438,4445,4443,4449], [4438,4443,4449,4445,4439,4432,4398]
  [4449,4443,4398,4432,4439,4445,4438]
> P2: populacao cruzada 
  [4398,4443,4449,4445,4439,4432,4438], [4398,4445,4443,4449,4439,4432,4438]
  [4398,4439,4432,4438,4445,4443,4449], [4438,4443,4449,4445,4439,4432,4398]
  [4449,4443,4398,4432,4439,4445,4438]
> P3: populacao mutada 
  [4398,4443,4449,4445,4439,4432,4438], [4398,4445,4443,4449,4439,4432,4438]
  [4398,4439,4432,4438,4445,4443,4449], [4445,4443,4449,4438,4439,4432,4398]
  [4449,4443,4398,4432,4439,4445,4438]
> Q0: populacao total 
  [4398,4443,4449,4445,4439,4432,4438], [4398,4445,4443,4449,4439,4432,4438]
  [4398,4439,4432,4438,4445,4443,4449], [4438,4443,4449,4445,4439,4432,4398]
  [4449,4443,4398,4432,4439,4445,4438], [4398,4443,4449,4445,4439,4432,4438]
  [4398,4445,4443,4449,4439,4432,4438], [4398,4439,4432,4438,4445,4443,4449]
  [4438,4443,4449,4445,4439,4432,4398], [4449,4443,4398,4432,4439,4445,4438]
  [4398,4443,4449,4445,4439,4432,4438], [4398,4445,4443,4449,4439,4432,4438]
  [4398,4439,4432,4438,4445,4443,4449], [4445,4443,4449,4438,4439,4432,4398]
  [4449,4443,4398,4432,4439,4445,4438]
> Q1: populacao total repeticoes removidas 
  [4398,4443,4449,4445,4439,4432,4438], [4398,4445,4443,4449,4439,4432,4438]
  [4398,4439,4432,4438,4445,4443,4449], [4438,4443,4449,4445,4439,4432,4398]
  [4449,4443,4398,4432,4439,4445,4438], [4445,4443,4449,4438,4439,4432,4398]
> A1: avaliacoes 
  [4398,4443,4449,4445,4439,4432,4438]*530.5858050847457
  [4398,4445,4443,4449,4439,4432,4438]*534.9917372881356
  [4398,4439,4432,4438,4445,4443,4449]*576.3099576271187
  [4438,4443,4449,4445,4439,4432,4398]*551.9635593220338
  [4449,4443,4398,4432,4439,4445,4438]*546.2794491525424
  [4445,4443,4449,4438,4439,4432,4398]*624.185593220339
> O1: avaliacoes ordenadas 
  [4398,4443,4449,4445,4439,4432,4438]*530.5858050847457
  [4398,4445,4443,4449,4439,4432,4438]*534.9917372881356
  [4449,4443,4398,4432,4439,4445,4438]*546.2794491525424
  [4438,4443,4449,4445,4439,4432,4398]*551.9635593220338
  [4398,4439,4432,4438,4445,4443,4449]*576.3099576271187
  [4445,4443,4449,4438,4439,4432,4398]*624.185593220339




> O3: avaliacoes restantes ordenadas (sem M1, M2) 
  [4449,4443,4398,4432,4439,4445,4438]*546.2794491525424
  [4438,4443,4449,4445,4439,4432,4398]*551.9635593220338
  [4398,4439,4432,4438,4445,4443,4449]*576.3099576271187
  [4445,4443,4449,4438,4439,4432,4398]*624.185593220339
> O4: avaliacoes restantes ordenadas por torneio 
  [4398,4439,4432,4438,4445,4443,4449]*576.3099576271187
  [4438,4443,4449,4445,4439,4432,4398]*551.9635593220338
  [4445,4443,4449,4438,4439,4432,4398]*624.185593220339
  [4449,4443,4398,4432,4439,4445,4438]*546.2794491525424
> O5: avaliacoes de torneio selecionadas 
  [4398,4439,4432,4438,4445,4443,4449]*576.3099576271187
  [4438,4443,4449,4445,4439,4432,4398]*551.9635593220338
  [4445,4443,4449,4438,4439,4432,4398]*624.185593220339
> Melhor1: [4398,4443,4449,4445,4439,4432,4438]*530.5858050847457
  Melhor2: [4398,4445,4443,4449,4439,4432,4438]*534.9917372881356
> DimPopulacao: 5, N: 3
> NovaPopulacaoOrdenada: 
  [4398,4443,4449,4445,4439,4432,4438]*530.5858050847457
  [4398,4445,4443,4449,4439,4432,4438]*534.9917372881356
  [4398,4439,4432,4438,4445,4443,4449]*576.3099576271187
  [4438,4443,4449,4445,4439,4432,4398]*551.9635593220338
  [4445,4443,4449,4438,4439,4432,4398]*624.185593220339
```

\pagebreak
