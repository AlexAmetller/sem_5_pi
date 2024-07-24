# Parametrização da condição de término do AG

Pretendemos adicionar duas condições de término que ao AG otimizado:

- Término por estabilização da população
- Obtenção de um indivíduo com qualidade superior a um valor indicado

Para tanto, é suficiente adicionar outro predicado `gera_populacao/3` que
interrompa a execução do algoritmo caso uma destas duas condições ocorra:

```prolog
gera_geracao(NumGeracaoAtual, _, AtualPopulacaoAvaliada):-
	estabilizou_populacao(NumGeracaoAtual, AtualPopulacaoAvaliada);
	melhor_solucao_suficiente(NumGeracaoAtual, AtualPopulacaoAvaliada),
	gera_geracao(NumGeracoes, NumGeracoes, AtualPopulacaoAvaliada).
```

Caso a população esteja estabilizada (_estabilizou_populacao/1_) ou a melhor
solução da população atual seja suficientemente boa
(_melhor_solucao_suficiente/1_), interrompemos a execução afirmando
`gera_geracao(N,N,_)` que é a condição de término do predicado.

## Término por estabilização

Determinamos que uma população está estabilizada se a população atual for a
mesma que um número `N` de gerações anteriores. Entre uma e outra geração
podem não haver diferenças na população, o que não indica estabilização, pois
na próxima pode haver mutações e cruzamentos melhores. Dessa forma,
utilizamos um valor `N` de pelo menos 4 nesta implementação. Devemos criar um
fato que guarda a população de 4 gerações anteriores, comparando a atual com a
mesma.

```prolog
% estabilizou_populacao/2
%   verifica se a populacao atual é a mesma de 4 geracoes anteriores
estabilizou_populacao(NumGeracaoAtual, AtualPopulacaoAvaliada):-
	maplist(arg(1), AtualPopulacaoAvaliada, PopulacaoAtual),
	assertz(geracao_anterior(NumGeracaoAtual, PopulacaoAtual)),
	NumGeracaoAtual > 4, % aqui fazemos a comparacao
	NumGeracaoAnterior = NumGeracaoAtual - 4,
	geracao_anterior(NumGeracaoAnterior, PopulacaoAnterior),
	PopulacaoAnterior == PopulacaoAtual.
```

## ~~Término por suficiência da solução~~

\pagebreak
