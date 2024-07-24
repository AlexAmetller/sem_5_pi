#  Análise de eficácia/eficiência

Deseja-se comparar as soluções fornecidas pelo Algoritmo Genético base (AG)
definido em [_Item 1.3_](#AG) com o novo algoritmo otimizado através da
aplicação das modificações descritas em [_Item 2_](#cap2), [_Item 3_](#cap3) e
[_Item 4_](#cap4). Para tanto, desenvolvemos uma tabela comparativa com os
seguintes elementos:

- Melhor solução, considerando todas as possíveis soluções (1)
- Melhor solução heurística (2)
- Melhor solução do algoritmo genético otimizado (3)
- Melhor solução do algoritmo genético base (4)
- Média da população da geração final do algoritmo genético otimizado (5)
- Média da população da geração final do algoritmo genético base (6)

As condições de parametrização utilizadas para simulações são:

- Número de gerações: 20
- Dimensão da população: 30
- Probabilidade de cruzamento: 40%
- Probabilidade de mutação: 40%
- Ganho em torneio: 1.2

Entende-se aqui por _Ganho em torneio_ o coeficiente aplicado aleatoriamente
na comparação entre dois indivíduos sorteados por torneio. E.g: um indivíduo
com qualidade até 20% superior a outro pode ou não perder o torneio
aleatoriamente.

Como o algoritmo não é determinístico, pode haver grande diferença entre duas
soluções geradas. Forma, portanto, repetidas 10 vezes cada simulação do
algoritmo base do algoritmo otimizado e selecionados os melhores resultados
destas simulações.

| Nº Entregas | Melhor sol. | Melhor sol. heur. | Melhor. sol AG otm. | Melhor sol. AG base | Média AG otm. | Média AG base |
| ----------- | ----------- | ----------------- | ------------------- | ------------------- | ------------- | ------------- |
| 6           | 454         | 489               | 454                 | 458                 | 511           | 533           |
| 7           | 497         | 546               | 500                 | 504                 | 567           | 682           |
| 8           | 530         | 585               | 532                 | 540                 | 603           | 782           |
| 9           | 559         | 614               | 566                 | 598                 | 686           | 880           |
| 10          | 602         | 668               | 646                 | 696                 | 696           | 1034          |
| 11          | -           | 692               | 685                 | 829                 | 748           | 1128          |
| 12          | -           | 729               | 729                 | 845                 | 828           | 1260          |

Pela análise dos resultados, é possível concluir que o algoritmo otimizado
apresenta melhores resultados que o algoritmo base, principalmente para um
número maior de entregas. Em quase todos os casos, o algoritmo genético
otimizado apresenta resultados superiores à melhor solução utilizando
heurísticas. Nota-se que os tempos médios do AG otimizado são bastante
inferiores aos tempos médios do AG base, o que indica que a população da
última geração se aproxima muito mais a uma solução ideal no primeiro caso.

Nota-se que para 12 entregas a melhor solução do algoritmo otimizado é a mesma
que a da melhor heurística. Isto indica que o restante da população gerado
através de mutações e cruzamentos não possui nenhum indivíduo com melhor
genética que o melhor indivíduo da população original. Este evento pode
decorrer do fato de não haver mutações ou cruzamentos suficientes, não
haver indivíduos suficientes ou gerações suficientes para gerar um indivíduo
superior, ou da eventualidade da solução heurística ser de fato a melhor
solução.

\pagebreak
