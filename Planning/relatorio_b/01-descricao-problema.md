# Descrição do problema

Uma rede de carrigas de entrega eléctricos pretende fazer entregas de
mercadorias em diferentes cidades. Uma carrinha realiza um número específico
de entregas em um dia, sendo uma entrega destinada a uma cidade.

Informações relevantes:

- A carrinha sai sempre de uma cidade origem e volta, no final das entregas,
  para esta mesma cidade. 

- A carrinha sai da cidade origem com 100% da sua bateria carregada e realiza
  carregamentos até 80% da mesma ao longo do trajeto, de forma a nunca
  ultrapassar o limite inferior de 20% de bateria. 

- Caso não seja possível relizar uma entrega chegando na cidade de destino com
  mais de 20%, a carrinha realiza uma paragem adicional. 

- Durante o trajeto, o peso da carrinha diminui, pois a carga da entrega já
  não é transportada. 

- Ao chegar em uma cidade, a carrinha demora um certo tempo até realizar o
  descarregamento da entrega. Caso também faça um carregamento, contabiliza-se
  o maior tempo.

- A energia gasta no percurso entre duas cidades e o tempo do percurso são
  função do peso do camião durante o trajeto, da tara do camião, e do peso
  máximo do camião.

Fatos da base de dados:

- `idArmazem(<local>,<codigo>)`

    ```prolog
    idArmazem('Arouca',  1).
    ```

- `cidadeArmazem(<codigo>)`

    ```prolog
    cidadeArmazem(5).
    ```

- ```
entrega(<idEntrega>, <data>, <massaEntrefa>,
<armazemEntrega>, <tempoColocacao>, <tempoRetirada>)
```

    ```prolog
    entrega(4439, 20221205, 200, 1,  8,  10).
    ```

- ```
carateristicasCam(<nome_camiao>,<tara>,<capacidade_carga>,
<carga_total_baterias>,<autonomia>,<t_recarr_bat_20a80>)
```

    ```prolog
    carateristicasCam(eTruck01,7500,4300,80,100,60).
    ```

- ```
dadosCam_t_e_ta(<nome_camiao>,<cidade_origem>,
<cidade_destino>,<tempo>,<energia>,<tempo_adicional>)
```

    ```prolog
    dadosCam_t_e_ta(eTruck01,1,2,122,42,0).
    ```

\pagebreak
